const apis = require("../data/apis.json");
const texts = require("../data/texts.json");
const http = require("./http.js");
const utils = require("../utils/utils.js");

/**
 * @description Live lookups against the stats API: killswitch, events, rank reset, patch notes
 *              and per-character adepts.
 *
 * These are deliberately not part of dataService. That service owns the roster the canvas
 * commands draw from, keeps it in a Mongo snapshot and falls back to bundled files, because a
 * bot that cannot answer /random is broken. None of that applies here: this data is only ever
 * shown as text, and "the API is down" is an acceptable answer for it. What it does need is a
 * short cache, so a busy guild spamming /killswitch does not hammer someone else's API.
 */

const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map();

/**
 * @param {String} path - API path, used as the cache key.
 * @param {String} version - Bot version, sent in the User-Agent.
 * @description GET a path, reusing a recent response when there is one. A failure is not
 *              cached, so an outage does not keep answering wrong for five minutes.
 */
async function fetchCached(path, version) {
    const cached = cache.get(path);
    if (cached && cached.expiresAt > Date.now()) return cached.promise;

    const promise = http.getJson(`https://${apis.dbdStats.host}${path}`, {
        headers: { 'User-Agent': http.userAgent(version) }
    }).catch((err) => {
        cache.delete(path);
        throw err;
    });

    cache.set(path, { promise: promise, expiresAt: Date.now() + CACHE_TTL });
    return promise;
}

function getKillswitch(version) {
    return fetchCached(apis.dbdStats.killswitch, version);
}

function getEvents(version) {
    return fetchCached(apis.dbdStats.events, version);
}

function getRankReset(version) {
    return fetchCached(apis.dbdStats.rankReset, version);
}

function getPatchNotes(version) {
    return fetchCached(apis.dbdStats.patchNotes, version);
}

/**
 * @param {String} version - Bot version.
 * @param {String} steamId - SteamID in 64 bits.
 * @description Adept counts for a player. Not cached: it is per-player and changes as they play.
 */
function getPlayerAdepts(version, steamId) {
    return http.getJson(`https://${apis.dbdStats.host}${apis.dbdStats.playerAdepts}${steamId}`, {
        headers: { 'User-Agent': http.userAgent(version) }
    });
}

// Which endpoint names a killswitched entry, by the type the killswitch itself reports.
const KILLSWITCH_SOURCES = {
    offering: "offerings",
    perk: "perks",
    item: "items",
    addon: "addons",
    map: "maps",
    character: "characters"
};

/**
 * @param {String} type - Killswitch entry type.
 * @param {String} version - Bot version.
 * @description Id -> display name for one kind of unlockable, cached like everything else here.
 */
async function getNameTable(type, version) {
    const endpoint = KILLSWITCH_SOURCES[type];
    if (!endpoint) return {};

    const payload = await fetchCached(apis.dbdStats[endpoint] || `/api/${endpoint}`, version);
    const table = {};
    for (const [key, entry] of Object.entries(payload)) {
        if (entry && entry.name) table[key] = entry.name;
        // Characters are keyed by index, so their own id is what the killswitch would name.
        if (entry && entry.id && entry.name) table[entry.id] = entry.name;
    }
    return table;
}

/**
 * @param {String} id - Raw id, e.g. "EclipseThemeOffering" or "Addon_Beartrap_001".
 * @description Readable fallback for an id the API cannot name: strip the type noise and
 *              split the camel case, so "EclipseThemeOffering" reads "Eclipse Theme".
 */
function prettifyId(id) {
    return String(id)
        .replace(/^Addon_/i, "")
        .replace(/(Offering|Perk|Addon)$/i, "")
        .replace(/[_-]+/g, " ")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .trim() || String(id);
}

/**
 * @param {String} version - Bot version.
 * @description The killswitch list with every entry named, grouped by type.
 *              A name that cannot be resolved degrades to a readable id rather than dropping
 *              the entry: knowing *something* is disabled is the point of the command.
 */
