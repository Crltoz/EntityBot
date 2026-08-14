const fs = require("fs");
const Canvas = require("canvas");
const texts = require("../data/texts.json");
const apis = require("../data/apis.json");
const utils = require("../utils/utils.js");
const http = require("./http.js");
const render = require("./render.js");
const statsTemplate = require("../templates/stats.js");
const theme = require("../templates/theme.js");

const dbdStatsUrl = (path) => `https://${apis.dbdStats.host}${path}`;
const steamUrl = (path) => `https://${apis.steam.host}${path}`;

// Backgrounds for the commands still drawn on canvas. The stats icons and their two backdrops
// went with sendEmbedStats: that card is HTML now and embeds what it needs itself.
let backgroundKiller;
let backgroundSurvivor;
let backgroundLevel;
let backgroundShrine;

// SemiBold is registered as its own family rather than as weight 600 of "Inter": node-canvas
// matches numeric weights through fontconfig and quietly falls back to Sans when it misses.
Canvas.registerFont("./assets/Font/BRUTTALL.ttf", { family: "dbd" });
Canvas.registerFont("./assets/Font/Inter-Regular.ttf", { family: "Inter" });
Canvas.registerFont("./assets/Font/Inter-SemiBold.ttf", { family: "Inter SemiBold" });

const FONT_DISPLAY = '"dbd"';
const FONT_BODY = '"Inter"';
const FONT_BODY_STRONG = '"Inter SemiBold"';

const prefixAssetCharacters = "./assets/Visuals/Characters/";
const prefixAssetPerks = "./assets/Visuals/Perks/";

async function init() {
    backgroundKiller = await Canvas.loadImage("./assets/Visuals/Background/random_killer.jpg");
    backgroundSurvivor = await Canvas.loadImage("./assets/Visuals/Background/random_survivor.jpg");
    backgroundShrine = await Canvas.loadImage("./assets/Visuals/Background/shrine.jpg");
    backgroundLevel = await Canvas.loadImage("./assets/Visuals/Background/level.jpg");
    console.log(`Stats images loaded.`)
}

// Adept grid geometry. Each character is a card like the ones on /stats, with the portrait
// inset at the roughly 1:1.385 ratio the source art uses and the name underneath.
const ADEPT_GRID = {
    columns: 12,
    cellWidth: 104,
    cellHeight: 172,
    portraitWidth: 88,
    portraitHeight: 122,
    portraitInset: 8,
    radius: 10,
    gapX: 8,
    gapY: 12,
    margin: 36,
    headerHeight: 116,
    sectionHeight: 56
};

/**
 * @param ctx - Canvas 2D context.
 * @param {Number} x - Left edge.
 * @param {Number} y - Top edge.
 * @param {Number} width - Box width.
 * @param {Number} height - Box height.
 * @param {Number} radius - Corner radius.
 * @description Trace a rounded rectangle. node-canvas has roundRect, but not on every build
 *              this project has run against, so the path is drawn by hand.
 */
function roundedRectPath(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
}

/**
 * @param context - BotContext.
 * @param interaction - Discord command interaction.
 * @param {Array} roster - Every character as { side, name, link, count }.
 * @param {String} role - "survivor", "killer" or null for both.
 * @param {Number} language - 0 = Spanish, 1 = English.
 * @description Draw the whole roster as a grid of portraits: earned in colour, missing greyed
 *              out. A completionist has 90+ adepts, and a list that long is unreadable in an
 *              embed — as a grid it reads at a glance, and it also shows what is *missing*,
 *              which a list of what you already have never could.
 */
async function sendAdeptsCanvas(context, interaction, roster, role, language) {
    const sides = ["survivors", "killers"].filter((side) => !role || role === side.slice(0, -1));
    const groups = sides
        .map((side) => ({ side: side, characters: roster.filter((character) => character.side === side) }))
        .filter((group) => group.characters.length);

    if (!groups.length) {
        await interaction.editReply(texts.adepts.none[language]);
        return;
    }

    const grid = ADEPT_GRID;
    const rowsFor = (count) => Math.ceil(count / grid.columns);
    const width = grid.margin * 2 + grid.columns * grid.cellWidth + (grid.columns - 1) * grid.gapX;
    const height = grid.headerHeight + grid.margin
        + groups.reduce((total, group) => total
            + grid.sectionHeight
            + rowsFor(group.characters.length) * (grid.cellHeight + grid.gapY), 0);

    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const colors = theme.COLORS;

    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);

    // Header, laid out like the /stats one: display face on the left, a pill on the right.
    const earned = roster.filter((character) => character.count > 0).length;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = colors.value;
    ctx.font = `48px ${FONT_DISPLAY}`;
    // texts.adepts.title carries an emoji the canvas has no glyph for.
    ctx.fillText(texts.adepts.title[language].replace(/^\S+\s/, ""), grid.margin, 64);

    drawPill(ctx, `${earned} / ${roster.length}`, width - grid.margin, 40);

    let y = grid.headerHeight;
    for (const group of groups) {
        const done = group.characters.filter((character) => character.count > 0).length;
        ctx.textAlign = 'left';
        ctx.font = `26px ${FONT_BODY_STRONG}`;
        ctx.fillStyle = colors.value;
        const heading = texts.adepts[group.side][language];
        ctx.fillText(heading, grid.margin, y + 30);
        // Measured while the heading's own font is still set: switching first sized the gap
        // with the smaller face and the count landed on top of the title.
        const headingWidth = ctx.measureText(heading).width;
        ctx.font = `22px ${FONT_BODY}`;
        ctx.fillStyle = colors.accent;
        ctx.fillText(`${done} / ${group.characters.length}`, grid.margin + headingWidth + 16, y + 30);
        y += grid.sectionHeight;

        for (let index = 0; index < group.characters.length; index++) {
            const column = index % grid.columns;
            const row = Math.floor(index / grid.columns);
            const x = grid.margin + column * (grid.cellWidth + grid.gapX);
            await drawAdeptCell(ctx, group.characters[index], x, y + row * (grid.cellHeight + grid.gapY));
        }

        y += rowsFor(group.characters.length) * (grid.cellHeight + grid.gapY);
    }

    const attachment = new context.discord.AttachmentBuilder(canvas.toBuffer(), { name: 'adepts.png' });
    await interaction.editReply({ files: [attachment] });
}

