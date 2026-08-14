const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('patchnotes')
        .setDescription('Latest patch notes | Notas del último parche.'),
    async execute(context, interaction) {
        // Ephemeral: whoever asks gets the notes without dropping a wall of text on the channel.
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        await context.services.gameInfo.sendPatchNotes(context, interaction);
    },
};
