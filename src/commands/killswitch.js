const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('killswitch')
        .setDescription('See what is disabled right now | Mira qué está deshabilitado ahora mismo.'),
    async execute(context, interaction) {
        await interaction.deferReply();
        await context.services.gameInfo.sendKillswitch(context, interaction);
    },
};
