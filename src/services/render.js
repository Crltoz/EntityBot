const fs = require("fs");
const path = require("path");
const Canvas = require("canvas");
const satori = require("satori").default;
const { Resvg } = require("@resvg/resvg-js");
const http = require("./http.js");

// satori-html ships ESM only, and require() of an ES module is a hard error before Node
// 22.12 — which is exactly the runtime the image pins, so a plain require works on a dev
// machine and takes the bot down on deploy. Importing it lazily keeps this file CommonJS
// and works on every version. The promise is cached, not awaited at load, so concurrent
// renders share the single import.
let satoriHtml;
function loadHtml() {
    if (!satoriHtml) satoriHtml = import("satori-html").then((mod) => mod.html);
    return satoriHtml;
}

/**
 * @description Turns HTML + CSS into a PNG, without a browser.
 *
 * satori lays the markup out with a real flexbox engine and emits an SVG, which resvg
 * rasterises. That buys proper layout instead of the hand-placed fillText coordinates the
 * canvas commands use, at roughly 700ms and ~140MB — a headless Chromium would not fit in the
 * 0.5 vCPU / 1 GiB the bot runs on.
 *
 * Two things matter for it to stay that cheap:
 *
 * 1. Images must be scaled to the size they are displayed at *before* being embedded. satori's
 *    cost scales with the source pixels, not the rendered ones: the same layout took 35s and
 *    1.26GB with full-size portraits and 220ms with thumbnails. node-canvas does the resizing.
 * 2. The font is embedded here rather than installed in the image, which also sidesteps the
 *    fontconfig fallback that silently turns "dbd" into Sans.
 */

/**
 * The display face is BRUTTALL, the game's own, but it is decorative and hard to read at the
 * sizes a number needs, so it is reserved for titles and Inter carries the body text.
 *
 * The families are embedded as outlines (satori's default) rather than resolved by resvg,
 * because BRUTTALL has no `name` table at all — resvg indexes fonts by their internal family
 * name and simply cannot see it, silently substituting whatever else is loaded. With BRUTTALL
 * limited to a title, the outline tracing that was too expensive when it set the whole card is
 * cheap again; Inter's outlines are ordinary.
 */
const FONTS = [
    { name: "Bruttall", file: "BRUTTALL.ttf", weight: 400 },
    { name: "Inter", file: "Inter-Regular.ttf", weight: 400 },
    { name: "Inter", file: "Inter-SemiBold.ttf", weight: 600 }
].map((entry) => ({
    name: entry.name,
    weight: entry.weight,
    style: "normal",
    data: fs.readFileSync(path.join(__dirname, "../../assets/Font", entry.file))
}));

// Local assets never change, so their scaled copies are worth keeping. Remote avatars are not
// cached: they are per-player and would grow without bound.
const thumbnails = new Map();

/**
 * @param {Buffer} buffer - Encoded image.
 * @param {Number} width - Display width in pixels.
 * @param {Number} height - Display height in pixels.
 * @description Scale an image to its display size and return it as a data URI.
 */
async function scaleToDataUri(buffer, width, height) {
    const image = await Canvas.loadImage(buffer);
    const canvas = Canvas.createCanvas(width, height);
    canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    return canvas.toDataURL('image/png');
}

/**
 * @param {String} assetPath - Path of a bundled asset.
 * @param {Number} width - Display width in pixels.
 * @param {Number} height - Display height in pixels.
 * @description Data URI for a bundled image, scaled and memoised.
 *              Returns null when the asset is missing, so a template can leave the slot empty
 *              instead of failing the whole render.
 */
async function asset(assetPath, width, height) {
    const key = `${assetPath}:${width}x${height}`;
    if (thumbnails.has(key)) return thumbnails.get(key);

    try {
        // Read into a Buffer first: node-canvas cannot open non-ASCII paths on Windows.
        const uri = await scaleToDataUri(fs.readFileSync(assetPath), width, height);
        thumbnails.set(key, uri);
        return uri;
    } catch (err) {
        console.log(`Could not prepare '${assetPath}' for rendering: ${err.message}`);
        return null;
    }
}

/**
 * @param {String} url - Remote image, i.e. a Steam avatar.
 * @param {Number} width - Display width in pixels.
 * @param {Number} height - Display height in pixels.
 * @description Data URI for a remote image. Null on any failure — a missing avatar must not
 *              cost the user their stats.
 */
async function remoteAsset(url, width, height) {
    if (!url) return null;
    try {
        return await scaleToDataUri(await http.getBuffer(url, { timeout: 8000 }), width, height);
    } catch (err) {
        console.log(`Could not fetch '${url}' for rendering: ${err.message}`);
        return null;
    }
}

/**
 * @param {String} markup - HTML string. satori supports a subset of CSS: flexbox yes, grid and
 *                          float no, and most elements need explicit dimensions.
 * @param {Number} width - Output width in pixels.
 * @param {Number} height - Output height in pixels.
 * @description Render markup to a PNG buffer.
 */
async function toPng(markup, width, height) {
    const html = await loadHtml();
    const svg = await satori(html(markup), {
        width: width,
        height: height,
        fonts: FONTS
    });

    return new Resvg(svg, {
        fitTo: { mode: "width", value: width },
        // Everything is already an outline, so resvg needs no fonts. Scanning the system for
        // them costs about a second on a cold container that has none installed anyway.
        font: { loadSystemFonts: false }
    }).render().asPng();
}

/**
 * @param {String} value - Text going into the markup.
 * @description Escape it. Steam personas are user-controlled and contain angle brackets and
 *              ampersands often enough that an unescaped one would break the parse.
 */
function escape(value) {
    return String(value === null || value === undefined ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

module.exports = {
    asset: asset,
    remoteAsset: remoteAsset,
    toPng: toPng,
    escape: escape
}
