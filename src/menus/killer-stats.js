const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const texts = require("../data/texts.json");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setType(2)
        .setName("Killer stats"),
    async execute(context, interaction) {
        await interaction.deferReply({ ephemeral: true });
        const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
        const user = await context.services.database.userdataSchema.findOne({ _id: interaction.targetUser.id });
        if (user) {
            const userSteamId = user.steamID;
            context.services.stats.getStats(context, interaction, `https://steamcommunity.com/profiles/${userSteamId}`, false);
        } else interaction.editReply(texts.profileStats.missingProfile[serverConfig.language]);
    }
};