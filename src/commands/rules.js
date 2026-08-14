const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Get a random rule to play Dead By Daylight.'),
  async execute(context, interaction) {
      context.services.rules.getRandomRule(context, interaction);
  },
};