const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shrine')
		.setDescription('Get the current shrine'),
	async execute(context, interaction) {
        await interaction.deferReply();
        context.services.stats.sendShrine(context, interaction);
	},
};