/**
 * @param ctx - Canvas context of the grid.
 * @param character - Roster entry with name, link and count.
 * @param {Number} x - Cell left edge.
 * @param {Number} y - Cell top edge.
 * @description One portrait plus its name, dimmed to greyscale when the adept is missing and
 *              badged with a multiplier when it was earned more than once.
 */
async function drawAdeptCell(ctx, character, x, y) {
    const { cellWidth, cellHeight, portraitWidth, portraitHeight, portraitInset, radius } = ADEPT_GRID;
    const colors = theme.COLORS;
    const earned = character.count > 0;

    // The card, same gradient and radius as a /stats card.
    roundedRectPath(ctx, x, y, cellWidth, cellHeight, radius);
    ctx.fillStyle = theme.canvasGradient(ctx, theme.CARD_STOPS, x, y, cellWidth, cellHeight);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = earned ? colors.accent : colors.border;
    ctx.stroke();

    const portrait = await loadImageOrPlaceholder(assetPath(prefixAssetCharacters, character.link), portraitWidth, portraitHeight);
    const px = x + portraitInset;
    const py = y + portraitInset;

    ctx.save();
    roundedRectPath(ctx, px, py, portraitWidth, portraitHeight, 6);
    ctx.clip();
    ctx.drawImage(earned ? portrait : desaturate(portrait, portraitWidth, portraitHeight), px, py, portraitWidth, portraitHeight);
    ctx.restore();

    if (character.count > 1) {
        const badge = `x${character.count}`;
        ctx.font = `16px ${FONT_BODY_STRONG}`;
        const badgeWidth = ctx.measureText(badge).width + 14;
        roundedRectPath(ctx, px + portraitWidth - badgeWidth, py + 4, badgeWidth, 22, 6);
        ctx.fillStyle = colors.background;
        ctx.fill();
        ctx.fillStyle = colors.accent;
        ctx.textAlign = 'center';
        ctx.fillText(badge, px + portraitWidth - badgeWidth / 2, py + 20);
    }

    ctx.font = `15px ${FONT_BODY}`;
    ctx.textAlign = 'center';
    ctx.fillStyle = earned ? colors.value : colors.disabled;
    ctx.fillText(fitText(ctx, character.name, cellWidth - 10), x + cellWidth / 2, y + cellHeight - 14);
}

/**
 * @param ctx - Canvas 2D context.
 * @param {String} label - Pill text.
 * @param {Number} right - Right edge to align to.
 * @param {Number} centerY - Vertical centre of the pill.
 * @description The accented pill from the /stats header, which is where the totals live.
 */
function drawPill(ctx, label, right, centerY) {
    const colors = theme.COLORS;
    ctx.font = `26px ${FONT_BODY_STRONG}`;
    const width = ctx.measureText(label).width + 52;
    const height = 48;
    const x = right - width;
    const y = centerY - height / 2;

    roundedRectPath(ctx, x, y, width, height, height / 2);
    ctx.fillStyle = theme.canvasGradient(ctx, theme.CARD_STRONG_STOPS, x, y, width, height);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = colors.accent;
    ctx.stroke();

    ctx.fillStyle = colors.accent;
    ctx.textAlign = 'center';
    ctx.fillText(label, x + width / 2, centerY + 9);
}

/**
 * @param image - Loaded portrait.
 * @param {Number} width - Target width.
 * @param {Number} height - Target height.
 * @description Greyed-out copy of a portrait. node-canvas does not apply CSS filters, so the
 *              pixels are converted by hand — at this cell size it is a few thousand of them.
 */
function desaturate(image, width, height) {
    const offscreen = Canvas.createCanvas(width, height);
    const offctx = offscreen.getContext('2d');
    offctx.drawImage(image, 0, 0, width, height);

    const pixels = offctx.getImageData(0, 0, width, height);
    const data = pixels.data;
    for (let i = 0; i < data.length; i += 4) {
        // Rec. 601 luma, then pulled down so a missing character reads as locked rather than
        // as a portrait that merely lost its colour.
        const luma = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) * 0.42;
        data[i] = data[i + 1] = data[i + 2] = luma;
    }
    offctx.putImageData(pixels, 0, 0);
    return offscreen;
}

// Killers are titles in both languages ("The Nurse", "La Enfermera"), and the article carries
// none of the meaning — dropping it is what keeps the label from reading just "La".
const NAME_ARTICLES = /^(the|el|la|lo|los|las)\s+/i;

