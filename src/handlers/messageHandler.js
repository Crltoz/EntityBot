const texts = require("../data/texts.json");
let serversNotified = {};

function messageHandler(context, message) {
    if (message.channel.type === "dm") return;

    let serverConfig = context.client.servers.get(message.guildId);
    if (serverConfig) {
        if (serverConfig.prefix !== "/" && !serversNotified[message.guildId]) {
            serversNotified[message.guildId] = true;
            message.channel.send(texts.errors.slashCommands[serverConfig.language]);
        }
    }
}

module.exports = messageHandler;