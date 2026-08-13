const dataService = require("./dataService.js");

/**
 * @description Perk lookups. The data itself lives in dataService, which keeps it in sync
 *              with the API; this module only exposes it in the shape the commands expect.
 */

/**
 * @param {String} id - Perk id from the API or from the shrine payload.
 * @description Get a perk (undefined if it does not exist).
 */
function getPerkById(id) {
    return dataService.getPerkById(id);
}

function getKillerPerks() {
    return dataService.getKillerPerks();
}

function getSurvivorPerks() {
    return dataService.getSurvivorPerks();
}

function getSurvivorPerkByIndex(index) {
    return dataService.getSurvivorPerks()[index];
}

function getKillerPerkByIndex(index) {
    return dataService.getKillerPerks()[index];
}

module.exports = {
    getPerkById: getPerkById,
    getKillerPerks: getKillerPerks,
    getSurvivorPerks: getSurvivorPerks,
    getSurvivorPerkByIndex: getSurvivorPerkByIndex,
    getKillerPerkByIndex: getKillerPerkByIndex,
}
