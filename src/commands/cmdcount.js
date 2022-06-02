const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cmdcount')
    .setDescription('Get the number of times the commands were used'),
  async execute(context, interaction) {
    if (interaction.member.id != '277506787261939712' && interaction.member.id != '313496742156959745' && interaction.member.id != '389320439932911626' && interaction.member.id != '169818091281186816') return interaction.member.send('SACA LA MANO DE AHÍ CARAJO', {
      files: [{
        attachment: 'https://i.ytimg.com/vi/7A6FricobFA/hqdefault.jpg',
        name: "SACA_LA_MANO.jpg"
      }]
    });
    context.services.database.query(`SELECT * FROM commands`, async (err, rows) => {
      if (err) throw err;
      if (rows.length) {
        await interaction.reply(`Comandos usados:\n**${rows[0].language}**: **${rows[0].count}**\n**${rows[1].language}**: **${rows[1].count}**`);
      }
    });
  },
};