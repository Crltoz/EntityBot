const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Generate 4 random perks | Genera una 4 perks random.')
        .addStringOption(option => {
            return option
                .setName("role")
                .setDescription("Role to generate build | Rol para generar build")
                .addChoices({name: "survivor", value: "survivor"}, {name: "killer", value: "killer"})
                .setRequired(true)
        }),
    async execute(context, interaction) {
        await interaction.deferReply();
        const isSurvivor = interaction.options.get("role").value === "survivor";
        context.services.stats.generateRandomBuild(context, interaction, isSurvivor);
    },
};