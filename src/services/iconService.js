const fs = require("fs");
const path = require("path");
const utils = require("../utils/utils.js");
const http = require("./http.js");

/**
 * @description Keeps the perk icons on disk in sync with the wiki.
 *
 * Icons are served from the canvas straight off the local disk (~4ms for a shrine) instead of
 * hotlinked from the wiki CDN (~110ms, and a hard runtime dependency on a site that could turn
 * on hotlink protection at any time). To stay hands-off, this runs on the dataService refresh
 * cycle and downloads whatever is missing.
 *
 * File names on the wiki do not derive from the API's asset path: two prefixes are in use and
 * the suffix follows the perk name. So we list every icon the wiki has and match by name.
 */

const ICONS_FILE = path.join(__dirname, "../../assets/perks/icons.json");
const CHARACTER_ICONS_FILE = path.join(__dirname, "../../assets/characters/icons.json");
const PERKS_DIR = path.join(__dirname, "../../assets/Visuals/Perks");
const CHARACTERS_DIR = path.join(__dirname, "../../assets/Visuals/Characters");
const WIKI_API = "https://deadbydaylight.wiki.gg/api.php";

// Three naming generations live side by side on the wiki: the original "IconPerks_", the
// "IconsPerks_" of recent chapters, and the newest files uploaded under their raw asset name,
// which keeps the game's "T_UI_" prefix.
const ICON_PREFIXES = ["IconPerks_", "IconsPerks_", "T_UI_iconPerks_", "T_UI_iconsPerks_"];
const PERK_PREFIX_PATTERN = /^(T_UI_)?icons?Perks_/i;

let icons = {};
let characterIcons = {};

function loadIcons() {
    try {
        icons = JSON.parse(fs.readFileSync(ICONS_FILE, "utf8"));
    } catch (err) {
        console.log(`Could not read the icon map, starting empty: ${err.message}`);
        icons = {};
    }
    return icons;
}

function getIcons() {
    if (!Object.keys(icons).length) loadIcons();
    return icons;
}

function get(url, binary) {
    const options = { headers: { 'User-Agent': http.userAgent() } };
    return binary ? http.getBuffer(url, options) : http.getText(url, options);
}

/**
 * @param {String} prefix - File name prefix to list.
 * @description Every wiki file under a prefix, following the API's continuation.
 */
async function listImages(prefix) {
    let images = [];
    let cont = "";
    do {
        const page = JSON.parse(await get(`${WIKI_API}?action=query&list=allimages&aiprefix=${prefix}&ailimit=500&format=json${cont}`));
        images = images.concat(page.query.allimages);
        cont = page.continue ? "&aicontinue=" + encodeURIComponent(page.continue.aicontinue) : "";
    } while (cont);
    return images;
}

/**
 * @description Drop entries whose file is not on disk. They would render as a placeholder
 *              forever and nothing else would ever report them.
 */
function pruneBrokenEntries() {
    const broken = [];
    for (const [id, relative] of Object.entries(icons)) {
        if (fs.existsSync(path.join(PERKS_DIR, relative))) continue;
        broken.push(id);
        delete icons[id];
    }
    return broken;
}

/**
 * @param {Object} perks - Raw /api/perks payload.
 * @param {Boolean} persist - Whether to write the updated map back to icons.json.
 * @description Download every perk icon we do not have yet. Returns what was downloaded and
 *              what the wiki still does not carry.
 */
async function sync(perks, persist) {
    loadIcons();
    const broken = pruneBrokenEntries();

    const wanted = Object.entries(perks)
        .map(([key, perk]) => ({ id: utils.canonicalId(key), name: perk.name, role: perk.role, image: perk.image }))
        .filter((perk) => !icons[perk.id] && perk.image);

    if (!wanted.length) return { downloaded: [], missing: [], broken: broken };

    const files = [];
    for (const prefix of ICON_PREFIXES) files.push(...await listImages(prefix));

    const wikiIcons = {};
    for (const file of files) {
        wikiIcons[utils.canonicalId(file.name.replace(PERK_PREFIX_PATTERN, "").replace(/\.png$/i, ""))] = file.url;
    }

    const downloaded = [];
    const missing = [];
    for (const perk of wanted) {
        // The perk name is the reliable match; the API key and the asset name are fallbacks.
        const asset = perk.image.split("/").pop().replace(PERK_PREFIX_PATTERN, "");
        const url = wikiIcons[utils.canonicalId(perk.name)] || wikiIcons[perk.id] || wikiIcons[utils.canonicalId(asset)];
        if (!url) {
            missing.push(perk);
            continue;
        }
        const folder = perk.role === "survivor" ? "Survivors" : "Killers";
        const target = `${folder}/${perk.id}.png`;
        if (!persist) {
            // Dry run: the icon exists on the wiki, but nothing is written.
            downloaded.push({ ...perk, target });
            continue;
        }
        try {
            fs.mkdirSync(path.join(PERKS_DIR, folder), { recursive: true });
            fs.writeFileSync(path.join(PERKS_DIR, target), await get(url, true));
            icons[perk.id] = target;
            downloaded.push({ ...perk, target });
        } catch (err) {
            console.log(`Could not download the icon for '${perk.name}': ${err.message}`);
            missing.push(perk);
        }
    }

    if (persist && downloaded.length) {
        try {
            const sorted = Object.fromEntries(Object.keys(icons).sort().map((k) => [k, icons[k]]));
            fs.writeFileSync(ICONS_FILE, JSON.stringify(sorted, null, 2) + "\n");
            icons = sorted;
        } catch (err) {
            console.log(`Could not write the icon map: ${err.message}`);
        }
    }

    return { downloaded: downloaded, missing: missing, broken: broken };
}

