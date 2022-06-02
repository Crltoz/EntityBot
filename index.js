const ContextConstructor = require("./src/classes/context.js");
const context = new ContextConstructor();

// handlers
const interactionHandler = require("./src/handlers/interactionHandler.js");
const messageHandler = require("./src/handlers/messageHandler.js");
const guildHandler = require("./src/handlers/guildHandler.js");

context.client.on("ready", () => { 
    context.services.deployCommands(context);
    context.services.database.init(context);
    context.services.perks.init();
    context.services.stats.init();
    context.services.characters.init();
    context.services.rules.init();
    console.log(`Client ${context.client.user.username} loading!`);
});

context.client.on("interactionCreate", (interaction) => { interactionHandler(context, interaction); });

context.client.on("messageCreate", (message) => { messageHandler(context, message); });

context.client.on("guildCreate", (guild) => { guildHandler(context, guild); });

context.client.login(context.config.token);

module.exports = {
    context: context
}