const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

function init(context) {
    const interactions = [];

    // commands
    context.client.commands = new context.discord.Collection();
    const commandsPath = path.join("src", "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && (!file.includes("test") || process.env.ENVIROMENT != "production"));
    
    // menus
    context.client.menus = new context.discord.Collection();
    const menusPath = path.join("src", "menus");
    const menuFiles = fs.readdirSync(menusPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        context.client.commands.set(command.data.name, command);
        interactions.push(command.data.toJSON());
    }

    for (const file of menuFiles) {
        const menu = require(`../menus/${file}`);
        context.client.menus.set(menu.data.name, menu);
        interactions.push(menu.data.toJSON());
    }
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    registerInteractions(context, rest, interactions);
}

function registerInteractions(context, rest, interactions) {
    (async () => {
        try {
            console.log('Started refreshing application interactions.');

            if (process.env.ENVIRONMENT != "production") {
                await rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                    { body: interactions },
                );
            } else {
                await rest.put(
                    Routes.applicationCommands(process.env.CLIENT_ID),
                    { body: interactions },
                );
            }

            console.log(`Successfully reloaded application interactions. (Enviroment: ${process.env.ENVIROMENT != "production" ? "Development" : "Production"})`);
        } catch (error) {
            console.error(error);
        }
    })();
}

module.exports = {
    init: init
}