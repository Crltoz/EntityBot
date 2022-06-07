const texts = require("../data/texts.json");

function messageReactionHandler(context, reaction, user) {
    const serverConfig = context.client.servers.get(reaction.message.guildId);
    if (serverConfig && serverConfig.prefix != "/" && reaction.emoji.name == "✅" && reaction.message.author.id === context.client.user.id) {
        reaction.message.channel.send(texts.dailyMessageDisabled[serverConfig.language]);
        serverConfig.prefix = "/";
        context.services.database.query(`UPDATE Servidores SET prefix = '/' WHERE ID = ${reaction.message.guildId}`);
    }
}

module.exports = messageReactionHandler
