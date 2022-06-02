const { SlashCommandBuilder } = require('@discordjs/builders');
const texts = require("../data/texts.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lobby')
        .setDescription('Menu-selector for bot functions | Menú para usar las funciones del bot.'),
    async execute(context, interaction) {
        const serverConfig = context.client.servers.get(interaction.guildId);
        if (serverConfig) {
            const embed = new context.discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle('🔰 Lobby 🔰')
                .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
                .setDescription(texts.lobby.description[serverConfig.language])
                .setThumbnail(context.client.user.avatarURL());

            const menu = new context.discord.MessageActionRow()
                .addComponents(
                    new context.discord.MessageSelectMenu()
                        .setCustomId("lobby")
                        .setPlaceholder(texts.lobby.placeholder[serverConfig.language])
                        .addOptions([
                            {
                                label: texts.lobby['option-1'][serverConfig.language],
                                description: texts.commands.help.levelIsFor[serverConfig.language],
                                value: "buyLevels",
                                emoji: "1⃣"
                            },
                            {
                                label: texts.lobby['option-2'][serverConfig.language],
                                description: texts.commands.help['random-survivor'][serverConfig.language],
                                value: 'randomSurvivor',
                                emoji: "2⃣"
                            },
                            {
                                label: texts.lobby['option-3'][serverConfig.language],
                                description: texts.commands.help['random-killer'][serverConfig.language],
                                value: 'randomKiller',
                                emoji: "3⃣"
                            },
                            {
                                label: texts.lobby['option-4'][serverConfig.language],
                                description: texts.commands.help.helpInfo[serverConfig.language],
                                value: 'help',
                                emoji: "4⃣"
                            }
                        ])
                )

            interaction.reply({ embeds: [embed], components: [menu] });
        }
    },
};