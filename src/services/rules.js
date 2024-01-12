const fs = require("fs");

let rulesEng = [];
let rulesEsp = [];

function init() {
    fs.readFile('assets/rules/en.json', 'utf8', function (err, data) {
        if (err) return console.log(err);
        const msg = JSON.parse(data);
        rulesEng = msg.rules;
    });
    fs.readFile('assets/rules/es.json', 'utf8', function (err, data) {
        if (err) return console.log(err);
        const msg = JSON.parse(data);
        rulesEsp = msg.rules;
    });
}

function getRule(number, language) {
    switch (language) {
        case 0: {
            if (number >= rulesEng.length) return rulesEsp[rulesEsp.length - 1];
            return rulesEsp[number];
        }
        case 1: {
            if (number >= rulesEng.length) return rulesEng[rulesEng.length - 1];
            return rulesEng[number];
        }
    }
}

async function getRandomRule(context, interaction) {
    const randomNum = Math.floor(Math.random() * rulesEsp.length + 1);
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
    const rule = getRule(randomNum, serverConfig.language);
    interaction.reply({
        content: `> ${rule}`, files: [{
            attachment: 'https://i.imgur.com/I4LhmO8.png',
            name: 'Survivor_rule_book_for_killers.jpg'
        }]
    });
}

module.exports = {
    init: init,
    getRule: getRule,
    getRandomRule: getRandomRule
}