
function changeChannel(context, guildId, channelId = null) {
    const serverConfig = context.client.servers.get(guildId);
    if (serverConfig) {
        serverConfig.channelId = channelId;
        context.services.database.query(`UPDATE Servidores SET cid = '${channelId}' WHERE ID = '${guildId}'`);
    }
}

function add(context, guildId) {
    context.services.database.query(`SELECT * FROM Servidores WHERE ID = '${guildId}'`, (err, rows) => {
        if (err) return console.log(`error add ${guildId}: ${err}`);
        if (rows.length == 0) {
            context.services.database.query(`INSERT INTO Servidores (ID, lenguaje) VALUES ('${guildId}', '0')`);
        } else {
            context.services.database.query(`UPDATE Servidores SET channelId = 'null', prefix = '/', language = 0 WHERE ID = '${guildId}'`);
        }
    });
    const serverConfig = {
        channelId: null,
        prefix: "/",
        language: 0
    };
    context.client.servers.set(guildId, serverConfig);
}

module.exports = {
    changeChannel: changeChannel,
    add: add
}