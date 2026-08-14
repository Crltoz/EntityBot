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
 * @param {String} role - "survivor" or "killer".
 * @param {Number} language - 0 = Spanish, 1 = English.
 * @description Build the markup for one role, the full seven cards.
 */
async function build(steamProfile, dbdProfile, role, language) {
    const isSurv = role === "survivor";
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

// The headline numbers of each role, for the card that shows both at once. Four apiece: the
// core actions the role is actually judged on, and enough to keep the two sections the same
// height so neither reads as the afterthought.
const HEADLINE_FIELDS = {
    survivor: [
        { key: "gensrepaired", label: "gensRepaired", icon: "gen.png" },
        { key: "saved", label: "saved", icon: "coop.png" },
        { key: "survivorshealed", label: "survivorsHealed", icon: "medkit.png" },
        { key: "escaped", label: "escaped", icon: "hatch.png" }
    ],
    killer: [
        { key: "killed", label: "kills", icon: "killer.png" },
        { key: "sacrificed", label: "sacrificed", icon: "hook.png" },
        { key: "killer_perfectgames", label: "perfectGames", icon: "killer_perfect.png" },
        { key: "hatchesclosed", label: "hatchesClosed", icon: "hatch.png" }
    ]
};

const COMBINED_HEIGHT = 626;
// Four across the content width, against three on the single-role card.
const WIDE_CARD_WIDTH = 264;

function wideCard(title, value, icon) {
    return `
      <div style="display:flex;flex-direction:column;justify-content:space-between;
                  width:${WIDE_CARD_WIDTH}px;height:100px;background-image:${PALETTE.card};
                  border:1px solid ${PALETTE.border};border-radius:10px;
                  padding:14px 16px;margin:0 12px 0 0;">
        <div style="display:flex;color:${PALETTE.label};font-size:16px;">${render.escape(title)}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;color:${PALETTE.value};font-size:28px;font-weight:600;">${render.escape(value)}</div>
          ${icon ? `<img src="${icon}" style="width:32px;height:32px;" />` : ""}
        </div>
      </div>`;
}

/**
 * @param steamProfile - Steam player summary.
 * @param dbdProfile - Player stats payload.
 * @param {Number} language - 0 = Spanish, 1 = English.
 * @description Both roles on one card, which is what /stats answers with when no role is given.
 *              The two are kept in labelled sections rather than mixed, because a survivor
 *              number and a killer number sitting side by side mean nothing together.
 */
async function buildCombined(steamProfile, dbdProfile, language) {
    const roles = ["survivor", "killer"];

    const [avatar, bpIcon, survivorIcon, killerIcon] = await Promise.all([
        render.remoteAsset(steamProfile.avatarfull, 84, 84),
        render.asset(ICONS + "bp.png", 30, 30),
        render.asset(ICONS + "survivor_rank.png", 34, 34),
        render.asset(ICONS + "killer_rank.png", 34, 34)
    ]);

    const icons = {};
    for (const role of roles) {
        icons[role] = await Promise.all(HEADLINE_FIELDS[role].map((field) => render.asset(ICONS + field.icon, 32, 32)));
    }

    const minutes = Number(dbdProfile.playtime);
    const hours = Number.isFinite(minutes) && minutes > 0 ? utils.comma(Math.floor(minutes / 60)) : "—";

    const section = (role) => {
        const roleIcon = role === "survivor" ? survivorIcon : killerIcon;
        const roleName = role === "survivor" ? texts.stats.roleSurvivor[language] : texts.stats.roleKiller[language];
        const cards = HEADLINE_FIELDS[role]
            .map((field, index) => wideCard(label(field.label, language), utils.comma(dbdProfile[field.key] || 0), icons[role][index]))
            .join("");

        return `
      <div style="display:flex;flex-direction:column;margin-top:18px;">
        <div style="display:flex;align-items:center;margin-bottom:10px;">
          ${roleIcon ? `<img src="${roleIcon}" style="width:34px;height:34px;margin-right:12px;" />` : ""}
          <div style="display:flex;color:${PALETTE.value};font-size:24px;font-weight:600;">${render.escape(roleName)}</div>
        </div>
        <div style="display:flex;">${cards}</div>
      </div>`;
    };

    return `
<div style="display:flex;flex-direction:column;width:${WIDTH}px;height:${COMBINED_HEIGHT}px;
            background:${PALETTE.background};font-family:${BODY_FONT};padding:30px 32px;">

  <div style="display:flex;align-items:center;margin-bottom:18px;">
    <div style="display:flex;font-family:${DISPLAY_FONT};color:${PALETTE.value};font-size:48px;">${render.escape(texts.stats.statistics[language])}</div>
  </div>

  <div style="display:flex;align-items:center;background-image:${PALETTE.card};
              border:1px solid ${PALETTE.border};border-radius:10px;padding:18px 20px;">
    ${avatar ? `<img src="${avatar}" style="width:84px;height:84px;border-radius:8px;margin-right:18px;" />` : ""}
    <div style="display:flex;flex-direction:column;width:250px;">
      <div style="display:flex;color:${PALETTE.role};font-size:26px;font-weight:600;">${render.escape(displayName(steamProfile.personaname, steamProfile.steamid))}</div>
      <div style="display:flex;color:${PALETTE.muted};font-size:15px;margin-top:4px;">${render.escape(steamProfile.steamid)}</div>
    </div>
    <div style="display:flex;flex-direction:column;margin-left:auto;margin-right:48px;">
      <div style="display:flex;color:${PALETTE.label};font-size:16px;">${render.escape(label("hoursPlayed", language))}</div>
      <div style="display:flex;color:${PALETTE.value};font-size:30px;font-weight:600;">${hours}</div>
    </div>
    <div style="display:flex;flex-direction:column;">
      <div style="display:flex;align-items:center;">
        ${bpIcon ? `<img src="${bpIcon}" style="width:20px;height:20px;margin-right:8px;" />` : ""}
        <div style="display:flex;color:${PALETTE.label};font-size:16px;">Bloodpoints</div>
      </div>
      <div style="display:flex;color:${PALETTE.accent};font-size:30px;font-weight:600;">${utils.comma(dbdProfile.bloodpoints || 0)}</div>
    </div>
  </div>

  ${roles.map(section).join("")}

  <div style="display:flex;margin-top:auto;color:${PALETTE.muted};font-size:15px;">
    dbd.tricky.lol/playerstats/${render.escape(steamProfile.steamid)}
  </div>
</div>`;
}

/**
 * @param {String} role - "survivor", "killer", or null.
 * @description Pick the layout: a role gives its seven cards, no role gives the combined card
 *              with the headline numbers of both, which is what /stats renders with no arguments.
 */
function layoutFor(role) {
    if (role === "survivor" || role === "killer") {
        return {
            width: WIDTH,
            height: HEIGHT,
            build: (steamProfile, dbdProfile, language) => build(steamProfile, dbdProfile, role, language)
        };
    }
    return { width: WIDTH, height: COMBINED_HEIGHT, build: buildCombined };
}

module.exports = {
    build: build,
    buildCombined: buildCombined,
    layoutFor: layoutFor,
    WIDTH: WIDTH,
    HEIGHT: HEIGHT,
    COMBINED_HEIGHT: COMBINED_HEIGHT
}
