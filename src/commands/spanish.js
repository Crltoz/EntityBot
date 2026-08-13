const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const texts = require("../data/texts.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spanish')
        .setDescription('Pon el idioma del bot en Español'),
    async execute(context, interaction) {
        const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            await interaction.reply({ content: texts.errors.permissionsError[serverConfig.language], flags: MessageFlags.Ephemeral });
            return;
        }
        serverConfig.language = 0;
        await serverConfig.save()
        await interaction.reply({ content: texts.languageChanged[serverConfig.language], flags: MessageFlags.Ephemeral });
    },
};