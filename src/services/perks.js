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
      survivorPerks[msg.perks[x].id.toLowerCase()] = {
        nameEs: msg.perks[x].nameEs,
        nameEn: msg.perks[x].nameEn,
        link: msg.perks[x].link,
        index: x,
        isSurv: true,
      }
    }
  });
  fs.readFile('assets/perks/killer.json', 'utf8', function (err, data) {
    if (err) return console.log(err);
    const msg = JSON.parse(data);
    for (let x = 0; x < msg.perks.length; x++) {
      killerPerks[msg.perks[x].id.toLowerCase()] = {
        nameEs: msg.perks[x].nameEs,
        nameEn: msg.perks[x].nameEn,
        link: msg.perks[x].link,
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
  const perk = survivorPerks[id.toLowerCase()] || killerPerks[id.toLowerCase()];
  console.log(`Getting perk by id '${id}' -> ${perk}`);
  return perk;
}

function getKillerPerks() {
  return killerPerks;
}

function getSurvivorPerks() {
  return survivorPerks;
}

function getSurvivorPerkByIndex(index) {
  return Object.values(survivorPerks).find(p => p.index == index);
}

function getKillerPerkByIndex(index) {
  return Object.values(killerPerks).find(p => p.index == index);
}

module.exports = {
  init: init,
  getPerkById: getPerkById,
  getKillerPerks: getKillerPerks,
  getSurvivorPerks: getSurvivorPerks,
  getSurvivorPerkByIndex: getSurvivorPerkByIndex,
  getKillerPerkByIndex: getKillerPerkByIndex,
}