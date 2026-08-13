const { MessageFlags, PermissionFlagsBits, TextInputStyle } = require("discord.js");
const texts = require("../data/texts.json");

const stats = {
    commands: 0,
    menu: 0,
    modal: 0,
    byCommand: {}
}

async function interactionHandler(context, interaction) {
    // isChatInputCommand(), not isCommand(): in v14 the latter also matches the context menus,
    // which are dispatched further down and would otherwise never be reached.
    if (interaction.isChatInputCommand()) {
        stats.commands++;
        stats.byCommand[interaction.commandName] = (stats.byCommand[interaction.commandName] || 0) + 1;
        // Logged before any early return, so a grep of "CMD |" gives the real command mix.
        console.log(`CMD | ${interaction.commandName} | guild: ${interaction.guildId}`);
        commandHandler(context, interaction);
        return;
    }

    if (interaction.isStringSelectMenu()) {
        stats.menu++;
        menuHandler(context, interaction);
        return;
    }

    if (interaction.isModalSubmit()) {
        stats.modal++;
        modalHandler(context, interaction);
        return;
    }

    if (interaction.isUserContextMenuCommand()) {
        userMenuHandler(context, interaction);
        return;
    }

    if (interaction.isMessageContextMenuCommand()) {
        messageMenuHandler(context, interaction);
        return;
    }
}

setInterval(() => {
    console.log("Interaction stats:", JSON.stringify(stats));
}, 60000 * 30);

async function userMenuHandler(context, interaction) {
    const menu = context.client.menus.get(interaction.commandName);
    if (!menu) return;

    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
    console.log(`${interaction.member.user.username} use menu: ${interaction.commandName}`)
    try {
        await menu.execute(context, interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: texts.errors.interactionFail[serverConfig.language], flags: MessageFlags.Ephemeral });
    }
}

async function messageMenuHandler(context, interaction) {
    return;
}

async function modalHandler(context, interaction) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
    if (interaction.customId == "askLevels") {
        await interaction.deferReply();
        const currentLevel = parseInt(interaction.fields.getTextInputValue('currentLevel'));
        const wantedLevel = parseInt(interaction.fields.getTextInputValue('wantedLevel'));
        if (currentLevel > 0 && currentLevel <= 50 && wantedLevel > 1 && wantedLevel > currentLevel && wantedLevel <= 50) {
            context.services.stats.calculateLevel(context, interaction, currentLevel, wantedLevel);
        } else interaction.editReply({ content: texts.errors.invalidLevel[serverConfig.language] });
        return;
    }
}

async function menuHandler(context, interaction) {
    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
    if (interaction.customId == "lobby") {
        const value = interaction.values[0];
        switch (value) {
            case "buyLevels": {
                const askLevelsModals = new context.discord.ModalBuilder()
                    .setCustomId('askLevels')
                    .setTitle(texts.lobby.calculateLevel[serverConfig.language]);

                const currentLevel = new context.discord.TextInputBuilder()
                    .setCustomId('currentLevel')
                    .setLabel(texts.lobby.currentLevel[serverConfig.language])
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(2)
                    .setMinLength(1)
                    .setRequired(true);

                const wantedLevel = new context.discord.TextInputBuilder()
                    .setCustomId('wantedLevel')
                    .setLabel(texts.lobby.wantedLevel[serverConfig.language])
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(2)
                    .setMinLength(1)
                    .setRequired(true);

                const currentLevelRow = new context.discord.ActionRowBuilder()
                    .addComponents(currentLevel);

                const wantedLevelRow = new context.discord.ActionRowBuilder()
                    .addComponents(wantedLevel);

                askLevelsModals.addComponents(currentLevelRow, wantedLevelRow);
                await interaction.showModal(askLevelsModals);
                break;
            }
            case "randomSurvivor": {
                await interaction.deferReply();
                context.services.stats.generateRandomBuild(context, interaction, true);
                break;
            }
            case "randomKiller": {
                await interaction.deferReply();
                context.services.stats.generateRandomBuild(context, interaction, false);
                break;
            }
            case "help": {
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
                    .addFields({ name: `/${texts.commands.name.shrine[serverConfig.language]}`, value: texts.commands.help.shrine[serverConfig.language] });

                if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    embedd.addFields({ name: `/${texts.commands.name.channel[serverConfig.language]} ${texts.commands.args.channel[serverConfig.language]}`, value: texts.commands.help.channel[serverConfig.language] })
                }
                interaction.reply({ embeds: [embedd], flags: MessageFlags.Ephemeral });
            }
        }
    }
}

async function commandHandler(context, interaction) {
    const command = context.client.commands.get(interaction.commandName);
    if (!command) return;

    const serverConfig = await context.services.database.getOrCreateServer(interaction.guildId);
    if (serverConfig.channelID.length > 0 && serverConfig.channelID !== interaction.channel.id) {
        const channel = context.client.channels.cache.get(serverConfig.channelID);
        if (!channel) {
            serverConfig.channelID = "";
            await serverConfig.save();
        } else {
            interaction.reply({ content: texts.errors.commandsNotAllowed[serverConfig.language] + `<#${serverConfig.channelID}>`, flags: MessageFlags.Ephemeral });
            return;
        }
    }

    console.log(`${interaction.member.user.username} use command: ${interaction.commandName}`)

    try {
        await command.execute(context, interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: texts.errors.interactionFail[serverConfig.language], flags: MessageFlags.Ephemeral });
    }

}

module.exports = interactionHandler;