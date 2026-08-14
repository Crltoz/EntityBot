const fs = require("fs");
const path = require("path");
const Canvas = require("canvas");
const satori = require("satori").default;
const { html } = require("satori-html");
const { Resvg } = require("@resvg/resvg-js");
const http = require("./http.js");

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

const FONT_PATH = path.join(__dirname, "../../assets/Font/BRUTTALL.ttf");
const FONT_NAME = "dbd";
const font = fs.readFileSync(FONT_PATH);

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
    const svg = await satori(html(markup), {
        width: width,
        height: height,
        // Without this satori traces every glyph into an SVG <path>. BRUTTALL is a 1MB
        // decorative face, so a single line of text produced a 1.3MB SVG and ten renders held
        // on to ~280MB of native memory that no GC gave back — fatal in a 1GiB container.
        // Emitting <text> and handing resvg the same TTF renders identically at 1KB and ~114MB.
        embedFont: false,
        fonts: [{ name: FONT_NAME, data: font, weight: 400, style: "normal" }]
    });

    return new Resvg(svg, {
        fitTo: { mode: "width", value: width },
        font: {
            fontFiles: [FONT_PATH],
            defaultFontFamily: FONT_NAME,
            // The container has no fonts installed and scanning for them costs a second.
            loadSystemFonts: false
        }
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
