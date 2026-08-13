const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('santuario')
		.setDescription('Envía el santuario de 4 perks actual.'),
	async execute(context, interaction) {
        await interaction.deferReply();
        context.services.stats.sendShrine(context, interaction);
	},
};