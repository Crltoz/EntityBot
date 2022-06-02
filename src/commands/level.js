const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('level')
		.setDescription('Calculate the amount of bloodpoints to buy levels.')
        .addIntegerOption(currentLevel => {
            return currentLevel
                .setName("current-level")
                .setDescription("Bloodweb current level (1-49)")
                .setMinValue(1)
                .setMaxValue(49)
                .setRequired(true)
        })
        .addIntegerOption(wantedLevel => {
            return wantedLevel
                .setName("wanted-level")
                .setDescription("Level wanted to get (2-50)")
                .setMinValue(2)
                .setMaxValue(50)
                .setRequired(true)
        }),
	async execute(context, interaction) {
        await interaction.deferReply();
        const currentLevel = interaction.options.get("current-level").value;
        const wantedLevel = interaction.options.get("wanted-level").value;
        context.services.stats.calculateLevel(context, interaction, currentLevel, wantedLevel);
	},
};