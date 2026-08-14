const { SlashCommandBuilder } = require('discord.js');
const texts = require("../data/texts.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Get user statistics | Obtén estadísticas de un jugador')
        // Both optional: with neither, the command answers with the caller's own profile and
        // the headline numbers of both roles.
        .addStringOption(role => {
            return role
                .setName("role")
                .setDescription('Role to get stats. Without it, both are shown | Sin esto se muestran ambos')
                .addChoices({ name: "Survivor", value: "survivor" }, { name: "Killer", value: "killer" })
        })
        .addStringOption(steamLink => {
            return steamLink
                .setName("steam-link")
                .setDescription("Steam link, SteamID, friend code or username | Link, SteamID, codigo o usuario")
        }),
    async execute(context, interaction) {
        await interaction.deferReply();
        const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);

        const roleOption = interaction.options.get("role");
        const role = roleOption ? roleOption.value : null;

        const linkOption = interaction.options.get("steam-link");
        if (linkOption && linkOption.value) {
            await context.services.stats.getStats(context, interaction, linkOption.value, role);
            return;
        }

        // No link given: fall back to whatever /profile stored for this member. The value is
        // validated rather than trusted — an old bug stored a literal "0" for profiles it
        // failed to resolve, and "0" is truthy.
        const member = await context.services.database.getOrCreateUser(interaction.member.id);
        const stored = context.services.stats.parseSteamInput(member.steamID);
        if (!stored || stored.kind !== "id64") {
            await interaction.editReply({ content: texts.stats.needsProfile[serverConfig.language] });
            return;
        }

        await context.services.stats.getStatsForSteamId(context, interaction, stored.value, role);
    },
};
