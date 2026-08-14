const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('events')
        .setDescription('Shows the active event, the upcoming one and the next rank reset.'),
    async execute(context, interaction) {
        await interaction.deferReply();
        await context.services.gameInfo.sendEvents(context, interaction);
    },
};
