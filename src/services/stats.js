const statsConfig = require("../data/stats.json");
const https = require("https");
const http = require("http");
const Canvas = require("canvas");
const bigNumber = require("bignumber.js");
const convert = new bigNumber('76561197960265728');
const texts = require("../data/texts.json");
const apis = require("../data/apis.json");
const utils = require("../utils/utils.js");

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

async function init() {
    backgroundKiller = await Canvas.loadImage("assets/Visuals/Background/random_killer.jpg");
    backgroundSurvivor = await Canvas.loadImage("assets/Visuals/Background/random_survivor.jpg");
    backgroundShrine = await Canvas.loadImage("./assets/Visuals/Background/shrine.jpg");
    backgroundLevel = await Canvas.loadImage("assets/Visuals/Background/level.jpg");
    backgroundStatsSurvivor = await Canvas.loadImage("assets/Visuals/Background/stats_survivor.jpg");
    backgroundStatsKiller = await Canvas.loadImage("assets/Visuals/Background/stats_killer.jpg");
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

let updateShrine = true;

function verifyShrine(context, force = false) {
    const time = new Date();
    if (time.toUTCString().toLowerCase().includes('wed') && time.getUTCHours() == '0' && time.getUTCMinutes() == '1' && updateShrine || force) {
        updateShrine = !updateShrine;
        setTimeout(() => {
            updateShrine = true;
        }, 120000);

        let options = {
            host: statsConfig.host,
            path: statsConfig.paths.shrine,
            headers: { 'User-Agent': 'EntityBot/' + context.config.version }
        };
        let req = https.get(options, function (res) {
            let bodyChunks = [];

            res.on('data', function (chunk) {
                bodyChunks.push(chunk);
            });

            res.on('end', function () {
                let body = Buffer.concat(bodyChunks);
                if (res.statusCode == 200 || res.statusCode == 201) {
                    try {
                        let parsed = JSON.parse(body);
                        context.services.database.query(`DELETE FROM santuario`)
                        context.services.database.query(`INSERT INTO santuario (perk_1, perk_2, perk_3, perk_4) VALUES ('${parsed.perks[0].id.toLowerCase()}:${parsed.perks[0].shards}', '${parsed.perks[1].id.toLowerCase()}:${parsed.perks[1].shards}', '${parsed.perks[2].id.toLowerCase()}:${parsed.perks[2].shards}', '${parsed.perks[3].id.toLowerCase()}:${parsed.perks[3].shards}')`)
                    } catch (err) {
                        console.log(`Error parsing shrine body: ${err} --- body: ${JSON.stringify(body)}`);
                    }
                }
            });
        });

        req.on('error', function (e) {
            console.error(`verify shrine error: ${e}`);
        });

        req.end();
        return;
    }
}

async function sendShrine(context, interaction) {
    const serverConfig = context.client.servers.get(interaction.guildId);
    if (serverConfig) {
        context.services.database.query(`SELECT * FROM santuario`, async (err, rows) => {
            if (err) throw err;
            let perksName = [rows[0].perk_1.split(":")[0], rows[0].perk_2.split(":")[0], rows[0].perk_3.split(":")[0], rows[0].perk_4.split(":")[0]];
            let shards = [rows[0].perk_1.split(":")[1], rows[0].perk_2.split(":")[1], rows[0].perk_3.split(":")[1], rows[0].perk_4.split(":")[1]];
            let perk1 = await context.services.perks.getPerkById(perksName[0]);
            let perk2 = await context.services.perks.getPerkById(perksName[1]);
            let perk3 = await context.services.perks.getPerkById(perksName[2]);
            let perk4 = await context.services.perks.getPerkById(perksName[3]);
            if (!perk1 || !perk2 || !perk3 || !perk4) {
                console.log(`Invalid perks in shrine: ${perk1} ${perksName[0]} (${rows[0].perk_1}) | ${perk2} (${rows[0].perk_2}) | ${perk3} (${rows[0].perk_3}) | ${perk4} (${rows[0].perk_4})`)
                interaction.reply("We are currently unable to display this information, please report it on our Discord in the bugs section: https://discord.gg/T6rEERg")
                return
            }

            const canvas = Canvas.createCanvas(1163, 664);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(backgroundShrine, 0, 0, canvas.width, canvas.height);
            const perkImage_1 = await Canvas.loadImage(perk1.link);
            const perkImage_2 = await Canvas.loadImage(perk2.link);
            const perkImage_3 = await Canvas.loadImage(perk3.link);
            const perkImage_4 = await Canvas.loadImage(perk4.link);
            ctx.drawImage(perkImage_1, 454, 3.5, 256, 256);
            ctx.drawImage(perkImage_2, 280, 177, 256, 256);
            ctx.drawImage(perkImage_3, 626, 177, 256, 256);
            ctx.drawImage(perkImage_4, 454, 355, 256, 256);
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            const attachment = new context.discord.MessageAttachment(canvas.toBuffer(), 'shrine-image.png');

            if (serverConfig.language === 0) {
                await interaction.editReply({ content: `🈴 **Santuario:**\n1⃣ ${perk1.nameEs} - <:frag_iri:739690491829813369> ${shards[0]}\n2⃣ ${perk2.nameEs} - <:frag_iri:739690491829813369> ${shards[1]}\n3⃣ ${perk3.nameEs} - <:frag_iri:739690491829813369> ${shards[2]}\n4⃣ ${perk4.nameEs} - <:frag_iri:739690491829813369> ${shards[3]}`, files: [attachment] });
            } else if (serverConfig.language === 1) {
                await interaction.editReply({ content: `🈴 **Santuario:**\n1⃣ ${perk1.nameEn} - <:frag_iri:739690491829813369> ${shards[0]}\n2⃣ ${perk2.nameEn} - <:frag_iri:739690491829813369> ${shards[1]}\n3⃣ ${perk3.nameEn} - <:frag_iri:739690491829813369> ${shards[2]}\n4⃣ ${perk4.nameEn} - <:frag_iri:739690491829813369> ${shards[3]}`, files: [attachment] });
            }


            setTimeout(() => {
                verifyShrine(context, true);
            }, 2000);
        });
    }
}

async function getStats(context, interaction, steamLink, isSurvivor) {
    const serverConfig = context.client.servers.get(interaction.guildId);
    steamLink = steamLink.toLowerCase();

    if (serverConfig) {
        // Profile with friend code (32 bits)
        if (!steamLink.includes('steamcommunity.com/id/') && !steamLink.includes('steamcommunity.com/profiles/')) {
            if (isNaN(steamLink)) return interaction.editReply({ content: texts.errors.invalidFriendCode[serverConfig.language] });
            if (steamLink.length < 8) return interaction.editReply({ content: texts.errors.invalidFriendCode[serverConfig.language] });
            const steamid = steamID_64(steamLink);
            getSteamProfile(context, interaction, steamid, isSurvivor);
            return
        } else if (steamLink.includes('steamcommunity.com/profiles/')) {
            // Profile with steam id (64 bits)
            const steamid = steamLink.slice(steamLink.indexOf("profiles/") + 9, steamLink.length)
            steamid = steamid.replace("/", "")
            getSteamProfile(context, interaction, steamid, isSurvivor);
            return
        } else if (steamLink.includes('steamcommunity.com/id/')) {
            // Profile with vanity URL
            steamLink = steamLink.slice(steamLink.indexOf("/id/") + 4, steamLink.length);
            steamLink = steamLink.replace("/", "");
            let options = {
                host: apis.steam.host,
                path: apis.steam.vanityURL.path + steamLink,
                headers: { 'User-Agent': 'EntityBot/' + context.config.version }
            };
            let req = http.get(options, function (res) {
                let bodyChunks_ = [];
                res.on('data', function (chunk) {
                    bodyChunks_.push(chunk);
                });

                res.on('end', function () {
                    let body = Buffer.concat(bodyChunks_);
                    if (res.statusCode == 200 || res.statusCode == 201) {
                        try {
                            body = JSON.parse(body);
                            if (utils.isEmptyObject(body)) return interaction.editReply(texts.errors.profileNotFound[serverConfig.language]);
                            if (body.response.success != 1) return interaction.editReply(texts.errors.profileNotFound[serverConfig.language]);
                            getSteamProfile(context, interaction, body.response.steamid, isSurvivor);
                        } catch (err) {
                            console.log(`Error trying to parse body from steam resolving vanity URL: ${err} --- BODY: ${JSON.stringify(body)}`);
                        }
                    } else return interaction.editReply(texts.errors.profileNotFound[serverConfig.language]);
                });
            });

            req.on("error", (err) => {
                console.log(`Error with vanity URL from steam api: ${err}`);
            });
            req.end();
        }
    }
}

/**
 * @param context - BotContext.
 * @param interaction - Discord command interaction.
 * @param {BigInt64Array} steamId - SteamID in 64bits.
 * @param {Boolean} isSurv - true = survivor | false = killer
 * @description First part for get user stats from Australian Website.
 */
function getSteamProfile(context, interaction, steamId, isSurv) {
    const serverConfig = context.client.servers.get(interaction.guildId);
    let options = {
        host: apis.steam.host,
        path: apis.steam.playerSummaries.path + steamId,
        headers: { 'User-Agent': 'EntityBot/' + context.config.version }
    };

    let req = http.get(options, function (res) {
        let bodyChunks_ = [];
        res.on('data', function (chunk) {
            bodyChunks_.push(chunk);
        });

        res.on('end', function () {
            let body = Buffer.concat(bodyChunks_);
            if (body.includes("<html><head><title>Bad Request</title>")) return interaction.editReply(texts.errors.profileNotFound[serverConfig.language]);
            if (utils.isEmptyObject(body)) return interaction.editReply(texts.errors.profileNotFound[serverConfig.language]);
            if (res.statusCode == 200 || res.statusCode == 201) {
                try {
                    body = JSON.parse(body);
                    if (body.response && body.response.players && body.response.players.length && body.response.players[0].profilestate) {
                        if (body.response.players[0].profilestate != 1) return interaction.editReply(texts.errors.privateProfile[serverConfig.language]);
                        sendStats(context, interaction, body.response.players[0], isSurv);
                    } else return interaction.editReply(texts.errors.profileNotFound[serverConfig.language]);
                } catch (err) {
                    console.log(`Error trying to parse body from steam player summaries: ${err} --- BODY: ${JSON.stringify(body)}`);
                }
            } else return interaction.editReply(texts.errors.profileNotFound[serverConfig.language]);
        });
    });

    req.on("error", (err) => {
        console.log(`Error with get player summaries from steam api: ${err}`);
    });
    req.end();
}

/**
 * @param context - BotContext
 * @param interaction - Discord command interaction.
 * @param steamProfile - Steam profile object.
 * @param {Boolean} isSurv - true = survivor | false = killer
 * @description - Get stats from Australian Website, and send this to the channel.
 */
function sendStats(context, interaction, steamProfile, isSurv) {
    let options = {
        host: apis.dbdStats.host,
        path: apis.dbdStats.path + steamProfile.steamid,
        headers: { 'User-Agent': 'EntityBot/' + context.config.version }
    };

    let req = https.get(options, function (res) {
        let bodyChunks_ = [];
        res.on('data', function (chunk) {
            bodyChunks_.push(chunk);
        });

        res.on('end', function () {
            let body = Buffer.concat(bodyChunks_);
            console.log(`australian site code: ${res.statusCode}`);

            if (res.statusCode == 200 || res.statusCode == 201) {
                try {
                    body = JSON.parse(body);
                    if (body.killer_rank == 20 && body.killed == 0 && body.sacrificed == 0 && body.bloodpoints == 0) sendEmbedError(context, interaction, 1);
                    else sendEmbedStats(context, interaction, steamProfile, body, isSurv);
                } catch (err) {
                    console.log(`Error trying to parse body from australian website: ${err} --- BODY: ${JSON.stringify(body)}`);
                }
            } else return postStats(context, interaction, steamProfile.steamid)
        });
    });

    req.on("error", (err) => {
        console.log(`Error with get player stats from australian website: ${err}`);
        sendEmbedError(context, interaction, 3);
    });
    req.end();
}

/**
 * @param context - BotContext.
 * @param interaction - Discord command interaction.
 * @param {BigInt64Array} steamId - SteamID in 64bits.
 * @description - Post stats to Australian Website.
 */
function postStats(context, interaction, steamId) {
    const serverConfig = context.client.servers.get(interaction.guildId);
    if (serverConfig) {
        let options = {
            host: apis.dbdStats.host,
            path: apis.dbdStats.path + steamId,
            method: 'POST',
            headers: { 'User-Agent': 'EntityBot/' + context.config.version }
        };

        let req = https.request(options, function (res) {
            if (res.statusCode != 201) {
                console.log(`ERROR POST: ${res.statusCode} | message: ${res.statusMessage} | headers: ${JSON.stringify(res.headers)} | steamid: ${steamId}`);
                sendEmbedError(context, interaction, 2);
            } else {
                console.log(`SUCCESS POST: ${res.statusCode} | steamid: ${steamId}`);
                interaction.editReply(texts.accountUpdating[serverConfig.language]);
            }
        })

        req.on("error", (err) => {
            console.log(`error posting account to dbd stats: ${err}`);
            sendEmbedError(context, interaction, 3);
        })
        req.end();
    }
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
    const serverConfig = context.client.servers.get(interaction.guildId);
    if (serverConfig) {
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

            const avatar = await Canvas.loadImage(steamProfile.avatarfull);
            ctx.drawImage(avatar, 25, 25, 200, 200);

            const attachment = new context.discord.MessageAttachment(canvas.toBuffer(), 'stats-image.jpg');
            let flagOrSteam = steamProfile.loccountrycode ? `:flag_${steamProfile.loccountrycode.toLowerCase()}:` : "<:steam:914663956860248134>";
            interaction.editReply({ content: `${flagOrSteam} **${steamProfile.personaname}** | ${texts.stats.seeFullStatistics[language]} https://dbd.onteh.net.au/playerstats/${steamProfile.steamid}`, files: [attachment] });
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

            const avatar = await Canvas.loadImage(steamProfile.avatarfull);
            ctx.drawImage(avatar, 25, 25, 200, 200);

            const attachment = new context.discord.MessageAttachment(canvas.toBuffer(), 'stats-image.jpg');
            let flagOrSteam = steamProfile.loccountrycode ? `:flag_${steamProfile.loccountrycode.toLowerCase()}:` : "<:steam:914663956860248134>";
            interaction.editReply({ content: `${flagOrSteam} **${steamProfile.personaname}** | ${texts.stats.seeFullStatistics[language]} https://dbd.onteh.net.au/playerstats/${steamProfile.steamid} `, files: [attachment] });
        }
    }
}


