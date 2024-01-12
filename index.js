require('dotenv').config();

const ContextConstructor = require("./src/classes/context.js");
const context = new ContextConstructor();


// handlers
const interactionHandler = require("./src/handlers/interactionHandler.js");
const guildHandler = require("./src/handlers/guildHandler.js");

context.client.on("ready", () => { 
    context.services.interactions.init(context);
    context.services.perks.init();
    context.services.stats.init();
    context.services.characters.init();
    context.services.rules.init();
    context.services.database.init();
    console.log(`Client ${context.client.user.username} loading!`);
});

context.client.on("interactionCreate", (interaction) => { interactionHandler(context, interaction); });

context.client.on("guildCreate", (guild) => { guildHandler(context, guild); });

context.client.login(process.env.TOKEN);

module.exports = {
    context: context
}