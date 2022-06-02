const Discord = require("discord.js");
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
});

// services
const { deployCommands } = require("../services/deploycommands.js");
const database = require("../services/database.js"); 
const stats = require("../services/stats.js");
const perks = require("../services/perks.js");
const servers = require("../services/servers.js");
const characters = require("../services/characters.js");
const rules = require("../services/rules.js");

// config
const config = require("../data/config.json");

class Context {
    constructor() {
        this.client = client;
        this.discord = Discord;
        this.config = config;
        this.services = {};
        this.services.deployCommands = deployCommands;
        this.services.database = database;
        this.services.stats = stats;
        this.services.perks = perks;
        this.services.servers = servers;
        this.services.characters = characters;
        this.services.rules = rules;
    }
}

module.exports = Context;