/**
 * @param ctx - Canvas context, already set to the target font.
 * @param {String} text - Name to fit.
 * @param {Number} maxWidth - Cell width.
 * @description Shorten a name until it fits its cell: drop the article, then keep the first
 *              word, then clip. Full names run long ("Aestri Yazar - Baermar Uraz") and the
 *              cells are 104px wide, so most names lose something.
 */
function fitText(ctx, text, maxWidth) {
    const limit = maxWidth - 6;
    const fits = (value) => ctx.measureText(value).width <= limit;

    if (fits(text)) return text;

    const withoutArticle = String(text).replace(NAME_ARTICLES, "");
    if (fits(withoutArticle)) return withoutArticle;

    const first = withoutArticle.split(/[\s-]+/)[0];
    if (fits(first)) return first;

    let clipped = first;
    while (clipped.length > 1 && !fits(`${clipped}.`)) clipped = clipped.slice(0, -1);
    return `${clipped}.`;
}

/**
 * @param {Number} width - Placeholder width in pixels.
 * @param {Number} height - Placeholder height in pixels.
 * @description Draw a generic "unknown asset" icon, so new content never breaks a command.
 */
function buildPlaceholder(width, height) {
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const margin = Math.min(width, height) * 0.05;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.beginPath();
    ctx.moveTo(centerX, margin);
    ctx.lineTo(width - margin, centerY);
    ctx.lineTo(centerX, height - margin);
    ctx.lineTo(margin, centerY);
    ctx.closePath();
    ctx.fillStyle = '#161616';
    ctx.fill();
    ctx.lineWidth = Math.max(2, Math.min(width, height) * 0.025);
    ctx.strokeStyle = '#8A6412';
    ctx.stroke();

    ctx.font = `${Math.floor(Math.min(width, height) * 0.45)}px "dbd"`;
    ctx.fillStyle = '#C9A227';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', centerX, centerY);

    return canvas;
}

/**
 * @param {String} path - Local path or remote URL of the image.
 * @param {Number} width - Placeholder width used if the image cannot be loaded.
 * @param {Number} height - Placeholder height used if the image cannot be loaded.
 * @description Load an image, falling back to a placeholder instead of throwing.
 */
async function loadImageOrPlaceholder(path, width, height) {
    if (!path) return buildPlaceholder(width, height);
    try {
        // Local files are read here rather than handed to Canvas as a path: node-canvas cannot
        // open a path with non-ASCII characters on Windows, which silently cost us the
        // portraits for The Onryō and The Dark Lord in every command that draws a character.
        const source = /^https?:\/\//i.test(path) ? path : fs.readFileSync(path);
        return await Canvas.loadImage(source);
    } catch (err) {
        console.log(`Could not load asset '${path}', drawing placeholder instead: ${err.message}`);
        return buildPlaceholder(width, height);
    }
}

/**
 * @param {String} prefix - Asset folder.
 * @param {String} link - Relative asset path, or null when the roster has no icon for it yet.
 * @description Resolve an asset path without turning a missing link into a bogus ".../null".
 */
function assetPath(prefix, link) {
    return link ? prefix + link : null;
}

async function sendShrine(context, interaction) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);

    let shrineResult;
    try {
        shrineResult = await http.getJson(dbdStatsUrl(apis.dbdStats.shrine), {
            headers: { 'User-Agent': http.userAgent(context.config.version) }
        });
    } catch (err) {
        console.log(`Error requesting the shrine: ${err.message}`);
        interaction.editReply(texts.errors.shrineNotFound[serverConfig.language]);
        return;
    }

    try {
        if (!shrineResult.perks || shrineResult.perks.length != 4) {
            console.log(`Invalid shrine payload: ${JSON.stringify(shrineResult)}`);
            interaction.editReply(texts.errors.shrineNotFound[serverConfig.language]);
            return;
        }

        // The roster is the source of truth. It is refreshed from the same API, but a
        // perk added between refreshes still resolves via the names the shrine itself
        // returns, and any perk without an icon yet renders with the placeholder.
        const perks = shrineResult.perks.map((perk) => {
            const known = context.services.perks.getPerkById(perk.id);
            return {
                nameEs: known ? known.nameEs : perk.name,
                nameEn: known ? known.nameEn : perk.name,
                link: known ? assetPath(prefixAssetPerks, known.link) : null,
                shards: perk.shards
            };
        });

        const canvas = Canvas.createCanvas(1163, 664);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(backgroundShrine, 0, 0, canvas.width, canvas.height);

        const perkImages = [];
        for (let perk of perks) {
            perkImages.push(await loadImageOrPlaceholder(perk.link, 256, 256));
        }
        ctx.drawImage(perkImages[0], 454, 3.5, 256, 256);
        ctx.drawImage(perkImages[1], 280, 177, 256, 256);
        ctx.drawImage(perkImages[2], 626, 177, 256, 256);
        ctx.drawImage(perkImages[3], 454, 355, 256, 256);
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        const attachment = new context.discord.AttachmentBuilder(canvas.toBuffer(), { name: 'shrine-image.png' });

        const header = serverConfig.language === 0 ? "🈴 **Santuario:**" : "🈴 **Shrine:**";
        const numbers = ["1⃣", "2⃣", "3⃣", "4⃣"];
        const lines = perks.map((perk, index) => {
            const name = serverConfig.language === 0 ? perk.nameEs : perk.nameEn;
            return `${numbers[index]} ${name} - <:frag_iri:739690491829813369> ${perk.shards}`;
        });

        await interaction.editReply({ content: `${header}\n${lines.join("\n")}`, files: [attachment] });
    } catch (err) {
        console.log(`Error building shrine: ${err}`);
        interaction.editReply(texts.errors.unknownError[serverConfig.language] + process.env.SUPPORT_DISCORD);
    }
}

