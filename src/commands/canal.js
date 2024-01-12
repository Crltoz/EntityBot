const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord-api-types/v9');
const texts = require("../data/texts.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('canal')
        .setDescription('Selecciona un canal para que sólo se puedan usar los comandos allí.')
        .addChannelOption(channelMention => {
            return channelMention
                .setName("canal-de-comandos")
                .setDescription("Canal designado para usar los comandos del bot.")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        }),
    async execute(context, interaction) {
        const channel = interaction.options.get("canal-de-comandos").channel;
        const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
        if (channel) {
            serverConfig.channelID = channel.id;
            await serverConfig.save();
            interaction.reply(texts.channelChanged[serverConfig.language] + `<#${channel.id}>`);
        } else interaction.reply(texts.errors.interactionFail[serverConfig.language]);
    },
};