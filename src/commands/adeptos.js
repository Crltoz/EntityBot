const { SlashCommandBuilder } = require('discord.js');
const texts = require("../data/texts.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adeptos')
        .setDescription('Muestra los adepts que conseguiste, según tu perfil de Steam asociado.')
        .addStringOption(role => {
            return role
                .setName("rol")
                .setDescription("Filtra por rol; sin esto se muestran ambos.")
                .addChoices({ name: "survivor", value: "survivor" }, { name: "killer", value: "killer" })
        }),
    async execute(context, interaction) {
        await interaction.deferReply();
        const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
        const member = await context.services.database.getOrCreateUser(interaction.member.id);
        if (!member.steamID) {
            await interaction.editReply(texts.adepts.needsProfile[serverConfig.language]);
            return;
        }
        const role = interaction.options.get("rol") ? interaction.options.get("rol").value : null;
        await context.services.gameInfo.sendAdepts(context, interaction, member.steamID, role);
    },
};
