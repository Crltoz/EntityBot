const Canvas = require("canvas");
const texts = require("../data/texts.json");
const apis = require("../data/apis.json");
const utils = require("../utils/utils.js");
const http = require("./http.js");

const dbdStatsUrl = (path) => `https://${apis.dbdStats.host}${path}`;
const steamUrl = (path) => `https://${apis.steam.host}${path}`;

// Images
let backgroundStatsKiller;
let backgroundKiller;
let backgroundSurvivor;
let backgroundLevel;
let backgroundShrine;
let backgroundStatsSurvivor;
let killerImage;
let survivorImage;
let bpImage;
let killsImage;
let sacrificedImage;
let sacrificedObsessionsImage;
let perfectGamesImage;
let paletImage;
let genDamagedImage;

const font = "./assets/Font/BRUTTALL.ttf";
Canvas.registerFont(font, { family: "dbd" });

const prefixAssetCharacters = "./assets/Visuals/Characters/";
const prefixAssetPerks = "./assets/Visuals/Perks/";

async function init() {
    backgroundKiller = await Canvas.loadImage("./assets/Visuals/Background/random_killer.jpg");
    backgroundSurvivor = await Canvas.loadImage("./assets/Visuals/Background/random_survivor.jpg");
    backgroundShrine = await Canvas.loadImage("./assets/Visuals/Background/shrine.jpg");
    backgroundLevel = await Canvas.loadImage("./assets/Visuals/Background/level.jpg");
    backgroundStatsSurvivor = await Canvas.loadImage("./assets/Visuals/Background/stats_survivor.jpg");
    backgroundStatsKiller = await Canvas.loadImage("./assets/Visuals/Background/stats_killer.jpg");
    killerImage = await Canvas.loadImage("./assets/Visuals/icons/killer_rank.png");
    survivorImage = await Canvas.loadImage("./assets/Visuals/icons/survivor_rank.png");
    bpImage = await Canvas.loadImage("./assets/Visuals/icons/bp.png");
    killsImage = await Canvas.loadImage("./assets/Visuals/icons/killer.png");
    sacrificedImage = await Canvas.loadImage("./assets/Visuals/icons/hook.png");
    sacrificedObsessionsImage = await Canvas.loadImage("./assets/Visuals/icons/entity.png");
    perfectGamesImage = await Canvas.loadImage("./assets/Visuals/icons/killer_perfect.png");
    paletImage = await Canvas.loadImage("./assets/Visuals/icons/palet.png");
    genDamagedImage = await Canvas.loadImage("./assets/Visuals/icons/genbreak.png");
    carryImage = await Canvas.loadImage("./assets/Visuals/icons/carry.png");
    console.log(`Stats images loaded.`)
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
        return await Canvas.loadImage(path);
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

async function getStats(context, interaction, steamLink, isSurvivor) {
    steamLink = steamLink.toLowerCase();

    const steamId = await getSteamId(context, interaction, steamLink);
    // getSteamId already told the user what went wrong.
    if (!steamId) return;
    await getSteamProfile(context, interaction, steamId, isSurvivor);
}

/**
 * @param context - BotContext.
 * @param interaction - Discord command interaction.
 * @param {String} steamLink - Friend code, profile URL or vanity URL, lowercased.
 * @description Resolve any of the three shapes to a 64-bit SteamID, or null if it cannot be
 *              resolved — in which case the interaction has already been answered.
 */
async function getSteamId(context, interaction, steamLink) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);

    // Profile with friend code (32 bits)
    if (!steamLink.includes('steamcommunity.com/id/') && !steamLink.includes('steamcommunity.com/profiles/')) {
        // Digits only: anything else (a float, a sign, an exponent) would blow up BigInt.
        if (!/^\d{8,}$/.test(steamLink)) {
            await interaction.editReply({ content: texts.errors.invalidFriendCode[serverConfig.language] });
            return null;
        }
        return steamID_64(steamLink);
    }

    // Profile with steam id (64 bits)
    if (steamLink.includes('steamcommunity.com/profiles/')) {
        return steamLink.slice(steamLink.indexOf("profiles/") + 9).replace("/", "");
    }

    // Profile with vanity URL
    const vanity = steamLink.slice(steamLink.indexOf("/id/") + 4).replace("/", "");
    const url = steamUrl(apis.steam.vanityURL.path + process.env.STEAM_APIKEY + apis.steam.vanityURL.vanity + vanity);

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
 * @param {Boolean} isSurv - true = survivor | false = killer
 * @description First part for get user stats from Australian Website.
 */