/**
 * @param context - BotContext.
 * @param interaction - Discord command interaction.
 * @param {String} steamLink - Any Steam reference, see parseSteamInput.
 * @param {String} role - "survivor", "killer", or null for the combined card.
 */
async function getStats(context, interaction, steamLink, role) {
    steamLink = steamLink.toLowerCase();

    const steamId = await getSteamId(context, interaction, steamLink);
    // getSteamId already told the user what went wrong.
    if (!steamId) return;
    await getStatsForSteamId(context, interaction, steamId, role);
}

/**
 * @param context - BotContext.
 * @param interaction - Discord command interaction.
 * @param {String} steamId - SteamID in 64 bits, already resolved.
 * @param {String} role - "survivor", "killer", or null for the combined card.
 * @description Entry point for callers that already hold a SteamID, i.e. the stored profile.
 */
async function getStatsForSteamId(context, interaction, steamId, role) {
    await getSteamProfile(context, interaction, steamId, role);
}

/**
 * @param context - BotContext.
 * @param interaction - Discord command interaction.
 * @param {String} steamLink - Friend code, profile URL or vanity URL, lowercased.
 * @description Resolve any of the three shapes to a 64-bit SteamID, or null if it cannot be
 *              resolved — in which case the interaction has already been answered.
 */
// A 64-bit SteamID for an individual account: 17 digits starting with the 7656119 prefix.
const STEAM_ID64 = /^7656119\d{10}$/;
// The 32-bit account id, i.e. the "friend code" the profile shows.
const ACCOUNT_ID = /^\d{1,10}$/;
// A custom URL. Steam allows letters, digits, underscores and hyphens, 2 to 32 characters.
const VANITY = /^[a-z0-9_-]{2,32}$/i;

const PROFILE_URL = /steamcommunity\.com\/profiles\/(\d+)/i;
const VANITY_URL = /steamcommunity\.com\/id\/([^/?#\s]+)/i;

/**
 * @param {String} input - Whatever the user typed.
 * @description Work out what kind of Steam reference this is.
 *
 * Accepts the two profile URL shapes with or without scheme, "www.", a trailing slash or a
 * query string, and also a bare SteamID64, a bare friend code or a bare custom URL name —
 * pasting any of those is far more natural than hunting for the full link.
 *
 * Returns { kind, value }, where kind is "id64" (ready to use), "accountId" (needs the 64-bit
 * conversion) or "vanity" (needs a round-trip to Steam), or null if it is none of them.
 */
function parseSteamInput(input) {
    const trimmed = String(input || "").trim();

    const profileMatch = trimmed.match(PROFILE_URL);
    if (profileMatch) return { kind: "id64", value: profileMatch[1] };

    const vanityMatch = trimmed.match(VANITY_URL);
    if (vanityMatch) return { kind: "vanity", value: vanityMatch[1] };

    // Anything else that still looks like a URL is not a profile we can read.
    if (trimmed.includes("/") || trimmed.includes(".")) return null;

    // Order matters: a SteamID64 is all digits too, and treating one as a friend code used to
    // add the 64-bit offset a second time and look up a profile that cannot exist.
    if (STEAM_ID64.test(trimmed)) return { kind: "id64", value: trimmed };
    if (ACCOUNT_ID.test(trimmed)) return { kind: "accountId", value: trimmed };
    if (VANITY.test(trimmed)) return { kind: "vanity", value: trimmed };

    return null;
}

async function getSteamId(context, interaction, steamLink) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
    const parsed = parseSteamInput(steamLink);

    if (!parsed) {
        await interaction.editReply({ content: texts.errors.invalidFriendCode[serverConfig.language] });
        return null;
    }

    if (parsed.kind === "id64") return parsed.value;
    if (parsed.kind === "accountId") return steamID_64(parsed.value);

    const url = steamUrl(apis.steam.vanityURL.path + process.env.STEAM_APIKEY + apis.steam.vanityURL.vanity + encodeURIComponent(parsed.value));

    try {
        const body = await http.getJson(url, {
            headers: { 'User-Agent': http.userAgent(context.config.version) }
        });
        if (utils.isEmptyObject(body) || !body.response || body.response.success != 1) {
            await interaction.editReply(texts.errors.profileNotFound[serverConfig.language]);
            return null;
        }
        return body.response.steamid;
    } catch (err) {
        console.log(`Error resolving the vanity URL with the Steam API: ${err.message}`);
        await interaction.editReply(texts.errors.profileNotFound[serverConfig.language]);
        return null;
    }
}

/**
 * @param context - BotContext.
 * @param interaction - Discord command interaction.
 * @param {BigInt64Array} steamId - SteamID in 64bits.
 * @param {String} role - "survivor", "killer", or null for the combined card.
 * @description First part for get user stats from Australian Website.
 */
async function getSteamProfile(context, interaction, steamId, role) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
    const url = steamUrl(apis.steam.playerSummaries.path + process.env.STEAM_APIKEY + apis.steam.playerSummaries.steamid + steamId);

    let body;
    try {
        body = await http.getJson(url, {
            headers: { 'User-Agent': http.userAgent(context.config.version) }
        });
    } catch (err) {
        // A malformed SteamID makes Steam answer with an HTML "Bad Request" page, so an
        // unparseable body here is the user's input, not an outage.
        console.log(`Error getting the player summaries from the Steam API: ${err.message}`);
        await interaction.editReply({ content: texts.errors.profileNotFound[serverConfig.language] });
        return;
    }

    const player = body.response && body.response.players && body.response.players[0];
    if (!player || !player.profilestate) {
        await interaction.editReply({ content: texts.errors.profileNotFound[serverConfig.language] });
        return;
    }
    if (player.profilestate != 1) {
        await interaction.editReply({ content: texts.errors.privateProfile[serverConfig.language] });
        return;
    }

    await sendStats(context, interaction, player, role);
}

