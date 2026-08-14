const { SlashCommandBuilder } = require('discord.js');
const texts = require("../data/texts.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adepts')
        .setDescription('Shows the adepts you earned, based on your associated Steam profile.')
        .addStringOption(role => {
            return role
                .setName("role")
                .setDescription("Filter by role; without it both are shown.")
                .addChoices({ name: "Survivor", value: "survivor" }, { name: "Killer", value: "killer" })
        }),
    async execute(context, interaction) {
        await interaction.deferReply();
        const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
        const member = await context.services.database.getOrCreateUser(interaction.member.id);
        if (!member.steamID) {
            await interaction.editReply(texts.adepts.needsProfile[serverConfig.language]);
            return;
        }
        const role = interaction.options.get("role") ? interaction.options.get("role").value : null;
        await context.services.gameInfo.sendAdepts(context, interaction, member.steamID, role);
    },
};
