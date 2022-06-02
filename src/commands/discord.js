const { SlashCommandBuilder } = require('@discordjs/builders');
const texts = require("../data/texts.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('discord')
		.setDescription('Invite the bot to your server | Invita el bot a tu servidor'),
	async execute(context, interaction) {
        const serverConfig = context.client.servers.get(interaction.guildId);
        if (serverConfig) interaction.reply(texts.commands.help.webUrl[serverConfig.language])
	},
};