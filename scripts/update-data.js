/**
 * Maintenance pass after a chapter drops. Run it through update-dlc.ps1.
 *
 *   node scripts/update-data.js            # report only
 *   node scripts/update-data.js --write    # download and update the icon maps
 *
 * Does three things:
 *   1. Downloads every perk icon the wiki has and we do not (the bot does this on its own too,
 *      but on Azure Container Apps the filesystem is ephemeral, so what counts is what gets
 *      committed to the repo).
 *   2. Downloads anything listed in assets/manual-icons.json, for the images the wiki does not
 *      carry under a name we can resolve — character portraits in particular.
 *   3. Rewrites assets/manual-icons.json with whatever is still missing, so the file is always
 *      an up-to-date to-do list: paste a URL next to an id and re-run.
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");

const http = require("../src/services/http.js");
const iconService = require("../src/services/iconService.js");
const utils = require("../src/utils/utils.js");

const ROOT = path.join(__dirname, "..");
const MANUAL_FILE = path.join(ROOT, "assets/manual-icons.json");
const PERK_ICONS = path.join(ROOT, "assets/perks/icons.json");
const CHARACTER_ICONS = path.join(ROOT, "assets/characters/icons.json");
const PERKS_DIR = path.join(ROOT, "assets/Visuals/Perks");
const CHARACTERS_DIR = path.join(ROOT, "assets/Visuals/Characters");
const API = "https://dbd.tricky.lol/api";

const write = process.argv.includes("--write");

function get(url, binary) {
    const options = { headers: { "User-Agent": http.userAgent() }, timeout: 30000 };
    return binary ? http.getBuffer(url, options) : http.getText(url, options);
}

function readJson(file, fallback) {
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (err) {
        return fallback;
    }
}

function writeJson(file, value) {
    const sorted = Object.fromEntries(Object.keys(value).sort().map((k) => [k, value[k]]));
    fs.writeFileSync(file, JSON.stringify(sorted, null, 2) + "\n");
}

/**
 * @param {String} url - Direct image URL.
 * @param {String} dir - Destination folder.
 * @param {String} target - Path relative to that folder.
 * @description Download an image, refusing anything that is not actually a PNG or JPEG.
 */
async function download(url, dir, target) {
    const buffer = await get(url, true);
    const header = buffer.slice(0, 4).toString("hex");
    if (!header.startsWith("89504e47") && !header.startsWith("ffd8ff")) {
        throw new Error("the URL did not return a PNG or JPEG (an HTML page, maybe?)");
    }
    fs.mkdirSync(path.join(dir, path.dirname(target)), { recursive: true });
    fs.writeFileSync(path.join(dir, target), buffer);
    return buffer.length;
}

