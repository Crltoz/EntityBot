<h1 align="center">
  <br>
  <a href="https://github.com/Crltoz/EntityBot"><img src="https://i.imgur.com/hN8evRa.png" alt="EntityBot"></a>
  <br>
  EntityBot
  <br>
</h1>

<h4 align="center">Dead By Daylight stats, builds and more.</h4>

<p align="center">
  <a href="https://nodejs.org/en/download">
    <img alt="Node.js" src="https://img.shields.io/badge/node_js-v16-orange">
  </a>
  <a href="https://github.com/discordjs/discord.js">
     <img src="https://img.shields.io/badge/discordjs-v14-yellow.svg" alt="discord.js">
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg">
  </a>
</p>

<p align="center">
  <a href="#overview">Overview</a>
  •
  <a href="#requeriments">Requeriments</a>
  •
  <a href="#installation">Installation</a>
  •
  <a href="#environment-variables">Environment-Variables</a>
  •
  <a href="#tutorials">Tutorials</a>
  •
  <a href="#license">License</a>
</p>

# Overview

This bot was born with the idea of providing Dead By Daylight players with their statistics without the need to search for them on the web. 
Therefore, this Discord bot was created with simple commands to retrieve statistics by making API requests to the Dead By Daylight statistics [website](https://dbd.tricky.lol) created by Tricky.

Before starting the [installation](#installation), please note that you should meet the requirements as it requires some basic knowledge of MongoDB.

**Features:**

- Random builds (survivor/killer)
- Get player stats (only steam supported) in canvas image.
- Save steam profile link get stats by menu (Right click on your profile -> Apps -> EntityBot -> Stats)
- Set channel to use commands.
- Calculate bloodpoints to get level in characters (need update)
- Multilanguage (Spanish/English)

# Requeriments

- NodeJS (v16 or higher) - <a href="https://nodejs.org/en/download">Download</a>
- MongoDB (I recommend to install Mongo Compass also) - <a href="https://www.mongodb.com/docs/manual/installation/">Download</a>

# Installation

**Before this step, install all [requeriments](#requeriments)** 

- [Windows](#windows)

<br>

## Windows

- Clone this repository.
- Inside repository, use in command line `npm install`
- Create file `.env` and set the [Environment Variables](#Environment Variables)
- Use `node index` to start bot

<br>

# Environment-Variables

To make the project work, environment variables need to be set, which are necessary for the bot to function. Here, we'll provide a sample file for you to modify with the values you have.

`.env`
```.env
CLIENT_ID = "yourApplicationID"
TOKEN = "yourApplicationToken"
GUILD_ID = "yourMainGuildID"
MONGO_URI = "yourMongoURI"
STATS_CHANNEL = "yourStatsChannelID"
SUPPORT_DISCORD = "yourSupportDiscordInviteLink"
STEAM_APIKEY = "yourSteamAPIKey"
USER_AGENT = "yourUserAgent"
```

### CLIENT_ID

This is the ID of your application, which you can find within your bot's settings. 
Check [tutorials](#tutorials) to see how to copy discord IDS.

### TOKEN

This is your bot's token. You can also find it in your application's dashboard. This is completely confidential, and no one should have access other than you.

### GUILD_ID

This should be the ID of the Discord guild/server where your bot will send stats messages.

### MONGO_URI

Here should go the URI of your MongoDB instance. If you are using your local machine, you can use `mongodb://localhost:27017/entityBot`.
If you are using a cloud database, you should use the URI they provide with the authentication data.

### STATS_CHANNEL

This should be the ID of the channel where a message will be sent each time the bot is added to a new server. Ideally, this channel should be in the guild you configured earlier.

### SUPPORT_DISCORD

This should be an invitation link to a Discord server that will be sent to users when an unexpected error occurs, encouraging them to report it.

### STEAM_APIKEY

This should be the API Key you generated with your account. Below, you can see where to generate it. This API Key is confidential and should not be placed in sensitive locations.
Check [tutorials](#tutorials) to check how to get your steam web API Key.

### USER_AGENT

This is the name with which your bot will identify itself with the statistics API. You can give it any name you like.

<hr>

# Tutorials

- [How to Get Your Steam Web API Key](https://www.youtube.com/watch?v=Sb5p8cGyVQw&ab_channel=EnriqueCalTech)
- [How to Get Server ID, Channel ID, User ID in Discord - Copy ID's](https://www.youtube.com/watch?v=NLWtSHWKbAI&ab_channel=GaugingGadgets)


# License

Released under the [MIT](https://github.com/Crltoz/EntityBot/LICENSE) license.
