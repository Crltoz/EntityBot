const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eventos')
        .setDescription('Muestra el evento activo, el próximo y el siguiente reinicio de rango.'),
    async execute(context, interaction) {
        await interaction.deferReply();
        await context.services.gameInfo.sendEvents(context, interaction);
    },
};
