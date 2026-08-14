const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
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
        const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
        switch (interaction.options.getSubcommand()) {
            case "general": {
                const embedd = new context.discord.EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle(texts.commands.help.header[serverConfig.language])
                    .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
                    .setThumbnail(context.client.user.avatarURL())
                    .addFields({ name: '/discord', value: texts.commands.help.discord[serverConfig.language] })
                    .addFields({ name: texts.commands.help.note[serverConfig.language], value: texts.commands.help.noteDescription[serverConfig.language] })
                    .addFields({ name: `/${texts.commands.name.stats[serverConfig.language]} ${texts.commands.args.stats[serverConfig.language]}`, value: `${texts.commands.help.moreInfo[serverConfig.language]} stats**` })
                    .addFields({ name: `/${texts.commands.name.level[serverConfig.language]} ${texts.commands.args.level[serverConfig.language]}`, value: `${texts.commands.help.moreInfo[serverConfig.language]} ${texts.commands.name.level[serverConfig.language]}**` })
                    .addFields({ name: '/lobby', value: `${texts.commands.help.lobby[serverConfig.language]}` })
                    .addFields({ name: `/${texts.commands.name.random[serverConfig.language]} ${texts.commands.args.random[serverConfig.language]}`, value: texts.commands.help.random[serverConfig.language] })
                    .addFields({ name: `/${texts.commands.name.shrine[serverConfig.language]}`, value: texts.commands.help.shrine[serverConfig.language] })
                    .addFields({ name: `/${texts.commands.name.profile[serverConfig.language]} ${texts.commands.args.profile[serverConfig.language]}`, value: texts.commands.help.profile[serverConfig.language] })
                    .addFields({ name: `/${texts.commands.name.killswitch[serverConfig.language]}`, value: texts.commands.help.killswitch[serverConfig.language] })
                    .addFields({ name: `/${texts.commands.name.events[serverConfig.language]}`, value: texts.commands.help.events[serverConfig.language] })
                    .addFields({ name: `/${texts.commands.name.patchNotes[serverConfig.language]}`, value: texts.commands.help.patchNotes[serverConfig.language] })
                    .addFields({ name: `/${texts.commands.name.adepts[serverConfig.language]} ${texts.commands.args.adepts[serverConfig.language]}`, value: texts.commands.help.adepts[serverConfig.language] });

                if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    embedd.addFields({ name: `/${texts.commands.name.channel[serverConfig.language]} ${texts.commands.args.channel[serverConfig.language]}`, value: texts.commands.help.channel[serverConfig.language] })
                }
                interaction.reply({ embeds: [embedd], flags: MessageFlags.Ephemeral });
                break;
            }
            case "stats": {
                const embedd = new context.discord.EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle(`🔰 /${texts.commands.name.stats[serverConfig.language]} ${texts.commands.args.stats[serverConfig.language]} 🔰`)
                    .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
                    .setThumbnail(context.client.user.avatarURL())
                    .addFields({ name: texts.commands.help.isFor[serverConfig.language], value: texts.commands.help.statsIsFor[serverConfig.language] })
                    .addFields({ name: texts.commands.help.example[serverConfig.language], value: texts.commands.help.statsExample[serverConfig.language] })
                interaction.reply({ embeds: [embedd], flags: MessageFlags.Ephemeral });
                break;
            }
            case "nivel": {
                const embedd = new context.discord.EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle(`🔰 /${texts.commands.name.level[serverConfig.language]} ${texts.commands.args.level[serverConfig.language]} 🔰`)
                    .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
                    .setThumbnail(context.client.user.avatarURL())
                    .addFields({ name: texts.commands.help.isFor[serverConfig.language], value: texts.commands.help.levelIsFor[serverConfig.language] })
                    .addFields({ name: texts.commands.help.example[serverConfig.language], value: texts.commands.help.levelExample[serverConfig.language] })
                interaction.reply({ embeds: [embedd], flags: MessageFlags.Ephemeral });
                break;
            }
        }
    },
};