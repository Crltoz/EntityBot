const { SlashCommandBuilder } = require('@discordjs/builders');
const texts = require("../data/texts.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('english')
		.setDescription('Set bot language in english'),
	async execute(context, interaction) {
        const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            await interaction.reply({ content: texts.errors.permissionsError[serverConfig.language], ephemeral: true });
            return;
        }
        serverConfig.language = 1;
        await serverConfig.save()
        await interaction.reply({ content: texts.languageChanged[serverConfig.language], ephemeral: true });
	},
};