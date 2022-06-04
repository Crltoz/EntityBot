const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const texts = require("../data/texts.json");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setType(2)
        .setName("Killer stats"),
    async execute(context, interaction) {
        await interaction.deferReply({ ephemeral: true });
        const serverConfig = context.client.servers.get(interaction.guildId);
        if (serverConfig) {
            context.services.database.query(`SELECT * FROM userlink WHERE ID = ${interaction.targetUser.id}`, (err, rows) => {
                if (err) throw err;
                if (rows.length) {
                    const userSteamId = rows[0].steamid;
                    context.services.stats.getStats(context, interaction, `https://steamcommunity.com/profiles/${userSteamId}`, false);
                } else interaction.editReply(texts.profileStats.missingProfile[serverConfig.language]);
            });
        }
    }
};