/**
 * @param context - BotContext.
 * @param interaction - Discord command interaction.
 * @param {Int8Array} type - 1 = Update in progress | 2 = Account Private. | 3 = Unknown error.
 * @description - Send embed error with information.
 */
function sendEmbedError(context, interaction, type) {
    const serverConfig = context.client.servers.get(interaction.guildId);
    if (serverConfig) {
        const text = texts.errors.types[type.toString()];
        const embedd = new context.discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle(text.title[serverConfig.language]);

        for (let field of text.fields) {
            embedd.addField(field.name[serverConfig.language], field.value[serverConfig.language]);
        }

        if (text.image) {
            embedd.setImage(text.image);
        }
        embedd.setThumbnail(context.client.user.avatarURL());
        interaction.editReply({ embeds: [embedd], ephemeral: true });
    }
}

function calculateLevel(context, interaction, currentLevel, wantedLevel) {
    const serverConfig = context.client.servers.get(interaction.guildId);
    if (serverConfig) {
        const operation = getBloodpointsToBuyLevels(currentLevel, wantedLevel);
        const language = serverConfig.language;

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
        ctx.fillText(currentLevel, utils.calculateCenter(113, currentLevel.toString().length, fontSize), 210);
        ctx.fillText(wantedLevel, utils.calculateCenter(419, wantedLevel.toString().length, fontSize), 213);
        ctx.fillText(utils.comma(operation.price), utils.calculateCenter(290, operation.price.toString().length, fontSize), 355);

        const attachment = new context.discord.MessageAttachment(canvas.toBuffer(), 'calculate-image.png');
        interaction.editReply({ content: "‎      ‏‏‎", files: [attachment] });
    }
}

