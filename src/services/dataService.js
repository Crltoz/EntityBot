const https = require("https");
const apis = require("../data/apis.json");
const utils = require("../utils/utils.js");
const overrides = require("../data/overrides.es.json");
const iconService = require("./iconService.js");
const namesService = require("./namesService.js");

const ENDPOINTS = ["perks", "characters", "dlc"];
const REQUEST_TIMEOUT = 20000;

// Raw API payloads, whatever their origin (live API, Mongo snapshot or bundled files).
let raw = { perks: null, characters: null, dlc: null };

// Views built from `raw`, shaped for the commands that consume them.
let perksById = {};
let survivorPerks = [];
let killerPerks = [];
let survivors = {};
let killers = {};

let lastUpdate = null;
let source = "none";
let refreshTimer = null;

/**
 * @param {String} path - API path.
 * @param {String} version - Bot version, sent in the User-Agent.
 * @description GET a JSON endpoint, rejecting on any non-2xx, timeout or malformed body.
 */
function fetchJson(path, version) {
    return new Promise((resolve, reject) => {
        const req = https.get({
            host: apis.dbdStats.host,
            path: path,
            headers: { 'User-Agent': process.env.USER_AGENT + version }
        }, function (res) {
            const bodyChunks = [];
            res.on('data', (chunk) => bodyChunks.push(chunk));
            res.on('end', function () {
                if (res.statusCode != 200 && res.statusCode != 201) {
                    return reject(new Error(`${path} responded ${res.statusCode}`));
                }
                try {
                    resolve(JSON.parse(Buffer.concat(bodyChunks)));
                } catch (err) {
                    reject(new Error(`${path} returned invalid JSON: ${err.message}`));
                }
            });
        });

        req.on('error', reject);
        req.setTimeout(REQUEST_TIMEOUT, () => req.destroy(new Error(`${path} timed out`)));
        req.end();
    });
}

/**
 * @description Rebuild every view from the current raw payloads.
 *              The API owns the roster and the English names; the bundled overrides add the
 *              Spanish names and the icons, and anything they lack degrades to English + placeholder.
 */
function buildViews() {
    perksById = {};
    survivorPerks = [];
    killerPerks = [];

    const perkIcons = iconService.getIcons();
    const wikiNames = namesService.getNames();
    for (const [key, perk] of Object.entries(raw.perks || {})) {
        const id = utils.canonicalId(key);
        const entry = {
            id: id,
            nameEn: perk.name,
            // Hand-written overrides win, then the wiki's official translation, then English.
            nameEs: overrides.perks[id] || wikiNames[id] || perk.name,
            link: perkIcons[id] || null,
            isSurv: perk.role === "survivor",
            image: perk.image
        };
        perksById[id] = entry;
        (entry.isSurv ? survivorPerks : killerPerks).push(entry);
    }

    // A stable order keeps the index-based lookups meaningful across restarts.
    const byName = (a, b) => a.nameEn.localeCompare(b.nameEn);
    survivorPerks.sort(byName).forEach((perk, i) => perk.index = i);
    killerPerks.sort(byName).forEach((perk, i) => perk.index = i);

    survivors = {};
    killers = {};
    const characterIcons = iconService.getCharacterIcons();
    let survivorCount = 0;
    let killerCount = 0;

    for (const character of Object.values(raw.characters || {})) {
        const id = utils.canonicalId(character.id);
        const translated = overrides.characters[id];
        const entry = {
            id: id,
            name: translated || character.name,
            nameEn: character.name,
            nameEs: translated || character.name,
            link: characterIcons[id] || null
        };
        if (character.role === "survivor") survivors[survivorCount++] = entry;
        else killers[killerCount++] = entry;
    }
}

/**
 * @description Last-resort roster: the JSON files that ship with the repo. Used only when
 *              both the API and the Mongo snapshot are unavailable, so a cold start with no
 *              network still answers /random and /shrine instead of returning nothing.
 */
function loadBundled() {
    const bundledPerks = {};
    for (const [file, isSurv] of [["killer", false], ["survivor", true]]) {
        for (const perk of require(`../../assets/perks/${file}.json`).perks) {
            bundledPerks[perk.id] = { name: perk.nameEn, role: isSurv ? "survivor" : "killer" };
        }
    }

    const bundledCharacters = {};
    let n = 0;
    for (const character of require("../../assets/characters/survivors.json").survivors) {
        bundledCharacters[n++] = { id: character.name, name: character.name, role: "survivor", link: character.link };
    }
    for (const character of require("../../assets/characters/killers.json").killers) {
        bundledCharacters[n++] = { id: character.nameEn, name: character.nameEn, nameEs: character.nameEs, role: "killer", link: character.link };
    }

    raw.perks = bundledPerks;
    raw.characters = bundledCharacters;
    source = "bundled";
}

/**
 * @param context - BotContext.
 * @description Warm the views from the last Mongo snapshot, so the bot is usable before the
 *              first API call finishes and even if that call never succeeds.
 */
async function loadFromCache(context) {
    let loaded = 0;
    for (const name of ENDPOINTS) {
        try {
            const snapshot = await context.services.database.getDataSnapshot(name);
            if (!snapshot || !snapshot.payload) continue;
            raw[name] = JSON.parse(snapshot.payload);
            lastUpdate = snapshot.updatedAt;
            loaded++;
        } catch (err) {
            console.log(`Could not read the '${name}' snapshot: ${err.message}`);
        }
    }
    if (loaded) source = "cache";
    return loaded;
}