/**
 * @param context - BotContext
 * @param interaction - Discord command interaction.
 * @param steamProfile - Steam profile object.
 * @param {String} role - "survivor", "killer", or null for the combined card.
 * @description - Get stats from Australian Website, and send this to the channel.
 */
async function sendStats(context, interaction, steamProfile, role) {
    const url = dbdStatsUrl(apis.dbdStats.playerStats + steamProfile.steamid);

    let response;
    try {
        response = await http.request(url, {
            headers: { 'User-Agent': http.userAgent(context.config.version) }
        });
    } catch (err) {
        console.log(`Error getting the player stats from dbd.tricky.lol: ${err.message}`);
        await sendEmbedError(context, interaction, 3);
        return;
    }

    // Any non-2xx means the site has never seen this profile: ask it to index the account.
    if (!response.ok) return postStats(context, interaction, steamProfile.steamid);

    let body;
    try {
        body = JSON.parse(response.body);
    } catch (err) {
        console.log(`Error parsing the player stats from dbd.tricky.lol: ${err.message}`);
        await sendEmbedError(context, interaction, 3);
        return;
    }

    if (body.killer_rank == 20 && body.killed == 0 && body.sacrificed == 0 && body.bloodpoints == 0) await sendEmbedError(context, interaction, 1);
    else await sendEmbedStats(context, interaction, steamProfile, body, role);
}

/**
 * @param context - BotContext.
 * @param interaction - Discord command interaction.
 * @param {BigInt64Array} steamId - SteamID in 64bits.
 * @description - Post stats to Australian Website.
 */
async function postStats(context, interaction, steamId) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
    const url = dbdStatsUrl(apis.dbdStats.playerStats + steamId);

    let response;
    try {
        response = await http.request(url, {
            method: 'POST',
            headers: { 'User-Agent': http.userAgent(context.config.version) }
        });
    } catch (err) {
        console.log(`Error posting the account to dbd.tricky.lol: ${err.message}`);
        await sendEmbedError(context, interaction, 3);
        return;
    }

    if (response.status != 201) {
        console.log(`ERROR POST: ${response.status} | steamid: ${steamId}`);
        await sendEmbedError(context, interaction, 2);
        return;
    }

    console.log(`SUCCESS POST: ${response.status} | steamid: ${steamId}`);
    await interaction.editReply(texts.accountUpdating[serverConfig.language]);
}

/**
 * @param context - BotContext
 * @param interaction - Discord command interaction.
 * @param steamProfile - Steam profile object.
 * @param dbdProfile - Dead By Daylight stats object.
 * @param {String} role - "survivor", "killer", or null for the combined card.
 * @description - Render the stats card and send it.
 *
 * The card is HTML laid out by satori rather than the ~150 lines of hand-placed fillText this
 * replaced: adding a number is now a row in the template's field table instead of picking
 * pixel coordinates that do not collide with the background art.
 */
async function sendEmbedStats(context, interaction, steamProfile, dbdProfile, role) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
    const language = serverConfig.language;

    let png;
    try {
        const layout = statsTemplate.layoutFor(role);
        const markup = await layout.build(steamProfile, dbdProfile, language);
        png = await render.toPng(markup, layout.width, layout.height);
    } catch (err) {
        console.log(`Error rendering the stats card: ${err.message}`);
        await sendEmbedError(context, interaction, 3);
        return;
    }

    const attachment = new context.discord.AttachmentBuilder(png, { name: 'stats.png' });
    const flagOrSteam = steamProfile.loccountrycode
        ? `:flag_${steamProfile.loccountrycode.toLowerCase()}:`
        : "<:steam:914663956860248134>";

    await interaction.editReply({
        content: `${flagOrSteam} **${steamProfile.personaname}** | ${texts.stats.seeFullStatistics[language]} https://dbd.tricky.lol/playerstats/${steamProfile.steamid}`,
        files: [attachment]
    });
}


/**
 * @param context - BotContext.
 * @param interaction - Discord command interaction.
 * @param {Int8Array} type - 1 = Update in progress | 2 = Account Private. | 3 = Unknown error.
 * @description - Send embed error with information.
 */
async function sendEmbedError(context, interaction, type) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
    const text = texts.errors.types[type.toString()];
    const embedd = new context.discord.EmbedBuilder()
        .setColor('#FF0000')
        .setTitle(text.title[serverConfig.language]);

    for (let field of text.fields) {
        embedd.addFields({ name: field.name[serverConfig.language], value: field.value[serverConfig.language] });
    }

    if (text.image) {
        embedd.setImage(text.image);
    }
    embedd.setThumbnail(context.client.user.avatarURL());
    interaction.editReply({ embeds: [embedd] });
}

