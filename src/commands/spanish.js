const { SlashCommandBuilder } = require('@discordjs/builders');
const texts = require("../data/texts.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spanish')
        .setDescription('Pon el idioma del bot en Español'),
    async execute(context, interaction) {
        const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            await interaction.reply({ content: texts.errors.permissionsError[serverConfig.language], ephemeral: true });
            return;
        }
        serverConfig.language = 0;
        await serverConfig.save()
        await interaction.reply({ content: texts.languageChanged[serverConfig.language], ephemeral: true });
    },
};