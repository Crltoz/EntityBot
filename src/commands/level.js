const { SlashCommandBuilder } = require('discord.js');
const texts = require("../data/texts.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('level')
		.setDescription('Calculate the amount of bloodpoints to buy levels.')
        .addIntegerOption(currentLevel => {
            return currentLevel
                .setName("current-level")
                .setDescription("Bloodweb current level (1-50)")
                .setMinValue(1)
                .setMaxValue(50)
                .setRequired(true)
        })
        .addIntegerOption(wantedLevel => {
            return wantedLevel
                .setName("wanted-level")
                .setDescription("Level wanted to get (1-50)")
                .setMinValue(1)
                .setMaxValue(50)
                .setRequired(true)
        })
        .addIntegerOption(currentPrestige => {
            return currentPrestige
                .setName("current-prestige")
                .setDescription("Current prestige (0-99). Leave it out to stay within one prestige.")
                .setMinValue(0)
                .setMaxValue(99)
        })
        .addIntegerOption(wantedPrestige => {
            return wantedPrestige
                .setName("wanted-prestige")
                .setDescription("Prestige wanted to get (0-100)")
                .setMinValue(0)
                .setMaxValue(100)
        }),
	async execute(context, interaction) {
        await interaction.deferReply();
        const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
        const currentLevel = interaction.options.get("current-level").value;
        const wantedLevel = interaction.options.get("wanted-level").value;
        const currentPrestige = interaction.options.get("current-prestige") ? interaction.options.get("current-prestige").value : 0;
        const wantedPrestige = interaction.options.get("wanted-prestige") ? interaction.options.get("wanted-prestige").value : currentPrestige;

        if (!context.services.stats.isValidProgression(currentLevel, wantedLevel, currentPrestige, wantedPrestige)) {
            await interaction.editReply({ content: texts.errors.invalidPrestige[serverConfig.language] });
            return;
        }

        await context.services.stats.calculateLevel(context, interaction, currentLevel, wantedLevel, currentPrestige, wantedPrestige);
	},
};
