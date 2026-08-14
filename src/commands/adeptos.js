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
                .addChoices({ name: "Superviviente", value: "survivor" }, { name: "Asesino", value: "killer" })
        }),
    async execute(context, interaction) {
        await interaction.deferReply();
        const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
        const member = await context.services.database.getOrCreateUser(interaction.member.id);
        // The stored value is validated rather than trusted — an old bug stored a literal
        // "0" for profiles it failed to resolve, and "0" is truthy.
        const stored = context.services.stats.parseSteamInput(member.steamID);
        if (!stored || stored.kind !== "id64") {
            await interaction.editReply(texts.adepts.needsProfile[serverConfig.language]);
            return;
        }
        const role = interaction.options.get("rol") ? interaction.options.get("rol").value : null;
        await context.services.gameInfo.sendAdepts(context, interaction, stored.value, role);
    },
};
