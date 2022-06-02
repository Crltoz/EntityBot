const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

function deployCommands(context) {
    context.client.commands = new context.discord.Collection();
    const commandsPath = path.join("src", "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    const commands = [];

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        context.client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }
    const rest = new REST({ version: '9' }).setToken(context.config.token);
    registerCommands(context, rest, commands);
}

function registerCommands(context, rest, commands, private = false) {
    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            if (context.config.state === "dev" || private) {
                await rest.put(
                    Routes.applicationGuildCommands(context.config.clientId, context.config.guildId),
                    { body: commands },
                );
            } else {
                await rest.put(
                    Routes.applicationCommands(context.config.clientId),
                    { body: commands },
                );
            }

            console.log(`Successfully reloaded application (/) commands. (State: ${context.config.state})`);
        } catch (error) {
            console.error(error);
        }
    })();
}

module.exports = {
    deployCommands: deployCommands
}