const { SlashCommandBuilder } = require('@discordjs/builders');
const texts = require("../data/texts.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ayuda')
        .setDescription('Obtén información acerca de los comandos del bot.')
        .addSubcommand(subcommand =>
            subcommand
                .setName("general")
                .setDescription("Lista de todos los comandos."))
        .addSubcommand(subcommand =>
            subcommand
                .setName("stats")
                .setDescription("Información sobre el comando de estadísticas"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("nivel")
                .setDescription("Información sobre el comando de cálculo de nivel.")),
    async execute(context, interaction) {
        const serverConfig = context.client.servers.get(interaction.guildId);
        if (serverConfig) {
            switch (interaction.options.getSubcommand()) {
                case "general": {
                    const embedd = new context.discord.MessageEmbed()
                        .setColor('#FF0000')
                        .setTitle(texts.commands.help.header[serverConfig.language])
                        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
                        .setThumbnail(context.client.user.avatarURL())
                        .addField('/discord', texts.commands.help.discord[serverConfig.language])
                        .addField(texts.commands.help.note[serverConfig.language], texts.commands.help.noteDescription[serverConfig.language])
                        .addField(`/${texts.commands.name.stats[serverConfig.language]} ${texts.commands.args.stats[serverConfig.language]}`, `${texts.commands.help.moreInfo[serverConfig.language]} stats**`)
                        .addField(`/${texts.commands.name.level[serverConfig.language]} ${texts.commands.args.level[serverConfig.language]}`, `${texts.commands.help.moreInfo[serverConfig.language]} ${texts.commands.name.level[serverConfig.language]}**`)
                        .addField('/lobby', `${texts.commands.help.lobby[serverConfig.language]}`)
                        .addField(`/${texts.commands.name.random[serverConfig.language]} ${texts.commands.args.random[serverConfig.language]}`, texts.commands.help.random[serverConfig.language])
                        .addField(`/${texts.commands.name.shrine[serverConfig.language]}`, texts.commands.help.shrine[serverConfig.language]);

                    if (interaction.member.permissions.has("ADMINISTRATOR")) {
                        embedd.addField(`/${texts.commands.name.channel[serverConfig.language]} ${texts.commands.args.channel[serverConfig.language]}`, texts.commands.help.channel[serverConfig.language])
                    }
                    interaction.reply({ embeds: [embedd], ephemeral: true });
                    break;
                }
                case "stats": {
                    const embedd = new context.discord.MessageEmbed()
                        .setColor('#FF0000')
                        .setTitle(`🔰 /${texts.commands.name.stats[serverConfig.language]} ${texts.commands.args.stats[serverConfig.language]} 🔰`)
                        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
                        .setThumbnail(context.client.user.avatarURL())
                        .addField(texts.commands.help.isFor[serverConfig.language], texts.commands.help.statsIsFor[serverConfig.language])
                        .addField(texts.commands.help.example[serverConfig.language], texts.commands.help.statsExample[serverConfig.language])
                    interaction.reply({ embeds: [embedd], ephemeral: true });
                    break;
                }
                case "nivel": {
                    const embedd = new context.discord.MessageEmbed()
                        .setColor('#FF0000')
                        .setTitle(`🔰 /${texts.commands.name.level[serverConfig.language]} ${texts.commands.args.level[serverConfig.language]} 🔰`)
                        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
                        .setThumbnail(context.client.user.avatarURL())
                        .addField(texts.commands.help.isFor[serverConfig.language], texts.commands.help.levelIsFor[serverConfig.language])
                        .addField(texts.commands.help.example[serverConfig.language], texts.commands.help.levelExample[serverConfig.language])
                    interaction.reply({ embeds: [embedd], ephemeral: true });
                    break;
                }
            }
        }
    },
};