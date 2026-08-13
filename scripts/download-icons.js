/**
 * Downloads the perk icons the bot is missing.
 *
 *   node scripts/download-icons.js            # report only, downloads nothing
 *   node scripts/download-icons.js --write    # download and update assets/perks/icons.json
 *
 * The bot does this on its own every few hours (see dataService), so this script is only for
 * running it on demand — after a chapter drops, or to check what the wiki is still missing.
 * The matching and downloading live in src/services/iconService.js so both paths behave the same.
 */

require("dotenv").config();

const https = require("https");
const iconService = require("../src/services/iconService.js");

const PERKS_API = "https://dbd.tricky.lol/api/perks";
const write = process.argv.includes("--write");

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { "User-Agent": process.env.USER_AGENT || "EntityBot" } }, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
            }
            let body = "";
            res.on("data", (c) => body += c);
            res.on("end", () => resolve(body));
        }).on("error", reject);
    });
}

(async () => {
    const perks = JSON.parse(await get(PERKS_API));
    const before = Object.keys(iconService.loadIcons()).length;
    console.log(`Perks in the API: ${Object.keys(perks).length} | icons already on disk: ${before}`);

    const result = await iconService.sync(perks, write);

    if (result.broken.length) {
        console.log(`\nListed but not on disk (${result.broken.length}): ${result.broken.join(", ")}`);
    }

    if (result.downloaded.length) {
        console.log(`\n${write ? "Downloaded" : "Available"} (${result.downloaded.length}):`);
        result.downloaded.forEach((perk) => console.log(`  ${perk.name} -> ${perk.target}`));
    }

    if (result.missing.length) {
        console.log(`\nNot on the wiki yet (${result.missing.length}) — these render with the placeholder:`);
        result.missing.forEach((perk) => console.log(`  -  ${perk.name} (${perk.role})`));
    }

    if (!result.downloaded.length && !result.missing.length) {
        console.log("\nNothing to do, every perk already has an icon.");
    } else if (!write && result.downloaded.length) {
        console.log("\nRe-run with --write to keep them.");
    }
})().catch((err) => {
    console.error(`Icon download failed: ${err.message}`);
    process.exit(1);
});