function getBloodpointsToBuyLevels(currentLevel, wantedLevel) {
    let total = 0;
    let levelsToBuy = 0;
    for (let x = currentLevel; x <= wantedLevel; x++) {
        if (x == wantedLevel) break;
        levelsToBuy++;
        if (x >= 1 && x <= 9) total = total + 12000;
        if (x >= 10 && x <= 19) total = total + 24000;
        if (x >= 20 && x <= 29) total = total + 34000;
        if (x >= 30 && x <= 39) total = total + 40000;
        if (x >= 40 && x <= 50) total = total + 50000;
    }
    return {
        levelsToBuy: levelsToBuy,
        price: total
    };
}

async function generateRandomBuild(context, interaction, isSurv) {
    const serverConfig = context.client.servers.get(interaction.guildId);
    let perk1, perk2, perk3, perk4, numberCharacter;
    const survivors = context.services.characters.getSurvivors();
    const killers = context.services.characters.getKillers();
    const language = serverConfig.language;

    if (isSurv) {
        numberCharacter = Math.floor(Math.random() * utils.getLength(survivors));
        const survivorPerks = context.services.perks.getSurvivorPerks();
        nPerks = getRandomNumber(utils.getLength(survivorPerks));
        perk1 = survivorPerks[nPerks.n1];
        perk2 = survivorPerks[nPerks.n2];
        perk3 = survivorPerks[nPerks.n3];
        perk4 = survivorPerks[nPerks.n4];
    } else {
        numberCharacter = Math.floor(Math.random() * utils.getLength(killers));
        const killerPerks = context.services.perks.getKillerPerks();
        nPerks = getRandomNumber(utils.getLength(killerPerks));
        perk1 = killerPerks[nPerks.n1];
        perk2 = killerPerks[nPerks.n2];
        perk3 = killerPerks[nPerks.n3];
        perk4 = killerPerks[nPerks.n4];
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
    const avatar = await Canvas.loadImage(isSurv ? survivors[numberCharacter].link : killers[numberCharacter].link);
    ctx.drawImage(avatar, 1045, 227, 447, 619);

    // perks
    const perkImage_1 = await Canvas.loadImage(perk1.link);
    const perkImage_2 = await Canvas.loadImage(perk2.link);
    const perkImage_3 = await Canvas.loadImage(perk3.link);
    const perkImage_4 = await Canvas.loadImage(perk4.link);
    ctx.drawImage(perkImage_1, 302, 234, 256, 256);
    ctx.drawImage(perkImage_2, 116, 429, 256, 256);
    ctx.drawImage(perkImage_3, 493, 429, 256, 256);
    ctx.drawImage(perkImage_4, 303, 605, 256, 256);

    const attachment = new context.discord.MessageAttachment(canvas.toBuffer(), 'random.png');

    if (language == 0) {
        interaction.editReply({ content: `**PERKS:**\n1⃣: ${perk1.nameEs}\n2⃣: ${perk2.nameEs}\n3⃣: ${perk3.nameEs}\n4⃣: ${perk4.nameEs}`, files: [attachment] });
    } else {
        interaction.editReply({ content:`**PERKS:**\n1⃣: ${perk1.nameEn}\n2⃣: ${perk2.nameEn}\n3⃣: ${perk3.nameEn}\n4⃣: ${perk4.nameEn}`, files: [attachment] });
    }
}

/**
 * @param {Int8Array} max - Max number for the random selector.
 * @description Get 4 random numbers without repeating.
 */
function getRandomNumber(max) {
    let n1 = Math.floor(Math.random() * max);
    let n2 = Math.floor(Math.random() * max);
    if (n2 == n1) {
        while (n2 == n1) {
            n2 = Math.floor(Math.random() * max);
        }
    }
    let n3 = Math.floor(Math.random() * max);
    if (n3 == n1 || n3 == n2) {
        while (n3 == n1) {
            n3 = Math.floor(Math.random() * max);
        }
        while (n3 == n2) {
            n3 = Math.floor(Math.random() * max);
        }
    }
    let n4 = Math.floor(Math.random() * max);
    if (n4 == n1 || n4 == n2 || n4 == n3) {
        while (n4 == n1) {
            n4 = Math.floor(Math.random() * max);
        }
        while (n4 == n2) {
            n4 = Math.floor(Math.random() * max);
        }
        while (n4 == n3) {
            n4 = Math.floor(Math.random() * max);
        }
    }
    return {
        n1: n1,
        n2: n2,
        n3: n3,
        n4: n4
    }
}


/**
 * @param {BigInt32Array} steamId32 - SteamID in 32bits.
 * @description - Return steamID 64 bits.
 */
function steamID_64(steamId32) {
    steamId32 = new bigNumber(steamId32);
    let steamId64 = steamId32.plus(convert)
    return steamId64.toString();
}

module.exports = {
    verifyShrine: verifyShrine,
    sendShrine: sendShrine,
    init: init,
    getStats: getStats,
    calculateLevel: calculateLevel,
    generateRandomBuild: generateRandomBuild
}