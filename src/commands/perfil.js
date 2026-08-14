const { SlashCommandBuilder } = require('discord.js');
const texts = require("../data/texts.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('perfil')
		.setDescription('Pon tu perfil de Steam asociado a tu Discord.')
        .addStringOption(steamLink => {
            return steamLink
                .setName("steam-link")
                .setDescription("Link de Steam, SteamID, codigo de amigo o nombre de usuario")
                .setRequired(true)
        }),
	async execute(context, interaction) {
        await interaction.deferReply();
        const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
        const steamLink = interaction.options.get("steam-link").value;
        if (steamLink && interaction.member) {
            const memberId = interaction.member.id;
            const steamId = await context.services.stats.getSteamId(context, interaction, steamLink.toLowerCase());
            // A link that could not be resolved is not worth storing, and getSteamId already replied.
            if (!steamId) return;
            const member = await context.services.database.getOrCreateUser(memberId);
            member.steamID = steamId;
            await member.save()
            interaction.editReply(texts.profileStats.setter[serverConfig.language]);
        }
	},
};