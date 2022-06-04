function guildHandler(context, guild) {
    let defaultChannel = "";
    guild.channels.cache.forEach((channel) => {
        if (channel.type == "text" && defaultChannel == "") {
            if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel;
            }
        }
    });
    if (defaultChannel) defaultChannel.send("**Gracias por añadirme!** :white_check_mark:\n**-** Mi prefijo es `/`\n**-** Puedes ver mis comandos con `/ayuda`\n**-** Change the bot language with `/english`");
    context.client.channels.cache.get('739997803094343721').send('| Nuevo servidor | Nombre: ' + guild.name + ' | Usuarios: ' + guild.memberCount);
    context.services.servers.add(context, guildId);
}


module.exports = guildHandler;