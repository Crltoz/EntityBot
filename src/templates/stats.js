const texts = require("../data/texts.json");
const utils = require("../utils/utils.js");
const render = require("../services/render.js");

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

const PALETTE = {
    background: "#0E0E10",
    card: "#17171B",
    border: "#26262C",
    label: "#9A9AA4",
    value: "#FFFFFF",
    accent: "#C9A227",
    role: "#E52121",
    muted: "#5A5A60"
};

// The nine numbers each role has always shown, now with an icon and a shorter label. The
// labels come from texts.json with their trailing ": " dropped, so the two stay in sync.
const FIELDS = {
    killer: [
        { key: "killed", label: "kills", icon: "killer.png" },
        { key: "sacrificed", label: "sacrificed", icon: "hook.png" },
        { key: "sacrificed_obsessions", label: "sacrificedObessions", icon: "entity.png" },
        { key: "killer_perfectgames", label: "perfectGames", icon: "killer_perfect.png" },
        { key: "killer_fullloadout", label: "killerFullLoadout", icon: "palet.png" },
        { key: "gensdamagedwhileonehooked", label: "gensDamaged", icon: "genbreak.png" },
        { key: "survivorsgrabbedrepairinggen", label: "survivorsGrabbed", icon: "carry.png" }
    ],
    survivor: [
        { key: "survivor_perfectgames", label: "perfectGames", icon: "perfect.png" },
        { key: "gensrepaired", label: "gensRepaired", icon: "gen.png" },
        { key: "survivorshealed", label: "survivorsHealed", icon: "medkit.png" },
        { key: "skillchecks", label: "skillchecks", icon: "skillcheck.png" },
        { key: "escaped", label: "escaped", icon: "hatch.png" },
        { key: "hextotemscleansed", label: "hexTotemsCleansed", icon: "totem.png" },
        { key: "exitgatesopened", label: "exitGatesOpened", icon: "coop.png" }
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

function card(title, value, icon) {
    return `
      <div style="display:flex;flex-direction:column;justify-content:space-between;
                  width:248px;height:104px;background:${PALETTE.card};
                  border:1px solid ${PALETTE.border};border-radius:10px;
                  padding:14px 16px;margin:0 12px 12px 0;">
        <div style="display:flex;color:${PALETTE.label};font-size:19px;">${render.escape(title)}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;color:${PALETTE.value};font-size:32px;">${render.escape(value)}</div>
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

    const hours = utils.comma(parseInt(dbdProfile.playtime / 60, 10) || 0);
    const roleName = isSurv ? texts.stats.roleSurvivor[language] : texts.stats.roleKiller[language];

    const cards = fields
        .map((field, index) => card(label(field.label, language), utils.comma(dbdProfile[field.key] || 0), icons[index]))
        .join("");

    return `
<div style="display:flex;flex-direction:column;width:${WIDTH}px;height:${HEIGHT}px;
            background:${PALETTE.background};font-family:dbd;padding:30px 32px;">

  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
    <div style="display:flex;align-items:center;">
      ${roleIcon ? `<img src="${roleIcon}" style="width:40px;height:40px;margin-right:14px;" />` : ""}
      <div style="display:flex;color:${PALETTE.value};font-size:46px;">${render.escape(texts.stats.statistics[language])}</div>
    </div>
    <div style="display:flex;background:#1E1E24;color:${PALETTE.accent};font-size:20px;
                padding:8px 18px;border-radius:20px;">${render.escape(roleName)}</div>
  </div>

  <div style="display:flex;">
    <div style="display:flex;flex-direction:column;width:300px;height:336px;background:${PALETTE.card};
                border:1px solid ${PALETTE.border};border-radius:10px;padding:20px;margin-right:12px;">
      <div style="display:flex;align-items:center;">
        ${avatar ? `<img src="${avatar}" style="width:104px;height:104px;border-radius:8px;" />` : ""}
        <div style="display:flex;flex-direction:column;margin-left:16px;width:144px;">
          <div style="display:flex;color:${PALETTE.role};font-size:26px;">${render.escape(steamProfile.personaname)}</div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;margin-top:22px;">
        <div style="display:flex;color:${PALETTE.label};font-size:19px;">${render.escape(label("hoursPlayed", language))}</div>
        <div style="display:flex;color:${PALETTE.value};font-size:34px;">${hours}</div>
      </div>

      <div style="display:flex;flex-direction:column;margin-top:18px;">
        <div style="display:flex;color:${PALETTE.label};font-size:19px;">Bloodpoints</div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;color:${PALETTE.accent};font-size:34px;">${utils.comma(dbdProfile.bloodpoints || 0)}</div>
          ${bpIcon ? `<img src="${bpIcon}" style="width:34px;height:34px;" />` : ""}
        </div>
      </div>
    </div>

    <div style="display:flex;flex-wrap:wrap;width:808px;">${cards}</div>
  </div>

  <div style="display:flex;margin-top:auto;color:${PALETTE.muted};font-size:18px;">
    dbd.tricky.lol/playerstats/${render.escape(steamProfile.steamid)}
  </div>
</div>`;
}

module.exports = {
    build: build,
    WIDTH: WIDTH,
    HEIGHT: HEIGHT
}
