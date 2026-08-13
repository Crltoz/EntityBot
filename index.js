require('dotenv').config();

const ContextConstructor = require("./src/classes/context.js");
const context = new ContextConstructor();


// handlers
const interactionHandler = require("./src/handlers/interactionHandler.js");
const guildHandler = require("./src/handlers/guildHandler.js");
const guildDeleteHandler = require("./src/handlers/guildDeleteHandler.js");

context.client.on("ready", async () => {
    context.services.interactions.init(context);
    context.services.stats.init();
    context.services.rules.init();

    // The snapshot cache lives in Mongo, so the database goes first — but a database that
    // is down must not take the game data with it, hence the separate guards.
    try {
        await context.services.database.init();
    } catch (err) {
        console.error(`Database connection failed: ${err.message}`);
    }

    try {
        await context.services.dataService.init(context);
    } catch (err) {
        console.error(`Failed to load game data: ${err.message}`);
    }

    console.log(`Client ${context.client.user.username} loading!`);
});

context.client.on("interactionCreate", (interaction) => { interactionHandler(context, interaction); });

context.client.on("guildCreate", (guild) => { guildHandler(context, guild); });

context.client.on("guildDelete", (guild) => { guildDeleteHandler(context, guild); });

context.client.login(process.env.TOKEN);

module.exports = {
    context: context
}