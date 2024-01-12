const fs = require("fs");

let survivors = {};
let killers = {};

/**
 * @description Load characters info.
 */
function init() {
    fs.readFile('assets/characters/survivors.json', 'utf8', function (err, data) {
        if (err) return console.log(err);
        const msg = JSON.parse(data);
        for (let x = 0; x < msg.survivors.length; x++) {
            survivors[x] = {
                name: msg.survivors[x].name,
                link: msg.survivors[x].link
            }
        }
    });
    fs.readFile('assets/characters/killers.json', 'utf8', function (err, data) {
        if (err) return console.log(err);
        const msg = JSON.parse(data);
        for (let x = 0; x < msg.killers.length; x++) {
            killers[x] = {
                nameEs: msg.killers[x].nameEs,
                nameEn: msg.killers[x].nameEn,
                link: msg.killers[x].link
            }
        }
    });
}

function getKillers() {
    return killers;
}

function getSurvivors() {
    return survivors;
}

module.exports = {
    init: init,
    getKillers: getKillers,
    getSurvivors: getSurvivors
}