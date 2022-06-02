const fs = require("fs");
const utils = require("../utils/utils.js");

let survivorPerks = {};
let killerPerks = {};

/**
 * @description Load perks info.
 */
function init() {
  fs.readFile('assets/perks/survivor.json', 'utf8', function (err, data) {
    if (err) return console.log(err);
    const msg = JSON.parse(data);
    for (let x = 0; x < msg.perks.length; x++) {
      survivorPerks[x] = {
        nameEs: msg.perks[x].nameEs,
        nameEn: msg.perks[x].nameEn,
        link: msg.perks[x].link,
        id: msg.perks[x].id,
        index: x,
        isSurv: true,
      }
    }
  });
  fs.readFile('assets/perks/killer.json', 'utf8', function (err, data) {
    if (err) return console.log(err);
    const msg = JSON.parse(data);
    for (let x = 0; x < msg.perks.length; x++) {
      killerPerks[x] = {
        nameEs: msg.perks[x].nameEs,
        nameEn: msg.perks[x].nameEn,
        link: msg.perks[x].link,
        id: msg.perks[x].id,
        index: x,
        isSurv: false
      };
    }
    console.log(`Perks loaded.`);
  });
}

/**
 * @param {String} id - Perk ID from Australian Site.
 * @description Get perk (undefined if not find)
 */
function getPerkById(id) {
  let perk;
  for (let x = 0; x < utils.getLength(survivorPerks); x++) {
    if (id == survivorPerks[x].id) {
      perk = survivorPerks[x];
      break;
    }
  }

  if (!perk) {
    for (let x = 0; x < utils.getLength(killerPerks); x++) {
      if (id == killerPerks[x].id) {
        perk = killerPerks[x];
        break;
      }
    }
  }
  return perk;
}

function getKillerPerks() {
  return killerPerks;
}

function getSurvivorPerks() {
  return survivorPerks;
}

module.exports = {
  init: init,
  getPerkById: getPerkById,
  getKillerPerks: getKillerPerks,
  getSurvivorPerks: getSurvivorPerks
}