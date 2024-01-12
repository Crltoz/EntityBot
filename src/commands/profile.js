const { SlashCommandBuilder } = require('@discordjs/builders');
const texts = require("../data/texts.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Put your Steam profile associated with your Discord.')
        .addStringOption(steamLink => {
            return steamLink
                .setName("steam-link")
                .setDescription("Steam profile link")
                .setRequired(true)
        }),
	async execute(context, interaction) {
        await interaction.deferReply();
        const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
        const steamLink = interaction.options.get("steam-link").value;
        if (steamLink && interaction.member) {
            const memberId = interaction.member.id;
            const steamId = await context.services.stats.getSteamId(context, interaction, steamLink);
            const member = await context.services.database.getOrCreateUser(memberId);
            member.steamID = steamId;
            await member.save()
            interaction.editReply(texts.profileStats.setter[serverConfig.language]);
        }
	},
};