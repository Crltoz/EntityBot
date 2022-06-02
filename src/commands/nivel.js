const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nivel')
		.setDescription('Calcula la cantidad de puntos de sangres para comprar niveles.')
        .addIntegerOption(currentLevel => {
            return currentLevel
                .setName("nivel-actual")
                .setDescription("Nivel actual del personaje (1-49)")
                .setMinValue(1)
                .setMaxValue(49)
                .setRequired(true)
        })
        .addIntegerOption(wantedLevel => {
            return wantedLevel
                .setName("nivel-deseado")
                .setDescription("Nivel que quieres alcanzar (2-50)")
                .setMinValue(2)
                .setMaxValue(50)
                .setRequired(true)
        }),
	async execute(context, interaction) {
        await interaction.deferReply();
        const currentLevel = interaction.options.get("nivel-actual").value;
        const wantedLevel = interaction.options.get("nivel-deseado").value;
        context.services.stats.calculateLevel(context, interaction, currentLevel, wantedLevel);
	},
};