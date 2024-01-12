async function guildHandler(context, guild) {
    let defaultChannel = "";
    guild.channels.cache.forEach((channel) => {
        if (channel.type == "text" && defaultChannel == "") {
            if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel;
            }
        }
    });
    if (defaultChannel) defaultChannel.send("**Gracias por añadirme!** :white_check_mark:\n**-** Mi prefijo es `/`\n**-** Puedes ver mis comandos con `/ayuda`\n**-** Change the bot language with `/english`");
    context.client.channels.cache.get(process.env.STATS_CHANNEL).send('| Nuevo servidor | Nombre: ' + guild.name + ' | Usuarios: ' + guild.memberCount);
    await context.services.database.getOrCreateServer(guild.id);
}


module.exports = guildHandler;