async function getNamedKillswitch(version) {
    const entries = await getKillswitch(version);
    if (!Array.isArray(entries)) return [];

    const types = [...new Set(entries.map((entry) => entry.type))];
    const tables = {};
    await Promise.all(types.map(async (type) => {
        try {
            tables[type] = await getNameTable(type, version);
        } catch (err) {
            console.log(`Could not resolve the names for killswitched '${type}' entries: ${err.message}`);
            tables[type] = {};
        }
    }));

    return entries.map((entry) => ({
        id: entry.item,
        type: entry.type,
        name: (tables[entry.type] || {})[entry.item] || prettifyId(entry.item)
    }));
}

/**
 * @param {Array} events - Raw /api/events payload.
 * @param {Number} now - Unix seconds.
 * @description The event running right now, plus the next one to start. The payload is the
 *              full history back to 2015, so both have to be searched for rather than assumed
 *              to be at the end.
 */
function splitEvents(events, now) {
    if (!Array.isArray(events)) return { active: [], upcoming: null };

    const active = events.filter((event) => event.start <= now && event.end > now);
    const upcoming = events
        .filter((event) => event.start > now)
        .sort((a, b) => a.start - b.start)[0] || null;

    return { active: active, upcoming: upcoming };
}

/**
 * @param {Number} seconds - Unix timestamp in seconds.
 * @description Discord renders <t:...:F> in each reader's own timezone, which beats picking
 *              one for a bot that spans 1.8k guilds.
 */
function timestamp(seconds, style) {
    return `<t:${Math.floor(seconds)}:${style || "F"}>`;
}

async function sendKillswitch(context, interaction) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
    const language = serverConfig.language;

    let entries;
    try {
        entries = await getNamedKillswitch(context.config.version);
    } catch (err) {
        console.log(`Error requesting the killswitch: ${err.message}`);
        await interaction.editReply(texts.errors.apiUnavailable[language]);
        return;
    }

    const embed = new context.discord.EmbedBuilder()
        .setColor('#FF0000')
        .setTitle(texts.killswitch.title[language])
        .setThumbnail(context.client.user.avatarURL())
        .setFooter({ text: texts.killswitch.footer[language] });

    if (!entries.length) {
        embed.setDescription(texts.killswitch.empty[language]);
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    const byType = {};
    for (const entry of entries) {
        const type = texts.killswitch.types[entry.type] ? entry.type : "other";
        (byType[type] = byType[type] || []).push(entry.name);
    }

    for (const [type, names] of Object.entries(byType)) {
        embed.addFields({
            name: `${texts.killswitch.types[type][language]} (${names.length})`,
            // The embed field cap is 1024 characters and the killswitch has been long before.
            value: utils.truncate(names.map((name) => `• ${name}`).join("\n"), 1024)
        });
    }

    await interaction.editReply({ embeds: [embed] });
}

async function sendEvents(context, interaction) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
    const language = serverConfig.language;

    let events;
    let rankReset;
    try {
        // Independent: a rank reset that fails should not cost us the events, and vice versa.
        const [eventsResult, rankResetResult] = await Promise.allSettled([
            getEvents(context.config.version),
            getRankReset(context.config.version)
        ]);
        if (eventsResult.status !== "fulfilled") throw eventsResult.reason;
        events = eventsResult.value;
        rankReset = rankResetResult.status === "fulfilled" ? rankResetResult.value.rankreset : null;
    } catch (err) {
        console.log(`Error requesting the events: ${err.message}`);
        await interaction.editReply(texts.errors.apiUnavailable[language]);
        return;
    }

    const { active, upcoming } = splitEvents(events, Math.floor(Date.now() / 1000));

    const embed = new context.discord.EmbedBuilder()
        .setColor('#FF0000')
        .setTitle(texts.events.title[language])
        .setThumbnail(context.client.user.avatarURL());

    if (active.length) {
        for (const event of active) {
            embed.addFields({
                name: `${texts.events.active[language]}: ${event.name || prettifyId(event.event)}`,
                value: [
                    `${texts.events.ends[language]}: ${timestamp(event.end)}`,
                    event.bonus ? `${texts.events.bonus[language]}: **+${event.bonus * 100}%**` : null
                ].filter(Boolean).join("\n")
            });
        }
    } else {
        embed.addFields({ name: texts.events.active[language], value: texts.events.none[language] });
    }

    embed.addFields({
        name: texts.events.upcoming[language],
        value: upcoming
            ? `**${upcoming.name || prettifyId(upcoming.event)}**\n${texts.events.starts[language]}: ${timestamp(upcoming.start)}`
            : texts.events.noneUpcoming[language]
    });

    if (rankReset) {
        embed.addFields({
            name: texts.events.rankReset[language],
            value: `${timestamp(rankReset)} (${timestamp(rankReset, "R")})`
        });
    }

    await interaction.editReply({ embeds: [embed] });
}

