const { SlashCommandBuilder } = require('@discordjs/builders');
const texts = require("../data/texts.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anychannel')
        .setDescription('Allows commands to be used on any channel.'),
    async execute(context, interaction) {
        const serverConfig = context.client.servers.get(interaction.guildId);
        const hasPermission = interaction.member.permissions.has("ADMINISTRATOR");
        if (serverConfig) {
            if (!hasPermission) return interaction.reply(texts.errors.permissionsError[serverConfig.language]);
            context.services.servers.changeChannel(context, interaction.guildId, null);
            interaction.reply(texts.channelRemoved[serverConfig.language]);
        }
    },
};