async function calculateLevel(context, interaction, currentLevel, wantedLevel, currentPrestige, wantedPrestige) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
    const operation = getBloodpointsToBuyLevels(currentLevel, wantedLevel, currentPrestige, wantedPrestige);
    const language = serverConfig.language;

    // The canvas has one slot per level, so the prestige rides along in the same slot when
    // there is one — "P3-12" instead of "12".
    const label = (prestige, level) => (prestige ? `P${prestige}-${level}` : String(level));
    const fromLabel = label(currentPrestige, currentLevel);
    const toLabel = label(wantedPrestige, wantedLevel);

    // image creation
    const canvas = Canvas.createCanvas(541, 447);
    const ctx = canvas.getContext('2d');
    let fontSize = 10
    ctx.drawImage(backgroundLevel, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Slightly smaller text placed above the member's display name
    ctx.font = '50px "dbd"';
    ctx.fillStyle = '#ffffff';
    let levelHeader = language == 0 ? "Nivel" : "Level"

    ctx.fillText(levelHeader, utils.calculateCenter(270, levelHeader.length, fontSize), 75);
    ctx.fillText(fromLabel, utils.calculateCenter(113, fromLabel.length, fontSize), 210);
    ctx.fillText(toLabel, utils.calculateCenter(419, toLabel.length, fontSize), 213);
    ctx.fillText(utils.comma(operation.price), utils.calculateCenter(290, operation.price.toString().length, fontSize), 355);

    const attachment = new context.discord.AttachmentBuilder(canvas.toBuffer(), { name: 'calculate-image.png' });
    // The number is an average, so it is labelled as one rather than presented as exact.
    interaction.editReply({ content: texts.levelEstimate[language], files: [attachment] });
}

/**
 * Average bloodpoints spent to complete one bloodweb, by level band.
 *
 * The exact figure is not knowable: a bloodweb's cost depends on how many nodes spawn, their
 * rarity mix, and how much the Entity eats before the level is done. Neither the game nor the
 * wiki publishes a per-level total, so these stay averages.
 *
 * What *is* documented is the node price list, and Patch 6.2.0 cut every node price without
 * touching the node counts:
 *   Common 3,000 -> 2,000 | Uncommon 4,000 -> 2,500 | Rare 5,000 -> 3,250
 *   Very Rare 6,000 -> 4,000 | Ultra Rare 7,000 -> 5,000 | Event 3,000 -> 2,000
 * That is a mean reduction to ~0.665 of the old price, applied here to the pre-6.2.0 averages
 * this command used to carry. The spread across rarities is narrow (0.625–0.714), so the mix
 * of a given bloodweb barely moves the result.
 */
const BLOODWEB_COST_BY_LEVEL = [
    { upTo: 9, cost: 8300 },
    { upTo: 19, cost: 13000 },
    { upTo: 29, cost: 15300 },
    { upTo: 39, cost: 18600 },
    { upTo: 50, cost: 22300 }
];

// Buying the central node at level 50 to prestige, unchanged since Patch 6.1.0.
const PRESTIGE_NODE_COST = 20000;
const MAX_LEVEL = 50;
const MAX_PRESTIGE = 100;

/**
 * @param {Number} level - Bloodweb level being completed.
 * @description Average cost of the bloodweb at that level.
 */
function bloodwebCost(level) {
    const band = BLOODWEB_COST_BY_LEVEL.find((entry) => level <= entry.upTo);
    return band ? band.cost : 0;
}

/**
 * @param {Number} fromLevel - First level to buy, inclusive.
 * @param {Number} toLevel - Level to stop at, exclusive.
 * @description Cost of every bloodweb between two levels of the same prestige.
 */
function costBetweenLevels(fromLevel, toLevel) {
    let total = 0;
    for (let level = fromLevel; level < toLevel; level++) total += bloodwebCost(level);
    return total;
}

/**
 * @param {Number} currentLevel - Level now (1-50).
 * @param {Number} wantedLevel - Level wanted (1-50).
 * @param {Number} currentPrestige - Prestige now (0-99).
 * @param {Number} wantedPrestige - Prestige wanted (0-100).
 * @description Whether the target is actually ahead of the starting point. Within one prestige
 *              the level has to move forward; across prestiges any level is reachable, because
 *              prestiging sends the character back to level 1.
 */
function isValidProgression(currentLevel, wantedLevel, currentPrestige, wantedPrestige) {
    if (currentPrestige < 0 || wantedPrestige > MAX_PRESTIGE) return false;
    if (wantedPrestige < currentPrestige) return false;
    if (wantedPrestige === currentPrestige) return wantedLevel > currentLevel;
    return true;
}

/**
 * @param {Number} currentLevel - Level now (1-50).
 * @param {Number} wantedLevel - Level wanted (1-50).
 * @param {Number} currentPrestige - Prestige now (0-99), 0 when the command was called without it.
 * @param {Number} wantedPrestige - Prestige wanted (0-100).
 * @description Estimated bloodpoints to go from one point of a character's progression to
 *              another, across prestiges. Reaching level 50 and prestiging resets to level 1,
 *              so a multi-prestige span is: finish the current one, then whole cycles, then
 *              the levels left over in the last one.
 */