(async () => {
    const perks = JSON.parse(await get(`${API}/perks`));
    const characters = JSON.parse(await get(`${API}/characters`));
    console.log(`API: ${Object.keys(perks).length} perks, ${Object.keys(characters).length} characters\n`);

    // ---- 1. perk icons from the wiki ----
    console.log("== Perk icons from deadbydaylight.wiki.gg ==");
    const wiki = await iconService.sync(perks, write);
    if (wiki.broken.length) console.log(`  ${wiki.broken.length} entries pointed at files that are not on disk`);
    if (wiki.downloaded.length) {
        console.log(`  ${write ? "downloaded" : "available"}: ${wiki.downloaded.length}`);
        wiki.downloaded.forEach((p) => console.log(`    ${p.name} -> ${p.target}`));
    } else {
        console.log("  nothing new");
    }

    console.log("\n== Spanish perk names from deadbydaylight.wiki.gg ==");
    const namesService = require("../src/services/namesService.js");
    const overrides = readJson(path.join(ROOT, "src/data/overrides.es.json"), { perks: {} });
    const spanish = await namesService.syncNames(perks, write);
    if (spanish.resolved.length) {
        // Only the ones with no hand-written override actually change what users see.
        const effective = spanish.resolved.filter((p) => !overrides.perks[p.id]);
        console.log(`  ${write ? "updated" : "would update"}: ${spanish.resolved.length} (${effective.length} not covered by overrides.es.json)`);
        effective.forEach((p) => console.log(`    ${p.name} -> ${p.spanish}`));
    } else {
        console.log("  nothing new");
    }
    if (spanish.untranslated.length) {
        console.log(`  no Spanish name on the wiki (${spanish.untranslated.length}): ${spanish.untranslated.map(p => p.name).join(", ")}`);
    }

    console.log("\n== Character portraits from deadbydaylight.wiki.gg ==");
    const wikiCharacters = await iconService.syncCharacters(characters, write);
    if (wikiCharacters.broken.length) console.log(`  ${wikiCharacters.broken.length} entries pointed at files that are not on disk`);
    if (wikiCharacters.downloaded.length) {
        console.log(`  ${write ? "downloaded" : "available"}: ${wikiCharacters.downloaded.length}`);
        wikiCharacters.downloaded.forEach((c) => console.log(`    ${c.name} -> ${c.target}`));
    } else {
        console.log("  nothing new");
    }

    // ---- 2. manual links ----
    const manual = readJson(MANUAL_FILE, { perks: {}, characters: {} });
    const perkIcons = readJson(PERK_ICONS, {});
    const characterIcons = readJson(CHARACTER_ICONS, {});

    const jobs = [];
    for (const [id, url] of Object.entries(manual.perks || {})) {
        if (!url) continue;
        const perk = Object.entries(perks).find(([key]) => utils.canonicalId(key) === id);
        const role = perk ? perk[1].role : "survivor";
        jobs.push({ kind: "perk", id, url, dir: PERKS_DIR, target: `${role === "survivor" ? "Survivors" : "Killers"}/${id}.png` });
    }
    for (const [id, url] of Object.entries(manual.characters || {})) {
        if (!url) continue;
        const character = Object.values(characters).find((c) => utils.canonicalId(c.id) === id);
        const role = character ? character.role : "survivor";
        jobs.push({ kind: "character", id, url, dir: CHARACTERS_DIR, target: `${role === "survivor" ? "Survivors" : "Killers"}/${id}.png` });
    }

    console.log("\n== Manual links from assets/manual-icons.json ==");
    if (!jobs.length) console.log("  no URLs filled in");
    for (const job of jobs) {
        if (!write) {
            console.log(`  would download ${job.id} -> ${job.target}`);
            continue;
        }
        try {
            const bytes = await download(job.url, job.dir, job.target);
            if (job.kind === "perk") perkIcons[job.id] = job.target;
            else characterIcons[job.id] = job.target;
            delete manual[job.kind === "perk" ? "perks" : "characters"][job.id];
            console.log(`  ok    ${job.id} -> ${job.target} (${Math.round(bytes / 1024)} KB)`);
        } catch (err) {
            console.log(`  FAIL  ${job.id}: ${err.message}`);
        }
    }

    // ---- 3. rewrite the to-do list ----
    const missingPerks = Object.entries(perks)
        .map(([key, perk]) => ({ id: utils.canonicalId(key), name: perk.name, role: perk.role }))
        .filter((perk) => !perkIcons[perk.id]);
    const missingCharacters = Object.values(characters)
        .map((c) => ({ id: utils.canonicalId(c.id), name: c.name, role: c.role }))
        .filter((c) => !characterIcons[c.id]);

    const todo = { perks: {}, characters: {} };
    for (const perk of missingPerks) todo.perks[perk.id] = manual.perks?.[perk.id] || "";
    for (const character of missingCharacters) todo.characters[character.id] = manual.characters?.[character.id] || "";

    if (write) {
        writeJson(PERK_ICONS, perkIcons);
        writeJson(CHARACTER_ICONS, characterIcons);
        fs.writeFileSync(MANUAL_FILE, JSON.stringify(todo, null, 2) + "\n");
    }

    console.log("\n== Still missing ==");
    console.log(`  perks:      ${missingPerks.length}`);
    missingPerks.forEach((p) => console.log(`    ${p.id.padEnd(16)} ${p.name} (${p.role})`));
    console.log(`  characters: ${missingCharacters.length}`);
    missingCharacters.forEach((c) => console.log(`    ${c.id.padEnd(16)} ${c.name} (${c.role})`));

    if (!write) {
        console.log("\nReport only. Re-run with --write to apply.");
    } else if (missingPerks.length || missingCharacters.length) {
        console.log("\nPaste direct image URLs into assets/manual-icons.json next to the ids above, then run this again.");
    }
})().catch((err) => {
    console.error(`update-data failed: ${err.message}`);
    process.exit(1);
});
