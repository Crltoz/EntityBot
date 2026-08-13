const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reglas')
    .setDescription('Obtener una regla random para jugar Dead By Daylight.'),
  async execute(context, interaction) {
      context.services.rules.getRandomRule(context, interaction);
  },
};