const { SlashCommandBuilder } = require('@discordjs/builders');
const texts = require("../data/texts.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spanish')
		.setDescription('Pon el idioma del bot en Español'),
	async execute(context, interaction) {
        const serverConfig = context.client.servers.get(interaction.guildId);
        if (serverConfig) {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) {
                await interaction.reply({ content: texts.errors.permissionsError[serverConfig.language], ephemeral: true });
                return;
            }
            serverConfig.language = 0;
            context.services.database.query(`UPDATE Servidores SET lenguaje = 0 WHERE ID = ${interaction.guildId}`);
            await interaction.reply({ content: texts.languageChanged[serverConfig.language], ephemeral: true });
        }
	},
};