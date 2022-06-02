const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord-api-types/v9');
const texts = require("../data/texts.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('Select a channel so that only commands can be used there.')
        .addChannelOption(channelMention => {
            return channelMention
                .setName("command-channel")
                .setDescription("Designated channel to use the bot commands.")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        }),
    async execute(context, interaction) {
        const channel = interaction.options.get("command-channel").channel;
        const serverConfig = context.client.servers.get(interaction.guildId);
        if (channel && serverConfig) {
            context.services.servers.changeChannel(context, interaction.guildId, channel.id);
            interaction.reply(texts.channelChanged[serverConfig.language] + `<#${channel.id}>`);
        } else interaction.reply(texts.errors.interactionFail[serverConfig.language]);
    },
};