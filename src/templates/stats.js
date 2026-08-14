const texts = require("../data/texts.json");
const utils = require("../utils/utils.js");
const render = require("../services/render.js");
const theme = require("./theme.js");

/**
 * @description The /stats card, as HTML.
 *
 * Kept apart from the service that draws it so the layout can be changed without touching the
 * data path, which is the whole point of moving off hand-placed canvas coordinates.
 */

// Three rows of cards at 116px each, plus the header and the footer line. Sized to the content
// so the card has no dead space under it in the Discord preview.
const WIDTH = 1180;
const HEIGHT = 532;
const ICONS = "./assets/Visuals/icons/";

// Shared with the canvas commands through theme.js, so the two cannot drift apart.
const PALETTE = {
    ...theme.COLORS,
    card: theme.cssGradient(theme.CARD_STOPS, 145),
    cardStrong: theme.cssGradient(theme.CARD_STRONG_STOPS, 145)
};

// BRUTTALL is the game's face: great for a title, unreadable for a seven-digit number.
const DISPLAY_FONT = "Bruttall";
const BODY_FONT = "Inter";

// The nine numbers each role has always shown, now with an icon and a shorter label. The
// labels come from texts.json with their trailing ": " dropped, so the two stay in sync.
const FIELDS = {
    killer: [
        { key: "killed", label: "kills", icon: "killer.png" },
        { key: "sacrificed", label: "sacrificed", icon: "hook.png" },
        { key: "sacrificed_obsessions", label: "sacrificedObessions", icon: "entity.png" },
        { key: "killer_perfectgames", label: "perfectGames", icon: "killer_perfect.png" },
        { key: "hatchesclosed", label: "hatchesClosed", icon: "hatch.png" },
        { key: "gensdamagedwhileonehooked", label: "gensDamaged", icon: "genbreak.png" },
        { key: "survivorsgrabbedrepairinggen", label: "survivorsGrabbed", icon: "carry.png" }
    ],
    survivor: [
        { key: "survivor_perfectgames", label: "perfectGames", icon: "perfect.png" },
        { key: "gensrepaired", label: "gensRepaired", icon: "gen.png" },
        { key: "survivorshealed", label: "survivorsHealed", icon: "medkit.png" },
        { key: "skillchecks", label: "skillchecks", icon: "skillcheck.png" },
        { key: "escaped", label: "escaped", icon: "hatch.png" },
        { key: "saved", label: "saved", icon: "coop.png" },
        { key: "exitgatesopened", label: "exitGatesOpened", icon: "survivor.png" }
    ]
};

/**
 * @param {String} key - texts.stats key.
 * @param {Number} language - 0 = Spanish, 1 = English.
 * @description The shared label without its trailing colon, which the canvas needed and a
 *              card does not.
 */
function label(key, language) {
    return String(texts.stats[key][language]).replace(/\s*:\s*$/, "");
}

// What Inter actually covers: Latin, its supplements and extensions, Greek, Cyrillic and
// common punctuation. Bundling a CJK face to widen this would cost more than the whole render
// stack, so anything outside is dropped.
const SUPPORTED_CHARACTERS = /[^ -ɏͰ-ӿ‐-‧‰-⁞₠-₿]/g;
const NAME_MAX_LENGTH = 14;

/**
 * @param {String} name - Steam persona, which is arbitrary user input.
 * @param {String} steamId - Fallback when nothing renderable is left.
 * @description Steam names carry CJK, emoji and decorative symbols that no bundled font has;
 *              left alone they render as tofu boxes and wrap the panel. Drop what cannot be
 *              drawn and cap the length so the name stays on one line.
 */
function displayName(name, steamId) {
    const cleaned = String(name || "").replace(SUPPORTED_CHARACTERS, "").replace(/\s+/g, " ").trim();
    if (!cleaned) return steamId;
    return cleaned.length > NAME_MAX_LENGTH ? `${cleaned.slice(0, NAME_MAX_LENGTH - 1)}…` : cleaned;
}

function card(title, value, icon) {
    return `
      <div style="display:flex;flex-direction:column;justify-content:space-between;
                  width:248px;height:104px;background-image:${PALETTE.card};
                  border:1px solid ${PALETTE.border};border-radius:10px;
                  padding:14px 16px;margin:0 12px 12px 0;">
        <div style="display:flex;color:${PALETTE.label};font-size:16px;">${render.escape(title)}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;color:${PALETTE.value};font-size:30px;font-weight:600;">${render.escape(value)}</div>
          ${icon ? `<img src="${icon}" style="width:34px;height:34px;" />` : ""}
        </div>
      </div>`;
}