function getBloodpointsToBuyLevels(currentLevel, wantedLevel, currentPrestige, wantedPrestige) {
    const fromPrestige = currentPrestige || 0;
    const toPrestige = wantedPrestige || 0;

    if (toPrestige === fromPrestige) {
        return {
            levelsToBuy: Math.max(0, wantedLevel - currentLevel),
            prestigesToBuy: 0,
            price: costBetweenLevels(currentLevel, wantedLevel)
        };
    }

    const fullCycle = costBetweenLevels(1, MAX_LEVEL) + PRESTIGE_NODE_COST;
    const cycles = toPrestige - fromPrestige - 1;

    const price = costBetweenLevels(currentLevel, MAX_LEVEL) + PRESTIGE_NODE_COST
        + cycles * fullCycle
        + costBetweenLevels(1, wantedLevel);

    const levelsToBuy = (MAX_LEVEL - currentLevel) + cycles * (MAX_LEVEL - 1) + (wantedLevel - 1);

    return {
        levelsToBuy: levelsToBuy,
        prestigesToBuy: toPrestige - fromPrestige,
        price: price
    };
}

async function generateRandomBuild(context, interaction, isSurv) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);

    let perk1, perk2, perk3, perk4, numberCharacter;
    const survivors = context.services.characters.getSurvivors();
    const killers = context.services.characters.getKillers();
    const language = serverConfig.language;

    if (isSurv) {
        numberCharacter = Math.floor(Math.random() * utils.getLength(survivors));
        const survivorPerks = context.services.perks.getSurvivorPerks();
        nPerks = getRandomNumber(utils.getLength(survivorPerks));
        perk1 = context.services.perks.getSurvivorPerkByIndex(nPerks.n1);
        perk2 = context.services.perks.getSurvivorPerkByIndex(nPerks.n2);
        perk3 = context.services.perks.getSurvivorPerkByIndex(nPerks.n3);
        perk4 = context.services.perks.getSurvivorPerkByIndex(nPerks.n4);
    } else {
        numberCharacter = Math.floor(Math.random() * utils.getLength(killers));
        const killerPerks = context.services.perks.getKillerPerks();
        nPerks = getRandomNumber(utils.getLength(killerPerks));
        perk1 = context.services.perks.getKillerPerkByIndex(nPerks.n1);
        perk2 = context.services.perks.getKillerPerkByIndex(nPerks.n2);
        perk3 = context.services.perks.getKillerPerkByIndex(nPerks.n3);
        perk4 = context.services.perks.getKillerPerkByIndex(nPerks.n4);
    }

    // send build
    const canvas = Canvas.createCanvas(1579, 1114);
    const ctx = canvas.getContext('2d');
    let fontSize = 21
    ctx.drawImage(isSurv ? backgroundSurvivor : backgroundKiller, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // avatar
    ctx.font = '101px "dbd"';
    ctx.fillStyle = '#ffffff';
    if (isSurv) ctx.fillText(survivors[numberCharacter].name, utils.calculateCenter(1267, survivors[numberCharacter].name.length, fontSize), 207);
    else {
        let string = language == 0 ? killers[numberCharacter].nameEs : killers[numberCharacter].nameEn
        ctx.fillText(string, utils.calculateCenter(1267, string.length, fontSize), 207);
    }
    const characterImageLink = isSurv ? survivors[numberCharacter].link : killers[numberCharacter].link
    const avatar = await loadImageOrPlaceholder(assetPath(prefixAssetCharacters, characterImageLink), 447, 619);
    ctx.drawImage(avatar, 1045, 227, 447, 619);

    // perks
    const perkImage_1 = await loadImageOrPlaceholder(assetPath(prefixAssetPerks, perk1.link), 256, 256);
    const perkImage_2 = await loadImageOrPlaceholder(assetPath(prefixAssetPerks, perk2.link), 256, 256);
    const perkImage_3 = await loadImageOrPlaceholder(assetPath(prefixAssetPerks, perk3.link), 256, 256);
    const perkImage_4 = await loadImageOrPlaceholder(assetPath(prefixAssetPerks, perk4.link), 256, 256);
    ctx.drawImage(perkImage_1, 302, 234, 256, 256);
    ctx.drawImage(perkImage_2, 116, 429, 256, 256);
    ctx.drawImage(perkImage_3, 493, 429, 256, 256);
    ctx.drawImage(perkImage_4, 303, 605, 256, 256);

    const attachment = new context.discord.AttachmentBuilder(canvas.toBuffer(), { name: 'random.png' });

    if (language == 0) {
        interaction.editReply({ content: `**PERKS:**\n1⃣: ${perk1.nameEs}\n2⃣: ${perk2.nameEs}\n3⃣: ${perk3.nameEs}\n4⃣: ${perk4.nameEs}`, files: [attachment] });
    } else {
        interaction.editReply({ content: `**PERKS:**\n1⃣: ${perk1.nameEn}\n2⃣: ${perk2.nameEn}\n3⃣: ${perk3.nameEn}\n4⃣: ${perk4.nameEn}`, files: [attachment] });
    }
}

/**
 * @param {Number} max - Exclusive upper bound, i.e. the number of perks to draw from.
 * @description Get 4 random indexes without repeating.
 *
 * A partial Fisher-Yates shuffle, which the previous nested `while` loops only approximated:
 * re-rolling `n3` until it stopped matching `n1` could land it back on `n2`, and the same for
 * `n4`, so a build could come out with the same perk twice.
 */
function getRandomNumber(max) {
    const pool = Array.from({ length: max }, (value, index) => index);
    const picked = [];

    while (picked.length < 4 && pool.length) {
        picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }

    // Fewer than 4 perks in the roster should never happen, but repeating one beats
    // handing the caller an undefined index.
    while (picked.length && picked.length < 4) picked.push(picked[0]);

    return {
        n1: picked[0],
        n2: picked[1],
        n3: picked[2],
        n4: picked[3]
    }
}


