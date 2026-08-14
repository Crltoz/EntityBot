const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('patchnotes')
        .setDescription('Latest patch notes | Notas del último parche.'),
    async execute(context, interaction) {
        await interaction.deferReply();
        await context.services.gameInfo.sendPatchNotes(context, interaction);
    },
};
