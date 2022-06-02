const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sv')
    .setDescription('Get count servers that the bot is in'),
  async execute(context, interaction) {
    if (interaction.member.id != '277506787261939712' && interaction.member.id != '313496742156959745' && interaction.member.id != '389320439932911626' && interaction.member.id != '169818091281186816') return interaction.member.send('SACA LA MANO DE AHÍ CARAJO', {
      files: [{
        attachment: 'https://i.ytimg.com/vi/7A6FricobFA/hqdefault.jpg',
        name: "SACA_LA_MANO.jpg"
      }]
    });
    let users = 0;
    context.client.guilds.cache.forEach((guild) => {
      users += guild.memberCount;
    });
    await interaction.reply('Estoy actualmente en **' + context.client.guilds.cache.size + '** servidores.');
    await interaction.followUp('Y **' + users + '** usuarios tienen acceso a mis funcionalidades.');
  },
};