async function sendPatchNotes(context, interaction) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
    const language = serverConfig.language;

    let notes;
    try {
        notes = await getPatchNotes(context.config.version);
    } catch (err) {
        console.log(`Error requesting the patch notes: ${err.message}`);
        await interaction.editReply(texts.patchNotes.notFound[language]);
        return;
    }

    // The payload is ordered newest first, but sorting by version keeps that true if it changes.
    const latest = [...notes].sort((a, b) => compareVersions(b.id, a.id))[0];
    if (!latest) {
        await interaction.editReply(texts.patchNotes.notFound[language]);
        return;
    }

    const embed = new context.discord.EmbedBuilder()
        .setColor('#FF0000')
        .setTitle(`${texts.patchNotes.title[language]} ${latest.id}`)
        .setURL(`https://${apis.dbdStats.host}/patchnotes`)
        .setThumbnail(context.client.user.avatarURL())
        // Embed descriptions cap at 4096; the notes routinely run past 100k characters.
        .setDescription(utils.truncate(htmlToMarkdown(latest.notes), 4000))
        .setFooter({ text: `${texts.patchNotes.readMore[language]}: dbd.tricky.lol/patchnotes` });

    await interaction.editReply({ embeds: [embed] });
}

/**
 * @param {String} a - Version like "10.0.0".
 * @param {String} b - Version like "9.6.2".
 * @description Numeric comparison, because "10.0.0" sorts before "9.6.2" as a string.
 */
function compareVersions(a, b) {
    const left = String(a).split(".").map(Number);
    const right = String(b).split(".").map(Number);
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
        const diff = (left[i] || 0) - (right[i] || 0);
        if (diff) return diff;
    }
    return 0;
}

/**
 * @param {String} html - Patch notes markup from the API.
 * @description Fold the handful of tags the notes actually use into Discord markdown.
 *              Anything else is stripped rather than escaped: this is a readable preview,
 *              and the embed links to the full notes.
 */
function htmlToMarkdown(html) {
    return String(html || "")
        // The notes are pretty-printed, so every tag sits on its own line. Dropping that
        // whitespace first is what keeps lists single-spaced instead of double-spaced,
        // which matters when the result has to fit in 4000 characters.
        .replace(/>\s+</g, "><")
        .replace(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gis, (match, text) => `\n**${text.trim()}**\n`)
        .replace(/<li[^>]*>(.*?)<\/li>/gis, (match, text) => `• ${text.trim()}\n`)
        .replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gis, (match, tag, text) => `**${text.trim()}**`)
        .replace(/<(em|i)[^>]*>(.*?)<\/\1>/gis, (match, tag, text) => `*${text.trim()}*`)
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

/**
 * @param context - BotContext.
 * @param interaction - Discord command interaction.
 * @param {String} steamId - SteamID in 64 bits.
 * @param {String} role - "survivor", "killer" or null for both.
 * @description Adept counts per character. The API answers with a flat
 *              "<character>_count"/"<character>_time" pair per character, so the roster is what
 *              tells us which side each one belongs to.
 */
