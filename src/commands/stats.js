const { SlashCommandBuilder } = require('@discordjs/builders');
const texts = require("../data/texts.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Get user statistics | Obtén estadísticas de un jugador')
        .addStringOption(role => {
            return role
                .setName("role")
                .setDescription('Role to get stats')
                .setRequired(true)
                .addChoices({ name: "survivor", value: "survivor" }, { name: "killer", value: "killer" })
        })
        .addStringOption(steamLink => {
            return steamLink
                .setName("steam-link")
                .setDescription("Steam profile link")
                .setRequired(true)
        }),
    async execute(context, interaction) {
        await interaction.deferReply();
        const survivor = interaction.options.get("role").value === "survivor";
        const steamLink = interaction.options.get("steam-link").value;
        if (steamLink) {
            context.services.stats.getStats(context, interaction, steamLink, survivor);
        }
    },
};