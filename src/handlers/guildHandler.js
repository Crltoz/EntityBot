const { ChannelType, PermissionFlagsBits } = require("discord.js");

async function guildHandler(context, guild) {
    let defaultChannel = "";
    guild.channels.cache.forEach((channel) => {
        // v14 reports the channel type as a numeric enum, not the "GUILD_TEXT" string of v13.
        if (channel.type === ChannelType.GuildText && defaultChannel == "") {
            if (channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages)) {
                defaultChannel = channel;
            }
        }
    });

    if (defaultChannel) {
        defaultChannel.send("**Gracias por añadirme!** :white_check_mark:\n**-** Mi prefijo es `/`\n**-** Puedes ver mis comandos con `/ayuda`\n**-** Change the bot language with `/english`")
            .catch((err) => console.log(`Could not send the welcome message on guild ${guild.id}: ${err.message}`));
    }

    console.log(`GUILD_JOIN | id: ${guild.id} | name: ${guild.name} | members: ${guild.memberCount} | total: ${context.client.guilds.cache.size}`);

    const statsChannel = context.client.channels.cache.get(process.env.STATS_CHANNEL);
    if (statsChannel) {
        statsChannel.send(`| Nuevo servidor | Nombre: ${guild.name} | Usuarios: ${guild.memberCount} | Total: ${context.client.guilds.cache.size}`)
            .catch((err) => console.log(`Could not log the new guild to the stats channel: ${err.message}`));
    }

    await context.services.database.getOrCreateServer(guild.id);
}


module.exports = guildHandler;
