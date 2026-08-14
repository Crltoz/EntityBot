const { ContextMenuCommandBuilder, MessageFlags } = require('discord.js');
const texts = require("../data/texts.json");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setType(2)
        .setName("Killer stats"),
    async execute(context, interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
        const user = await context.services.database.userdataSchema.findOne({ _id: interaction.targetUser.id });
        // Same guard as /stats: a stored id that is not a SteamID64 is no profile at all.
        const stored = user ? context.services.stats.parseSteamInput(user.steamID) : null;
        if (stored && stored.kind === "id64") {
            await context.services.stats.getStatsForSteamId(context, interaction, stored.value, "killer");
        } else await interaction.editReply(texts.profileStats.missingProfile[serverConfig.language]);
    }
};