/**
 * @param context - BotContext.
 * @description Pull every endpoint. Each one is independent: a failure keeps the previous
 *              payload for that endpoint instead of blanking it.
 */
async function refresh(context) {
    const results = await Promise.allSettled(
        ENDPOINTS.map((name) => fetchJson(apis.dbdStats[name], context.config.version))
    );

    let updated = 0;
    for (let i = 0; i < ENDPOINTS.length; i++) {
        const name = ENDPOINTS[i];
        const result = results[i];

        if (result.status !== "fulfilled" || !result.value || utils.isEmptyObject(result.value)) {
            const reason = result.status === "rejected" ? result.reason.message : "empty response";
            console.log(`Keeping the previous '${name}' data: ${reason}`);
            continue;
        }

        raw[name] = result.value;
        updated++;
        try {
            await context.services.database.saveDataSnapshot(name, result.value);
        } catch (err) {
            console.log(`Could not cache '${name}': ${err.message}`);
        }
    }

    if (updated) {
        lastUpdate = new Date();
        source = "api";
        buildViews();
    }

    console.log(`Data refresh: ${updated}/${ENDPOINTS.length} endpoints updated | source: ${source} | ` +
        `perks: ${survivorPerks.length} surv + ${killerPerks.length} killer | ` +
        `characters: ${utils.getLength(survivors)} surv + ${utils.getLength(killers)} killer`);

    // Pull any art a new chapter brought in. Isolated on purpose: the wiki being down or slow
    // must never cost us a roster refresh.
    let needsRebuild = false;

    if (raw.perks) {
        try {
            const result = await iconService.sync(raw.perks, true);
            if (result.broken.length) {
                console.log(`Perk icon map had ${result.broken.length} entries with no file on disk, re-downloaded.`);
            }
            if (result.downloaded.length) {
                console.log(`Downloaded ${result.downloaded.length} new perk icons: ${result.downloaded.map(p => p.name).join(", ")}`);
                needsRebuild = true;
            }
            if (result.missing.length) {
                console.log(`${result.missing.length} perks are not on the wiki yet, rendering with the placeholder: ${result.missing.map(p => p.name).join(", ")}`);
            }
        } catch (err) {
            console.log(`Perk icon sync skipped: ${err.message}`);
        }
    }

    if (raw.perks) {
        try {
            const result = await namesService.syncNames(raw.perks, true);
            if (result.resolved.length) {
                console.log(`Spanish names updated for ${result.resolved.length} perks (${result.total} known).`);
                needsRebuild = true;
            }
            if (result.untranslated.length) {
                console.log(`${result.untranslated.length} perks have no Spanish name on the wiki, falling back to English or a manual override.`);
            }
        } catch (err) {
            console.log(`Spanish name sync skipped: ${err.message}`);
        }
    }

    if (raw.characters) {
        try {
            const result = await iconService.syncCharacters(raw.characters, true);
            if (result.broken.length) {
                console.log(`Character icon map had ${result.broken.length} entries with no file on disk, re-downloaded.`);
            }
            if (result.downloaded.length) {
                console.log(`Downloaded ${result.downloaded.length} new character portraits: ${result.downloaded.map(c => c.name).join(", ")}`);
                needsRebuild = true;
            }
            if (result.missing.length) {
                console.log(`${result.missing.length} characters have no portrait on the wiki yet: ${result.missing.map(c => c.name).join(", ")}`);
            }
        } catch (err) {
            console.log(`Character portrait sync skipped: ${err.message}`);
        }
    }

    if (needsRebuild) buildViews();
}

/**
 * @param context - BotContext.
 * @description Load the roster and keep it fresh. Requires the database to be connected.
 */
async function init(context) {
    const cached = await loadFromCache(context);
    if (!cached) {
        console.log("No cached game data found, falling back to the bundled JSON files.");
        loadBundled();
    }
    buildViews();

    await refresh(context);

    const hours = context.config.dataRefreshHours || 6;
    refreshTimer = setInterval(() => {
        refresh(context).catch((err) => console.log(`Scheduled data refresh failed: ${err.message}`));
    }, hours * 60 * 60 * 1000);
    if (refreshTimer.unref) refreshTimer.unref();
    console.log(`Game data loaded, refreshing every ${hours}h.`);
}

function getPerkById(id) {
    return perksById[utils.canonicalId(id)];
}

function getSurvivorPerks() {
    return survivorPerks;
}

function getKillerPerks() {
    return killerPerks;
}

function getSurvivors() {
    return survivors;
}

function getKillers() {
    return killers;
}

function getDlc() {
    return raw.dlc || {};
}

function getStatus() {
    return {
        source: source,
        lastUpdate: lastUpdate,
        survivorPerks: survivorPerks.length,
        killerPerks: killerPerks.length,
        survivors: utils.getLength(survivors),
        killers: utils.getLength(killers)
    };
}

module.exports = {
    init: init,
    refresh: refresh,
    getPerkById: getPerkById,
    getSurvivorPerks: getSurvivorPerks,
    getKillerPerks: getKillerPerks,
    getSurvivors: getSurvivors,
    getKillers: getKillers,
    getDlc: getDlc,
    getStatus: getStatus
}
