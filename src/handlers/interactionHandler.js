const texts = require("../data/texts.json");

async function interactionHandler(context, interaction) {
    if (interaction.isCommand()) {
        commandHandler(context, interaction);
        return;
    }

    if (interaction.isSelectMenu()) {
        menuHandler(context, interaction);
        return;
    }

    if (interaction.isModalSubmit()) {
        modalHandler(context, interaction);
        return;
    }

    if (interaction.isUserContextMenu()) {
        userMenuHandler(context, interaction);
        return;
    }

    if (interaction.isMessageContextMenu()) {
        messageMenuHandler(context, interaction);
        return;
    }
}

async function userMenuHandler(context, interaction) {
    const menu = context.client.menus.get(interaction.commandName);
    if (!menu) return;

    const serverConfig = context.client.servers.get(interaction.guildId);
    if (serverConfig) {

        console.log(`${interaction.member.user.username} use menu: ${interaction.commandName}`)
        try {
            await menu.execute(context, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: texts.errors.interactionFail[serverConfig.language], ephemeral: true });
        }
    }
}

async function messageMenuHandler(context, interaction) {
    return;
}

async function modalHandler(context, interaction) {
    const serverConfig = context.client.servers.get(interaction.guildId);
    if (serverConfig) {

        if (interaction.customId == "askLevels") {
            await interaction.deferReply();
            const currentLevel = parseInt(interaction.fields.getTextInputValue('currentLevel'));
            const wantedLevel = parseInt(interaction.fields.getTextInputValue('wantedLevel'));
            if (currentLevel > 0 && currentLevel <= 50 && wantedLevel > 1 && wantedLevel > currentLevel && wantedLevel <= 50) {
                context.services.stats.calculateLevel(context, interaction, currentLevel, wantedLevel);
            } else interaction.editReply({ content: texts.errors.invalidLevel[serverConfig.language], ephemeral: true });
            return;
        }
    }
}

async function menuHandler(context, interaction) {
    const serverConfig = context.client.servers.get(interaction.guildId);
    if (serverConfig) {
        if (interaction.customId == "lobby") {
            const value = interaction.values[0];
            switch (value) {
                case "buyLevels": {
                    const askLevelsModals = new context.discord.Modal()
                        .setCustomId('askLevels')
                        .setTitle(texts.lobby.calculateLevel[serverConfig.language]);

                    const currentLevel = new context.discord.TextInputComponent()
                        .setCustomId('currentLevel')
                        .setLabel(texts.lobby.currentLevel[serverConfig.language])
                        .setStyle("SHORT")
                        .setMaxLength(2)
                        .setMinLength(1)
                        .setRequired(true);

                    const wantedLevel = new context.discord.TextInputComponent()
                        .setCustomId('wantedLevel')
                        .setLabel(texts.lobby.wantedLevel[serverConfig.language])
                        .setStyle("SHORT")
                        .setMaxLength(2)
                        .setMinLength(1)
                        .setRequired(true);

                    const currentLevelRow = new context.discord.MessageActionRow()
                        .addComponents(currentLevel);

                    const wantedLevelRow = new context.discord.MessageActionRow()
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
                }
            }
        }
    }
}

async function commandHandler(context, interaction) {
    const command = context.client.commands.get(interaction.commandName);
    if (!command) return;

    const serverConfig = context.client.servers.get(interaction.guildId);
    if (serverConfig) {
        if (serverConfig.channelId && serverConfig.channelId !== interaction.channelId) {
            const channel = context.client.channels.cache.get(serverConfig.channelId);
            if (!channel) {
                context.services.servers.changeChannel(context, interaction.guildId, null);
            } else {
                interaction.reply({ content: texts.errors.commandsNotAllowed[serverConfig.language] + `<#${serverConfig.channelId}>`, ephemeral: true });
                return;
            }
        }

        console.log(`${interaction.member.user.username} use command: ${interaction.commandName}`)
        if (serverConfig.language == 0) context.services.database.query(`UPDATE commands SET count = count + 1 WHERE language = 'spanish'`)
        else if (serverConfig.language == 1) context.services.database.query(`UPDATE commands SET count = count + 1 WHERE language = 'english'`)

        try {
            await command.execute(context, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: texts.errors.interactionFail[serverConfig.language], ephemeral: true });
        }
    }
}

module.exports = interactionHandler;