async function sendAdepts(context, interaction, steamId, role) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
    const language = serverConfig.language;

    let payload;
    try {
        payload = await getPlayerAdepts(context.config.version, steamId);
    } catch (err) {
        console.log(`Error requesting the adepts: ${err.message}`);
        await interaction.editReply(texts.adepts.notFound[language]);
        return;
    }

    const earned = [];
    for (const [key, value] of Object.entries(payload)) {
        if (!key.endsWith("_count") || !value) continue;
        earned.push({ id: key.slice(0, -"_count".length), count: value });
    }

    const embed = new context.discord.EmbedBuilder()
        .setColor('#FF0000')
        .setTitle(texts.adepts.title[language])
        .setThumbnail(context.client.user.avatarURL());

    if (!earned.length) {
        embed.setDescription(texts.adepts.none[language]);
        await interaction.editReply({ embeds: [embed] });
        return;
    }

    const resolved = resolveAdepts(adeptCandidates(context, language), earned.map((adept) => adept.id));
    const grouped = { survivors: [], killers: [] };

    // Ties are broken by name so the list is stable between calls — most characters sit at 1.
    const sorted = earned.sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
    for (const adept of sorted) {
        const match = resolved[adept.id];
        const name = match ? match.name : prettifyId(adept.id);
        const side = match ? match.side : "survivors";
        grouped[side].push(adept.count > 1 ? `${name} **×${adept.count}**` : name);
    }

    const total = earned.reduce((sum, adept) => sum + adept.count, 0);
    embed.setDescription(`${texts.adepts.summary[language]}: **${utils.comma(total)}** · ${earned.length} ${texts.adepts.characters[language]}`);

    for (const side of ["survivors", "killers"]) {
        if (role && role !== side.slice(0, -1)) continue;
        if (!grouped[side].length) continue;
        // Comma-separated rather than one per line: a completionist has 90+ characters here
        // and bullets would blow past the 1024-character field cap after a dozen of them.
        embed.addFields({
            name: `${texts.adepts[side][language]} (${grouped[side].length})`,
            value: utils.truncate(grouped[side].join(", "), 1024)
        });
    }

    await interaction.editReply({ embeds: [embed] });
}

/**
 * @param context - BotContext.
 * @param {Number} language - 0 = Spanish, 1 = English.
 * @description The roster flattened to { side, name, canonical }, ready to match against.
 */
function adeptCandidates(context, language) {
    const sides = [
        ["survivors", Object.values(context.services.characters.getSurvivors())],
        ["killers", Object.values(context.services.characters.getKillers())]
    ];

    const candidates = [];
    for (const [side, characters] of sides) {
        for (const character of characters) {
            candidates.push({
                side: side,
                name: language === 0 ? (character.nameEs || character.name) : (character.nameEn || character.name),
                canonical: utils.canonicalId(character.nameEn || character.name)
            });
        }
    }
    return candidates;
}

/**
 * @param {Array} candidates - Output of adeptCandidates.
 * @param {Array} ids - Adept keys, e.g. "meg", "ghostface", "tapp".
 * @description Adept key -> roster character, or null for a key the roster cannot explain.
 *
 * The adepts endpoint keys characters by a short name that appears nowhere else in the API, so
 * the roster has to be searched by substring — and substrings collide. Two rules settle it:
 * a character can only be claimed once, and the longest keys go first, because a longer key is
 * the more specific one. That is what sends "billy" to The Hillbilly and leaves "bill" for
 * William "Bill" Overbeck, instead of both landing on the killer.
 *
 * Licensed characters whose adept key is their real name ("myers", "freddy", "vecna") match
 * nothing, since the roster knows them by their title. Those fall back to a prettified key,
 * which is a name players recognise anyway — better than guessing wrong.
 */
function resolveAdepts(candidates, ids) {
    const claimed = new Set();
    const resolved = {};

    for (const id of [...ids].sort((a, b) => b.length - a.length)) {
        const free = candidates.filter((candidate) => !claimed.has(candidate.canonical));
        const shortest = (matches) => matches.sort((a, b) => a.canonical.length - b.canonical.length)[0] || null;

        const match = free.find((candidate) => candidate.canonical === id)
            || shortest(free.filter((candidate) => candidate.canonical.startsWith(id)))
            || shortest(free.filter((candidate) => candidate.canonical.includes(id)));

        resolved[id] = match || null;
        if (match) claimed.add(match.canonical);
    }

    return resolved;
}

module.exports = {
    resolveAdepts: resolveAdepts,
    adeptCandidates: adeptCandidates,
    getKillswitch: getKillswitch,
    sendKillswitch: sendKillswitch,
    sendEvents: sendEvents,
    sendPatchNotes: sendPatchNotes,
    sendAdepts: sendAdepts,
    htmlToMarkdown: htmlToMarkdown,
    compareVersions: compareVersions,
    getNamedKillswitch: getNamedKillswitch,
    getEvents: getEvents,
    getRankReset: getRankReset,
    getPatchNotes: getPatchNotes,
    getPlayerAdepts: getPlayerAdepts,
    splitEvents: splitEvents,
    prettifyId: prettifyId
}
