const { SlashCommandBuilder } = require('@discordjs/builders');
const texts = require("../data/texts.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Command to test jsons')
        .addStringOption(option => {
            return option
                .setName("type")
                .setDescription("Select survivor, killer, kperk, sperk.")
                .addChoices({name: "survivor", value: "survivor"}, {name: "killer", value: "killer"}, {name: "kperk", value: "kperk"}, {name: "sperk", value: "sperk"})
                .setRequired(true)
        })
        .addStringOption(option => {
            return option
                .setName("index")
                .setDescription("index to test")
                .setRequired(true)
        }),
    async execute(context, interaction) {
        await interaction.deferReply({ ephemeral: true });
        const type = interaction.options.get("type").value;
        const index = interaction.options.get("index").value;
        context.services.stats.test(context, interaction, type, index);
    },
};