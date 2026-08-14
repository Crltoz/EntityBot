require('dotenv').config();

const ContextConstructor = require("./src/classes/context.js");
const context = new ContextConstructor();


// handlers
const interactionHandler = require("./src/handlers/interactionHandler.js");
const guildHandler = require("./src/handlers/guildHandler.js");
const guildDeleteHandler = require("./src/handlers/guildDeleteHandler.js");

// "ready" was renamed to "clientReady" in discord.js 14.19; the old name still fires but warns.
context.client.on("clientReady", async () => {
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

const guard = (name, handler) => (payload) => {
    Promise.resolve()
        .then(() => handler(context, payload))
        .catch((err) => console.error(`Unhandled failure in the ${name} handler:`, err));
};

context.client.on("interactionCreate", guard("interaction", interactionHandler));

context.client.on("guildCreate", guard("guildCreate", guildHandler));

context.client.on("guildDelete", guard("guildDelete", guildDeleteHandler));

// discord.js reports gateway and REST trouble through these; without a listener on "error"
// Node rethrows it as an exception and the process dies on a hiccup it would have recovered from.
context.client.on("error", (err) => console.error("Discord client error:", err));
context.client.on("shardError", (err) => console.error("Discord shard error:", err));

// Last resort. A bot serving ~1.8k guilds should not die because one interaction lost a race
// with a Discord 503: the gateway connection survives it and the next command works. These are
// a safety net for bugs that slipped every other guard, so they log loudly rather than exit.
process.on("unhandledRejection", (reason) => console.error("Unhandled rejection:", reason));
process.on("uncaughtException", (err) => console.error("Uncaught exception:", err));

context.client.login(process.env.TOKEN);

module.exports = {
    context: context
}