// The bundled portraits are 260x360 and the canvas draws them into a 447x619 box, the same
// 0.72 ratio. The wiki serves square 512x512 cutouts, which would come out stretched, so they
// are trimmed to the character and refitted before being written to disk.
const PORTRAIT_WIDTH = 260;
const PORTRAIT_HEIGHT = 360;

/**
 * @param {Buffer} buffer - Downloaded PNG.
 * @description Trim the transparent margins and refit the character into the portrait size,
 *              preserving its proportions. Returns the original buffer if anything goes wrong.
 */
async function normalizePortrait(buffer) {
    try {
        const Canvas = require("canvas");
        const source = await Canvas.loadImage(buffer);

        const probe = Canvas.createCanvas(source.width, source.height);
        probe.getContext("2d").drawImage(source, 0, 0);
        const pixels = probe.getContext("2d").getImageData(0, 0, source.width, source.height).data;

        let top = source.height, left = source.width, right = -1, bottom = -1;
        for (let y = 0; y < source.height; y++) {
            for (let x = 0; x < source.width; x++) {
                if (pixels[(y * source.width + x) * 4 + 3] < 10) continue;
                if (x < left) left = x;
                if (x > right) right = x;
                if (y < top) top = y;
                if (y > bottom) bottom = y;
            }
        }
        // Fully transparent or already opaque edge to edge: nothing useful to trim.
        if (right < left || bottom < top) return buffer;

        const cropWidth = right - left + 1;
        const cropHeight = bottom - top + 1;
        const scale = Math.min(PORTRAIT_WIDTH / cropWidth, PORTRAIT_HEIGHT / cropHeight);
        const drawWidth = cropWidth * scale;
        const drawHeight = cropHeight * scale;

        const out = Canvas.createCanvas(PORTRAIT_WIDTH, PORTRAIT_HEIGHT);
        out.getContext("2d").drawImage(
            source, left, top, cropWidth, cropHeight,
            (PORTRAIT_WIDTH - drawWidth) / 2, (PORTRAIT_HEIGHT - drawHeight) / 2, drawWidth, drawHeight
        );
        return out.toBuffer();
    } catch (err) {
        console.log(`Could not normalise a portrait, keeping it as downloaded: ${err.message}`);
        return buffer;
    }
}

function loadCharacterIcons() {
    try {
        characterIcons = JSON.parse(fs.readFileSync(CHARACTER_ICONS_FILE, "utf8"));
    } catch (err) {
        console.log(`Could not read the character icon map, starting empty: ${err.message}`);
        characterIcons = {};
    }
    return characterIcons;
}

function getCharacterIcons() {
    if (!Object.keys(characterIcons).length) loadCharacterIcons();
    return characterIcons;
}

/**
 * @param {Object} characters - Raw /api/characters payload.
 * @param {Boolean} persist - Whether to write the updated map back to icons.json.
 * @description Download the portraits we do not have yet. Portraits follow a different naming
 *              scheme than perks — "S47_RickGrimes_Portrait.png" — so rather than listing the
 *              whole wiki we ask for the handful of files under each missing character's id.
 */
async function syncCharacters(characters, persist) {
    loadCharacterIcons();

    const broken = [];
    for (const [id, relative] of Object.entries(characterIcons)) {
        if (fs.existsSync(path.join(CHARACTERS_DIR, relative))) continue;
        broken.push(id);
        delete characterIcons[id];
    }

    const wanted = Object.values(characters)
        .map((character) => ({ id: utils.canonicalId(character.id), apiId: character.id, name: character.name, role: character.role }))
        .filter((character) => !characterIcons[character.id]);

    const downloaded = [];
    const missing = [];
    for (const character of wanted) {
        let url = null;
        try {
            const files = await listImages(encodeURIComponent(character.apiId + "_"));
            const portrait = files.find((file) => /_Portrait\.png$/i.test(file.name));
            if (portrait) url = portrait.url;
        } catch (err) {
            console.log(`Could not look up the portrait for '${character.name}': ${err.message}`);
        }

        if (!url) {
            missing.push(character);
            continue;
        }

        const folder = character.role === "survivor" ? "Survivors" : "Killers";
        const target = `${folder}/${character.id}.png`;
        if (!persist) {
            downloaded.push({ ...character, target });
            continue;
        }
        try {
            fs.mkdirSync(path.join(CHARACTERS_DIR, folder), { recursive: true });
            fs.writeFileSync(path.join(CHARACTERS_DIR, target), await normalizePortrait(await get(url, true)));
            characterIcons[character.id] = target;
            downloaded.push({ ...character, target });
        } catch (err) {
            console.log(`Could not download the portrait for '${character.name}': ${err.message}`);
            missing.push(character);
        }
    }

    if (persist && downloaded.length) {
        try {
            const sorted = Object.fromEntries(Object.keys(characterIcons).sort().map((k) => [k, characterIcons[k]]));
            fs.writeFileSync(CHARACTER_ICONS_FILE, JSON.stringify(sorted, null, 2) + "\n");
            characterIcons = sorted;
        } catch (err) {
            console.log(`Could not write the character icon map: ${err.message}`);
        }
    }

    return { downloaded: downloaded, missing: missing, broken: broken };
}

module.exports = {
    sync: sync,
    syncCharacters: syncCharacters,
    getIcons: getIcons,
    getCharacterIcons: getCharacterIcons,
    loadIcons: loadIcons,
    loadCharacterIcons: loadCharacterIcons
}