async function getSteamProfile(context, interaction, steamId, isSurv) {
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

    await sendStats(context, interaction, player, isSurv);
}

/**
 * @param context - BotContext
 * @param interaction - Discord command interaction.
 * @param steamProfile - Steam profile object.
 * @param {Boolean} isSurv - true = survivor | false = killer
 * @description - Get stats from Australian Website, and send this to the channel.
 */
async function sendStats(context, interaction, steamProfile, isSurv) {
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
    else await sendEmbedStats(context, interaction, steamProfile, body, isSurv);
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
 * @param {Boolean} isSurv - true = survivor | false = killer
 * @description - Send embed stats with all info.
 */
async function sendEmbedStats(context, interaction, steamProfile, dbdProfile, isSurv) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
    const language = serverConfig.language;
    if (!isSurv) {
        const canvas = Canvas.createCanvas(1920, 1080);
        const ctx = canvas.getContext('2d');
        let fontSize = 10;
        ctx.drawImage(backgroundStatsKiller, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Statistics centered
        ctx.font = '80px "dbd"';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(texts.stats.statistics[language], utils.calculateCenter(910, texts.stats.statistics[language].length, fontSize), 75);

        // Killer logo
        ctx.drawImage(killerImage, 900, 150, 128, 128);

        // Hours
        ctx.font = '50px "dbd"';
        ctx.fillText(texts.stats.hoursPlayed[language] + utils.comma(parseInt(dbdProfile.playtime / 60)), 230, 180);

        // Bloodpoints
        ctx.drawImage(bpImage, 25, 230, 64, 64);
        ctx.font = '50px "dbd"';
        ctx.fillText(utils.comma(dbdProfile.bloodpoints), 100, 280);

        // Kills
        ctx.drawImage(killsImage, 25, 330, 64, 64);
        ctx.fillText(texts.stats.kills[language] + dbdProfile.killed, 100, 380);

        // Sacrificed
        ctx.drawImage(sacrificedImage, 25, 430, 64, 64);
        ctx.fillText(texts.stats.sacrificed[language] + dbdProfile.sacrificed, 100, 480);

        // Sacrificed obsessions
        ctx.drawImage(sacrificedObsessionsImage, 25, 530, 64, 64);
        ctx.fillText(texts.stats.sacrificedObessions[language] + dbdProfile.sacrificed_obsessions, 100, 580);

        // Perfect games
        ctx.drawImage(perfectGamesImage, 25, 630, 64, 64);
        ctx.fillText(texts.stats.perfectGames[language] + dbdProfile.killer_perfectgames, 100, 680);

        // Full load out
        ctx.drawImage(paletImage, 25, 730, 64, 64);
        ctx.fillText(texts.stats.killerFullLoadout[language] + dbdProfile.killer_fullloadout, 100, 780);

        // Gens damaged
        ctx.drawImage(genDamagedImage, 25, 830, 64, 64);
        ctx.fillText(texts.stats.gensDamaged[language] + dbdProfile.gensdamagedwhileonehooked, 100, 880);

        // Survivors grabbed
        ctx.drawImage(carryImage, 25, 930, 64, 64);
        ctx.fillText(texts.stats.survivorsGrabbed[language] + dbdProfile.survivorsgrabbedrepairinggen, 100, 980);

        // profile name
        ctx.fillStyle = '#E52121';
        ctx.font = '70px "dbd"';
        ctx.fillText(steamProfile.personaname, 230, 110);

        // Draw circle
        ctx.beginPath();
        ctx.arc(125, 125, 80, 0, Math.PI * 2, true);
        ctx.strokeStyle = '#F32C2C';
        ctx.lineWidth = 8;
        ctx.closePath();
        ctx.clip();

        const avatar = await loadImageOrPlaceholder(steamProfile.avatarfull, 200, 200);
        ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new context.discord.AttachmentBuilder(canvas.toBuffer(), { name: 'stats-image.jpg' });
        let flagOrSteam = steamProfile.loccountrycode ? `:flag_${steamProfile.loccountrycode.toLowerCase()}:` : "<:steam:914663956860248134>";
        interaction.editReply({ content: `${flagOrSteam} **${steamProfile.personaname}** | ${texts.stats.seeFullStatistics[language]} https://dbd.tricky.lol/playerstats/${steamProfile.steamid}`, files: [attachment] });
    } else {
        const canvas = Canvas.createCanvas(1920, 1080);
        const ctx = canvas.getContext('2d');
        let fontSize = 10;
        ctx.drawImage(backgroundStatsSurvivor, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Statistics centered
        ctx.font = '80px "dbd"';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(texts.stats.statistics[language], utils.calculateCenter(910, texts.stats.statistics[language].length, fontSize), 75);

        // Killer logo
        ctx.drawImage(survivorImage, 900, 150, 128, 128);

        // Hours
        ctx.font = '50px "dbd"';
        ctx.fillText(texts.stats.hoursPlayed[language] + utils.comma(parseInt(dbdProfile.playtime / 60)), 230, 180);

        // Bloodpoints
        ctx.drawImage(bpImage, 25, 230, 64, 64);
        ctx.font = '50px "dbd"';
        ctx.fillText(utils.comma(dbdProfile.bloodpoints), 100, 280);

        // Kills
        ctx.drawImage(killsImage, 25, 330, 64, 64);
        ctx.fillText(texts.stats.perfectGames[language] + dbdProfile.survivor_perfectgames, 100, 380);

        // Sacrificed
        ctx.drawImage(sacrificedImage, 25, 430, 64, 64);
        ctx.fillText(texts.stats.gensRepaired[language] + dbdProfile.gensrepaired, 100, 480);

        // Sacrificed obsessions
        ctx.drawImage(sacrificedObsessionsImage, 25, 530, 64, 64);
        ctx.fillText(texts.stats.survivorsHealed[language] + dbdProfile.survivorshealed, 100, 580);

        // Perfect games
        ctx.drawImage(perfectGamesImage, 25, 630, 64, 64);
        ctx.fillText(texts.stats.skillchecks[language] + dbdProfile.skillchecks, 100, 680);

        // Stuns
        ctx.drawImage(paletImage, 25, 730, 64, 64);
        ctx.fillText(texts.stats.escaped[language] + dbdProfile.escaped, 100, 780);

        // Gens damaged
        ctx.drawImage(genDamagedImage, 25, 830, 64, 64);
        ctx.fillText(texts.stats.hexTotemsCleansed[language] + dbdProfile.hextotemscleansed, 100, 880);

        // Survivors grabbed
        ctx.drawImage(carryImage, 25, 930, 64, 64);
        ctx.fillText(texts.stats.exitGatesOpened[language] + dbdProfile.exitgatesopened, 100, 980);

        // profile name
        ctx.fillStyle = '#E52121';
        ctx.font = '70px "dbd"';
        ctx.fillText(steamProfile.personaname, 230, 110);

        // Draw circle
        ctx.beginPath();
        ctx.arc(125, 125, 80, 0, Math.PI * 2, true);
        ctx.strokeStyle = '#F32C2C';
        ctx.lineWidth = 8;
        ctx.closePath();
        ctx.clip();

        const avatar = await loadImageOrPlaceholder(steamProfile.avatarfull, 200, 200);
        ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new context.discord.AttachmentBuilder(canvas.toBuffer(), { name: 'stats-image.jpg' });
        let flagOrSteam = steamProfile.loccountrycode ? `:flag_${steamProfile.loccountrycode.toLowerCase()}:` : "<:steam:914663956860248134>";
        interaction.editReply({ content: `${flagOrSteam} **${steamProfile.personaname}** | ${texts.stats.seeFullStatistics[language]} https://dbd.tricky.lol/playerstats/${steamProfile.steamid} `, files: [attachment] });
    }
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
    sendShrine: sendShrine,
    init: init,
    getStats: getStats,
    calculateLevel: calculateLevel,
    isValidProgression: isValidProgression,
    getBloodpointsToBuyLevels: getBloodpointsToBuyLevels,
    generateRandomBuild: generateRandomBuild,
    getSteamId: getSteamId,
    test: test
}