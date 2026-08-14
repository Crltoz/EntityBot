const { SlashCommandBuilder } = require('discord.js');
const texts = require("../data/texts.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nivel')
		.setDescription('Calcula la cantidad de puntos de sangres para comprar niveles.')
        .addIntegerOption(currentLevel => {
            return currentLevel
                .setName("nivel-actual")
                .setDescription("Nivel actual del personaje (1-50)")
                .setMinValue(1)
                .setMaxValue(50)
                .setRequired(true)
        })
        .addIntegerOption(wantedLevel => {
            return wantedLevel
                .setName("nivel-deseado")
                .setDescription("Nivel que quieres alcanzar (1-50)")
                .setMinValue(1)
                .setMaxValue(50)
                .setRequired(true)
        })
        .addIntegerOption(currentPrestige => {
            return currentPrestige
                .setName("prestigio-actual")
                .setDescription("Prestigio actual (0-99). Déjalo vacío para calcular dentro de un mismo prestigio.")
                .setMinValue(0)
                .setMaxValue(99)
        })
        .addIntegerOption(wantedPrestige => {
            return wantedPrestige
                .setName("prestigio-deseado")
                .setDescription("Prestigio que quieres alcanzar (0-100)")
                .setMinValue(0)
                .setMaxValue(100)
        }),
	async execute(context, interaction) {
        await interaction.deferReply();
        const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
        const currentLevel = interaction.options.get("nivel-actual").value;
        const wantedLevel = interaction.options.get("nivel-deseado").value;
        const currentPrestige = interaction.options.get("prestigio-actual") ? interaction.options.get("prestigio-actual").value : 0;
        const wantedPrestige = interaction.options.get("prestigio-deseado") ? interaction.options.get("prestigio-deseado").value : currentPrestige;

        if (!context.services.stats.isValidProgression(currentLevel, wantedLevel, currentPrestige, wantedPrestige)) {
            await interaction.editReply({ content: texts.errors.invalidPrestige[serverConfig.language] });
            return;
        }

        await context.services.stats.calculateLevel(context, interaction, currentLevel, wantedLevel, currentPrestige, wantedPrestige);
	},
};
