const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

/**
 * @description Loads the commands and menus and registers them with Discord.
 *
 * A command marked `guildOnly: true` is an operator tool (bot-wide stats, roster diagnostics)
 * and is registered only in GUILD_ID, never globally. Outside production everything is
 * registered to that same guild, because global commands take up to an hour to propagate.
 */
function init(context) {
    const globalInteractions = [];
    const guildInteractions = [];

    // commands
    context.client.commands = new context.discord.Collection();
    const commandsPath = path.join("src", "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    // menus
    context.client.menus = new context.discord.Collection();
    const menusPath = path.join("src", "menus");
    const menuFiles = fs.readdirSync(menusPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        context.client.commands.set(command.data.name, command);
        (command.guildOnly ? guildInteractions : globalInteractions).push(command.data.toJSON());
    }

    for (const file of menuFiles) {
        const menu = require(`../menus/${file}`);
        context.client.menus.set(menu.data.name, menu);
        (menu.guildOnly ? guildInteractions : globalInteractions).push(menu.data.toJSON());
    }

    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    registerInteractions(context, rest, globalInteractions, guildInteractions);
}

async function registerInteractions(context, rest, globalInteractions, guildInteractions) {
    const isProduction = process.env.ENVIRONMENT == "production";
    console.log('Started refreshing application interactions.');

    // Outside production nothing is published globally: the dev guild gets the whole set.
    const guildBody = isProduction ? guildInteractions : globalInteractions.concat(guildInteractions);

    if (guildBody.length) {
        if (!process.env.GUILD_ID) {
            console.error(`GUILD_ID is not set, so ${guildBody.length} guild-only interaction(s) were not registered.`);
        } else {
            try {
                await rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                    { body: guildBody },
                );
                console.log(`Registered ${guildBody.length} interaction(s) in guild ${process.env.GUILD_ID}.`);
            } catch (error) {
                console.error(`Failed to register the guild interactions: ${error.message}`);
            }
        }
    }

    if (!isProduction) return;

    try {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: globalInteractions },
        );
        console.log(`Registered ${globalInteractions.length} interaction(s) globally.`);
    } catch (error) {
        console.error(`Failed to register the global interactions: ${error.message}`);
    }
}

module.exports = {
    init: init
}
