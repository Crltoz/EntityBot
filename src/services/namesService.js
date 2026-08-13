const fs = require("fs");
const path = require("path");
const https = require("https");
const utils = require("../utils/utils.js");

/**
 * @description Pulls the official Spanish perk names from the wiki.
 *
 * The English wiki links every page to its translations, so a perk's Spanish name is one
 * `langlinks` query away. That covers new chapters automatically, which is the whole point.
 *
 * The result is written to src/data/names.es.json and is a *lower* priority than the
 * hand-written src/data/overrides.es.json: anything translated by hand keeps its wording, and
 * the wiki only fills the gaps. Deleting an entry from overrides.es.json adopts the wiki's
 * version for that perk.
 *
 * Only perks are worth pulling this way. For killers the Spanish wiki titles pages with the
 * character's real name ("The Trapper" links to "Evan MacMillan", not "El Trampero"), so the
 * character names stay manual.
 */

const NAMES_FILE = path.join(__dirname, "../data/names.es.json");
const WIKI_API = "https://deadbydaylight.wiki.gg/api.php";
const BATCH_SIZE = 50;
const REQUEST_TIMEOUT = 20000;

let names = {};

function loadNames() {
    try {
        names = JSON.parse(fs.readFileSync(NAMES_FILE, "utf8"));
    } catch (err) {
        names = {};
    }
    return names;
}

function getNames() {
    if (!Object.keys(names).length) loadNames();
    return names;
}

function get(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, { headers: { 'User-Agent': process.env.USER_AGENT || "EntityBot" } }, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error(`HTTP ${res.statusCode}`));
            }
            let body = "";
            res.on("data", (c) => body += c);
            res.on("end", () => resolve(body));
        });
        req.on("error", reject);
        req.setTimeout(REQUEST_TIMEOUT, () => req.destroy(new Error("timed out")));
    });
}

/**
 * @param {String} title - Perk name as the API spells it.
 * @description Title spellings to try. The API and the wiki disagree on curly apostrophes and
 *              on the capitalisation of small words, which is what most misses come down to.
 */
function titleVariants(title) {
    const straight = title.replace(/[’‘]/g, "'");
    const curly = title.replace(/'/g, "’");
    const titleCase = straight.replace(/\S+/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
    return [...new Set([title, straight, curly, titleCase])];
}

/**
 * @param {Array} titles - Wiki page titles.
 * @description Spanish name for each title that has one, keyed by the title we asked for.
 */
async function fetchLangLinks(titles) {
    const found = {};
    for (let i = 0; i < titles.length; i += BATCH_SIZE) {
        const batch = titles.slice(i, i + BATCH_SIZE);
        const url = `${WIKI_API}?action=query&titles=${encodeURIComponent(batch.join("|"))}` +
            `&prop=langlinks&lllang=es&lllimit=500&format=json&redirects=1`;
        const page = JSON.parse(await get(url));
        if (!page.query || !page.query.pages) continue;
        for (const entry of Object.values(page.query.pages)) {
            if (!entry.langlinks || !entry.langlinks.length) continue;
            found[entry.title] = entry.langlinks[0]["*"];
        }
        // Redirects and normalisation rename the title on the way in, so map them back.
        for (const hop of [...(page.query.redirects || []), ...(page.query.normalized || [])]) {
            if (found[hop.to] && !found[hop.from]) found[hop.from] = found[hop.to];
        }
    }
    return found;
}

/**
 * @param {Object} perks - Raw /api/perks payload.
 * @param {Boolean} persist - Whether to write names.es.json.
 * @description Fetch the Spanish name of every perk. Returns what was resolved and what the
 *              Spanish wiki has not translated yet.
 */
async function syncNames(perks, persist) {
    loadNames();

    const entries = Object.entries(perks).map(([key, perk]) => ({ id: utils.canonicalId(key), name: perk.name }));
    const wanted = [...new Set(entries.flatMap((perk) => titleVariants(perk.name)))];
    const found = await fetchLangLinks(wanted);

    const resolved = [];
    const untranslated = [];
    for (const perk of entries) {
        const spanish = titleVariants(perk.name).map((variant) => found[variant]).find(Boolean);
        if (!spanish) {
            untranslated.push(perk);
            continue;
        }
        if (names[perk.id] !== spanish) resolved.push({ ...perk, spanish, isNew: !names[perk.id] });
        names[perk.id] = spanish;
    }

    if (persist && resolved.length) {
        try {
            const sorted = Object.fromEntries(Object.keys(names).sort().map((k) => [k, names[k]]));
            fs.writeFileSync(NAMES_FILE, JSON.stringify(sorted, null, 2) + "\n");
            names = sorted;
        } catch (err) {
            console.log(`Could not write the Spanish name map: ${err.message}`);
        }
    }

    return { resolved: resolved, untranslated: untranslated, total: Object.keys(names).length };
}

module.exports = {
    syncNames: syncNames,
    getNames: getNames,
    loadNames: loadNames
}
