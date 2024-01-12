const { SlashCommandBuilder } = require('@discordjs/builders');
const texts = require('../data/texts.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sv')
    .setDescription('Get count servers that the bot is in'),
  async execute(context, interaction) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId)
    let users = 0;
    context.client.guilds.cache.forEach((guild) => {
      users += guild.memberCount;
    });
    await interaction.reply(texts.servers[serverConfig.language] + '**' + context.client.guilds.cache.size + '**');
    await interaction.followUp('**' + users + '** ' + texts.users[serverConfig.language]);
  },
};