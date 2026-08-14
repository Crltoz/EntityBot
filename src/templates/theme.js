/**
 * @description The one place the card colours live.
 *
 * Two renderers draw them: satori, from CSS strings, and node-canvas, from gradient stops.
 * Keeping the values here is what stops /stats and /adepts drifting apart every time one of
 * them is touched.
 *
 * Font family names are deliberately not here. The two renderers name the same file
 * differently — satori matches on the name it is handed, node-canvas on the family registered
 * with it — so each side declares its own.
 */

const COLORS = {
    background: "#0E0E10",
    border: "#2E2E38",
    label: "#9A9AA4",
    value: "#FFFFFF",
    accent: "#C9A227",
    role: "#E52121",
    muted: "#5A5A60",
    // What a portrait with no adept fades to.
    disabled: "#5A5A60",
    disabledBorder: "#26262C"
};

// Lit from the top-left, so a row of cards reads as raised panels.
const CARD_STOPS = [[0, "#22222A"], [0.45, "#191920"], [1, "#131318"]];
const CARD_STRONG_STOPS = [[0, "#2A2A34"], [0.45, "#1D1D25"], [1, "#15151B"]];

/**
 * @param {Array} stops - [offset, colour] pairs.
 * @param {Number} angle - CSS gradient angle in degrees.
 * @description The stops as a CSS linear-gradient, for the satori templates.
 */
function cssGradient(stops, angle) {
    const parts = stops.map(([offset, color]) => `${color} ${Math.round(offset * 100)}%`);
    return `linear-gradient(${angle}deg, ${parts.join(", ")})`;
}

/**
 * @param ctx - Canvas 2D context.
 * @param {Array} stops - [offset, colour] pairs.
 * @param {Number} x - Left edge.
 * @param {Number} y - Top edge.
 * @param {Number} width - Box width.
 * @param {Number} height - Box height.
 * @description The same stops as a canvas gradient across the box's diagonal, which is the
 *              closest match to the 145deg the CSS side uses.
 */
function canvasGradient(ctx, stops, x, y, width, height) {
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    for (const [offset, color] of stops) gradient.addColorStop(offset, color);
    return gradient;
}

module.exports = {
    COLORS: COLORS,
    CARD_STOPS: CARD_STOPS,
    CARD_STRONG_STOPS: CARD_STRONG_STOPS,
    cssGradient: cssGradient,
    canvasGradient: canvasGradient
}
