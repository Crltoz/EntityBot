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

// Where the full notes live. dbd.tricky.lol serves the API but puts its HTML pages behind
// Cloudflare, so the official forum is the link that actually opens for everyone.
const PATCH_NOTES_URL = "https://forums.bhvr.com/dead-by-daylight/categories/patch-notes";

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

    // Short on purpose: the notes run past 100k characters and nobody reads a wall of them in
    // a chat. This is the headline plus the first section, and the link carries the rest.
    const excerpt = utils.truncate(htmlToMarkdown(latest.notes), 900);
    const embed = new context.discord.EmbedBuilder()
        .setColor('#FF0000')
        .setTitle(`${texts.patchNotes.title[language]} ${latest.id}`)
        .setURL(PATCH_NOTES_URL)
        .setThumbnail(context.client.user.avatarURL())
        .setDescription(`${excerpt}\n\n**[${texts.patchNotes.readMore[language]} →](${PATCH_NOTES_URL})**`);

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
 * @description Fetch the adepts and hand the whole roster to the canvas, earned or not.
 *              The API answers with a flat "<character>_count"/"<character>_time" pair, so the
 *              roster is what turns that into something with portraits and sides.
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

    // Keys with a count of zero are kept, not filtered out: resolveAdepts pairs the leftovers
    // by position, and dropping the adepts a player is missing would shift every key after
    // them onto the wrong character.
    const counts = {};
    const ids = [];
    for (const key of Object.keys(payload)) {
        if (!key.endsWith("_count")) continue;
        const id = key.slice(0, -"_count".length);
        ids.push(id);
        counts[id] = payload[key] || 0;
    }

    const roster = adeptCandidates(context, language);
    const resolved = resolveAdepts(roster, ids);

    // Fold the counts onto the roster, so a character nobody has an adept for is still drawn.
    const byCanonical = {};
    for (const [id, match] of Object.entries(resolved)) {
        if (match) byCanonical[match.canonical] = counts[id];
    }
    for (const character of roster) character.count = byCanonical[character.canonical] || 0;

    await context.services.stats.sendAdeptsCanvas(context, interaction, roster, role, language);
}

/**
 * @param context - BotContext.
 * @param {Number} language - 0 = Spanish, 1 = English.
 * @description The roster flattened to { side, name, canonical, link }, ready to match against
 *              and to draw.
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
                canonical: utils.canonicalId(character.nameEn || character.name),
                link: character.link || null
            });
        }
    }
    return candidates;
}

/**
 * @param {Array} candidates - Output of adeptCandidates.
 * @param {Array} ids - Adept keys, e.g. "meg", "ghostface", "tapp".
 * @description Adept key -> roster character, or null for a key nothing can explain.
 *
 * The adepts endpoint keys characters by a short name that appears nowhere else in the API, so
 * two passes are needed.
 *
 * By name first. Substrings collide, so a character can only be claimed once and the longest
 * keys go first, being the more specific ones: that sends "billy" to The Hillbilly and leaves
 * "bill" for William "Bill" Overbeck instead of both landing on the killer. This settles about
 * 89 of the 95 keys.
 *
 * By position for the rest. Licensed characters are keyed by their real name ("myers",
 * "freddy", "springtrap") while the roster knows them by their title, so no substring will ever
 * connect them. Both lists are in release order and both sides line up one-to-one, so pairing
 * the leftovers in order resolves them without hardcoding a table that would rot every chapter.
 * The data backs the ordering: a player can hold "lich" and "vecna" at the same time, so those
 * are two characters and not one renamed, exactly as their positions say.
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

    // `ids` keeps the API's order and `candidates` the roster's, so the leftovers pair up — but
    // only within a side, or a leftover killer key would claim a leftover survivor. A key does
    // not say which side it belongs to, so it is taken from the nearest key that did resolve.
    const orphans = { survivors: [], killers: [] };
    for (let i = 0; i < ids.length; i++) {
        if (resolved[ids[i]]) continue;
        const side = nearestResolvedSide(ids, resolved, i);
        if (side) orphans[side].push(ids[i]);
    }

    for (const side of ["survivors", "killers"]) {
        const free = candidates.filter((candidate) => candidate.side === side && !claimed.has(candidate.canonical));
        for (const id of orphans[side]) {
            const match = free.shift();
            if (!match) {
                console.log(`Adept key '${id}' matched no character, its count is not shown.`);
                continue;
            }
            resolved[id] = match;
            claimed.add(match.canonical);
        }
    }

    return resolved;
}

/**
 * @param {Array} ids - Adept keys in API order.
 * @param {Object} resolved - Matches so far.
 * @param {Number} index - Position of the key with no match.
 * @description Side of the closest key that did resolve. The keys are grouped by side, so a
 *              neighbour is a reliable answer for the ones stranded in between.
 */
function nearestResolvedSide(ids, resolved, index) {
    for (let distance = 1; distance < ids.length; distance++) {
        const before = resolved[ids[index - distance]];
        const after = resolved[ids[index + distance]];
        if (before) return before.side;
        if (after) return after.side;
    }
    return null;
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
