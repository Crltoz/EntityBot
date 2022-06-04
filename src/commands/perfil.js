const { SlashCommandBuilder } = require('@discordjs/builders');
const texts = require("../data/texts.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('perfil')
		.setDescription('Pon tu perfil de Steam asociado a tu Discord.')
        .addStringOption(steamLink => {
            return steamLink
                .setName("steam-link")
                .setDescription("Link del perfil de steam")
                .setRequired(true)
        }),
	async execute(context, interaction) {
        await interaction.deferReply();
        const serverConfig = context.client.servers.get(interaction.guildId);
        const steamLink = interaction.options.get("steam-link").value;
        if (serverConfig && steamLink && interaction.member) {
            const memberId = interaction.member.id;
            const steamId = await context.services.stats.getSteamId(context, interaction, steamLink);
            context.services.database.query(`SELECT * FROM userlink WHERE ID = ${memberId}`, (err, rows) => {
                if (err) throw err;
                if (rows.length > 0) {
                    context.services.database.query(`UPDATE userlink SET steamid = ${steamId} WHERE ID = ${memberId}`);
                    interaction.editReply(texts.profileStats.setter[serverConfig.language]);
                } else {
                    context.services.database.query(`INSERT INTO userlink (ID, steamid) VALUES ('${memberId}', '${steamId}')`);
                    interaction.editReply(texts.profileStats.setter[serverConfig.language]);
                }
            });
        }
	},
};