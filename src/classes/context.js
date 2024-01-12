const Discord = require("discord.js");
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

// services
const interactions = require("../services/interactions.js");
const stats = require("../services/stats.js");
const perks = require("../services/perks.js");
const servers = require("../services/servers.js");
const characters = require("../services/characters.js");
const rules = require("../services/rules.js");
const database = require("../services/database.js");

// config
const config = require("../data/config.json");

class Context {
    constructor() {
        this.client = client;
        this.discord = Discord;
        this.config = config;
        this.services = {};
        this.services.interactions = interactions;
        this.services.stats = stats;
        this.services.perks = perks;
        this.services.servers = servers;
        this.services.characters = characters;
        this.services.rules = rules;
        this.services.database = database;
    }
}

module.exports = Context;