const dataService = require("./dataService.js");

/**
 * @description Character lookups. Backed by dataService, which keeps the roster in sync
 *              with the API; this module only exposes it in the shape the commands expect.
 */

function getKillers() {
    return dataService.getKillers();
}

function getSurvivors() {
    return dataService.getSurvivors();
}

module.exports = {
    getKillers: getKillers,
    getSurvivors: getSurvivors
}
