/**
 * @param context - BotContext.
 * @param guild - Discord guild the bot was removed from.
 * @description Log guild removals so the net server count can be measured.
 *              The server config is intentionally kept in the database: a guild can
 *              re-add the bot, and this event also fires during Discord outages.
 */
async function guildDeleteHandler(context, guild) {
    console.log(`GUILD_LEAVE | id: ${guild.id} | name: ${guild.name} | members: ${guild.memberCount} | total: ${context.client.guilds.cache.size}`);

    const statsChannel = context.client.channels.cache.get(process.env.STATS_CHANNEL);
    if (statsChannel) {
        statsChannel.send(`| Servidor perdido | Nombre: ${guild.name} | Usuarios: ${guild.memberCount} | Total: ${context.client.guilds.cache.size}`)
            .catch((err) => console.log(`Could not log the removed guild to the stats channel: ${err.message}`));
    }
}


module.exports = guildDeleteHandler;