/**
 * @param steamProfile - Steam player summary.
 * @param dbdProfile - Player stats payload.
 * @param {Boolean} isSurv - true = survivor | false = killer
 * @param {Number} language - 0 = Spanish, 1 = English.
 * @description Build the markup and everything it embeds.
 */
async function build(steamProfile, dbdProfile, isSurv, language) {
    const role = isSurv ? "survivor" : "killer";
    const fields = FIELDS[role];

    const [avatar, roleIcon, bpIcon, ...icons] = await Promise.all([
        // Scaled to the size it is displayed at, not larger: satori's cost tracks source pixels.
        render.remoteAsset(steamProfile.avatarfull, 104, 104),
        render.asset(ICONS + (isSurv ? "survivor_rank.png" : "killer_rank.png"), 40, 40),
        render.asset(ICONS + "bp.png", 34, 34),
        ...fields.map((field) => render.asset(ICONS + field.icon, 34, 34))
    ]);

    // playtime is total minutes played, and the API often does not have it at all — it comes
    // from Steam, which withholds it when the account's game details are not public. Rendering
    // that as "0" claimed the player had never played; an em dash says we do not know.
    const minutes = Number(dbdProfile.playtime);
    const hours = Number.isFinite(minutes) && minutes > 0 ? utils.comma(Math.floor(minutes / 60)) : "—";
    const roleName = isSurv ? texts.stats.roleSurvivor[language] : texts.stats.roleKiller[language];

    const cards = fields
        .map((field, index) => card(label(field.label, language), utils.comma(dbdProfile[field.key] || 0), icons[index]))
        .join("");

    return `
<div style="display:flex;flex-direction:column;width:${WIDTH}px;height:${HEIGHT}px;
            background:${PALETTE.background};font-family:${BODY_FONT};padding:30px 32px;">

  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
    <div style="display:flex;align-items:center;">
      ${roleIcon ? `<img src="${roleIcon}" style="width:40px;height:40px;margin-right:14px;" />` : ""}
      <div style="display:flex;font-family:${DISPLAY_FONT};color:${PALETTE.value};font-size:48px;">${render.escape(texts.stats.statistics[language])}</div>
    </div>
    <div style="display:flex;align-items:center;background-image:${PALETTE.cardStrong};
                border:1px solid ${PALETTE.accent};color:${PALETTE.accent};
                font-size:30px;font-weight:600;padding:10px 26px;border-radius:26px;">${render.escape(roleName)}</div>
  </div>

  <div style="display:flex;">
    <div style="display:flex;flex-direction:column;width:300px;height:336px;background-image:${PALETTE.card};
                border:1px solid ${PALETTE.border};border-radius:10px;padding:20px;margin-right:12px;">
      <div style="display:flex;align-items:center;">
        ${avatar ? `<img src="${avatar}" style="width:104px;height:104px;border-radius:8px;" />` : ""}
        <div style="display:flex;flex-direction:column;margin-left:16px;width:144px;">
          <div style="display:flex;color:${PALETTE.role};font-size:24px;font-weight:600;">${render.escape(displayName(steamProfile.personaname, steamProfile.steamid))}</div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;margin-top:22px;">
        <div style="display:flex;color:${PALETTE.label};font-size:16px;">${render.escape(label("hoursPlayed", language))}</div>
        <div style="display:flex;color:${PALETTE.value};font-size:32px;font-weight:600;">${hours}</div>
      </div>

      <div style="display:flex;flex-direction:column;margin-top:18px;">
        <div style="display:flex;align-items:center;">
          ${bpIcon ? `<img src="${bpIcon}" style="width:22px;height:22px;margin-right:8px;" />` : ""}
          <div style="display:flex;color:${PALETTE.label};font-size:16px;">Bloodpoints</div>
        </div>
        <!-- The icon sits by the label, not beside the number: a lifetime bloodpoint total runs
             to ten digits and the two collided at the edge of the panel. -->
        <div style="display:flex;color:${PALETTE.accent};font-size:30px;font-weight:600;">${utils.comma(dbdProfile.bloodpoints || 0)}</div>
      </div>
    </div>

    <div style="display:flex;flex-wrap:wrap;width:808px;">${cards}</div>
  </div>

  <div style="display:flex;margin-top:auto;color:${PALETTE.muted};font-size:15px;">
    dbd.tricky.lol/playerstats/${render.escape(steamProfile.steamid)}
  </div>
</div>`;
}

module.exports = {
    build: build,
    WIDTH: WIDTH,
    HEIGHT: HEIGHT
}