// Offset between the 32-bit account id and the 64-bit SteamID.
const STEAM_ID64_BASE = 76561197960265728n;

/**
 * @param {String} steamId32 - SteamID in 32bits, digits only.
 * @description - Return steamID 64 bits.
 */
function steamID_64(steamId32) {
    return (BigInt(steamId32) + STEAM_ID64_BASE).toString();
}

async function test(context, interaction, type, index) {
    switch (type) {
        case "survivor": {
            const canvas = Canvas.createCanvas(1579, 1114);
            const ctx = canvas.getContext('2d');
            const survivors = context.services.characters.getSurvivors();
            if (!survivors[index]) {
                interaction.editReply({ content: `Survivor not exists!` });
                return;
            }
            let fontSize = 21
            ctx.drawImage(backgroundSurvivor, 0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            // avatar
            ctx.font = '101px "dbd"';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(survivors[index].name, utils.calculateCenter(1267, survivors[index].name.length, fontSize), 207);
            const avatar = await Canvas.loadImage(prefixAssetCharacters + survivors[index].link);
            ctx.drawImage(avatar, 1045, 227, 447, 619);
            const attachment = new context.discord.AttachmentBuilder(canvas.toBuffer(), { name: 'random.png' });
            interaction.editReply({ content: `Testing survivor! ${survivors[index].name} || Current length: ${Object.keys(survivors).length}`, files: [attachment] });
            break;
        }
        case "killer": {
            const canvas = Canvas.createCanvas(1579, 1114);
            const ctx = canvas.getContext('2d');
            const killers = context.services.characters.getKillers();
            if (!killers[index]) {
                interaction.editReply({ content: `Killer not exists!` });
                return;
            }
            let fontSize = 21
            ctx.drawImage(backgroundKiller, 0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            // avatar
            ctx.font = '101px "dbd"';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(killers[index].nameEn, utils.calculateCenter(1267, killers[index].nameEn.length, fontSize), 207);
            const avatar = await Canvas.loadImage(prefixAssetCharacters + killers[index].link);
            ctx.drawImage(avatar, 1045, 227, 447, 619);
            const attachment = new context.discord.AttachmentBuilder(canvas.toBuffer(), { name: 'random.png' });
            interaction.editReply({ content: `Testing killer! Es: ${killers[index].nameEs} | Eng: ${killers[index].nameEn} || current length: ${Object.keys(killers).length}`, files: [attachment] });
            break;
        }
        case "kperk": {
            const canvas = Canvas.createCanvas(1579, 1114);
            const ctx = canvas.getContext('2d');
            const killerPerks = context.services.perks.getKillerPerks();
            if (!killerPerks[index]) {
                interaction.editReply({ content: `Killer perk not exists!` });
                return;
            }
            ctx.drawImage(backgroundKiller, 0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            const perkImage = await Canvas.loadImage(prefixAssetPerks + killerPerks[index].link);
            ctx.drawImage(perkImage, 302, 234, 256, 256);
            ctx.drawImage(perkImage, 116, 429, 256, 256);
            ctx.drawImage(perkImage, 493, 429, 256, 256);
            ctx.drawImage(perkImage, 303, 605, 256, 256);
            const attachment = new context.discord.AttachmentBuilder(canvas.toBuffer(), { name: 'random.png' });
            interaction.editReply({ content: `Testing killer perk! Es: ${killerPerks[index].nameEs} | Eng: ${killerPerks[index].nameEn} || current length: ${Object.keys(killerPerks).length}`, files: [attachment] });
            break;
        }
        case "sperk": {
            const canvas = Canvas.createCanvas(1579, 1114);
            const ctx = canvas.getContext('2d');
            const survivorPerks = context.services.perks.getSurvivorPerks();
            if (!survivorPerks[index]) {
                interaction.editReply({ content: `Survivor perk not exists!` });
                return;
            }
            ctx.drawImage(backgroundSurvivor, 0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            const perkImage = await Canvas.loadImage(prefixAssetPerks + survivorPerks[index].link);
            ctx.drawImage(perkImage, 302, 234, 256, 256);
            ctx.drawImage(perkImage, 116, 429, 256, 256);
            ctx.drawImage(perkImage, 493, 429, 256, 256);
            ctx.drawImage(perkImage, 303, 605, 256, 256);
            const attachment = new context.discord.AttachmentBuilder(canvas.toBuffer(), { name: 'random.png' });
            interaction.editReply({ content: `Testing survivor perk! Es: ${survivorPerks[index].nameEs} | Eng: ${survivorPerks[index].nameEn} || || current length: ${Object.keys(survivorPerks).length}`, files: [attachment] });
            break;
        }
        default: {
            interaction.editReply({ content: "type not exists." });
        }
    }
}

module.exports = {
    parseSteamInput: parseSteamInput,
    sendEmbedStats: sendEmbedStats,
    sendShrine: sendShrine,
    init: init,
    getStats: getStats,
    getStatsForSteamId: getStatsForSteamId,
    calculateLevel: calculateLevel,
    sendAdeptsCanvas: sendAdeptsCanvas,
    isValidProgression: isValidProgression,
    getBloodpointsToBuyLevels: getBloodpointsToBuyLevels,
    generateRandomBuild: generateRandomBuild,
    getSteamId: getSteamId,
    test: test
}