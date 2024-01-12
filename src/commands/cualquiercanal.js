const { SlashCommandBuilder } = require('@discordjs/builders');
const texts = require("../data/texts.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cualquiercanal')
        .setDescription('Permite que los comandos se puedan usar en cualquier canal.'),
    async execute(context, interaction) {
        const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
        const hasPermission = interaction.member.permissions.has("ADMINISTRATOR");
        if (!hasPermission) return interaction.reply(texts.errors.permissionsError[serverConfig.language]);
        serverConfig.channelID = "";
        await serverConfig.save();
        interaction.reply(texts.channelRemoved[serverConfig.language]);
    },
};