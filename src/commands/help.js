const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const texts = require("../data/texts.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get all bot commands.')
        .addSubcommand(subcommand =>
            subcommand
                .setName("general")
                .setDescription("List of all commands."))
        .addSubcommand(subcommand =>
            subcommand
                .setName("stats")
                .setDescription("Information about the statistics command."))
        .addSubcommand(subcommand =>
            subcommand
                .setName("level")
                .setDescription("Information about the level calculation command.")),
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
                    .addFields({ name: `/${texts.commands.name.profile[serverConfig.language]} ${texts.commands.args.profile[serverConfig.language]}`, value: texts.commands.help.profile[serverConfig.language] });

                if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    embedd.addFields({ name: `/${texts.commands.name.channel[serverConfig.language]} ${texts.commands.args.channel[serverConfig.language]}`, value: texts.commands.help.channel[serverConfig.language] })
                }
                interaction.reply({ embeds: [embedd] });
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
                interaction.reply({ embeds: [embedd] });
                break;
            }
            case "level": {
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