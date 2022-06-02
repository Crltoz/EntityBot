/* Requeries for functions */
/*const Discord = require("discord.js");
const client = new Discord.Client();
const disbut = require("discord-buttons");
disbut(client);
const bigNumber = require("bignumber.js")
let https = require('https');
let http = require('http');
const version_bot = '1.0.0'
const mysql = require("mysql");
const fs = require('fs');
const Canvas = require("canvas");

// data
const texts = require("./src/data/texts.json");
const errors = require("./src/data/errors.json");*/

// Images
let backgroundStatsKiller;
let backgroundKiller;
let backgroundSurvivor;
let backgroundLevel;
let backgroundShrine;
let backgroundStatsSurvivor;
let killerImage;
let survivorImage;
let bpImage;
let killsImage;
let sacrificedImage;
let sacrificedObsessionsImage;
let perfectGamesImage;
let paletImage;
let genDamagedImage;



const font = "./assets/Font/BRUTTALL.ttf"
Canvas.registerFont(font, { family: "dbd" })

/* Global objects for perks and characters info */
let survivorPerks = {}
let killerPerks = {}
let survivors = {}
let killers = {}
let rulesEsp = []
let rulesEng = []

/* Const levels */
const Niveles = 3;

/* Calculate states */
const p1 = new Set();
const p2 = new Set();
const p3 = new Set();
const p4 = new Set();
const ps1 = new Set();
const ps2 = new Set();
const ps3 = new Set();
const ps4 = new Set();

/* Number to convert steamID */
const convert = new bigNumber('76561197960265728');

/* Command functions */
let perks3 = {}
let perks2 = {}
let perks1 = {}
let NivelPJ = {}
let DBC = {}
let LC = {}


/* Server config */
let cid = {}
let prefix = {}
let lenguaje = {}
const lobby_set = new Set();


/* Lobby functions */
const r1 = new Set();
const r2 = new Set();
const n1 = {}
const n2 = new Set();
let actualizar = 1;

/* MySQL config */
let db_config = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
}
let con;


client.on("ready", async () => {
  console.log("El bot esta cargando sistemas, base de datos.");
  handleDisconnect();
  loadPerks();
  loadCharacters();
  loadRules();
  await loadImages();
  client.user.setPresence({
    status: "online",
    activity: {
      name: '/help | /ayuda',
      type: "PLAYING"
    }
  });
});



client.on("guildCreate", guild => {

  let defaultChannel = "";
  guild.channels.cache.forEach((channel) => {
    if (channel.type == "text" && defaultChannel == "") {
      if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
        defaultChannel = channel;
      }
    }
  })
  lenguaje[guild.id] = 0
  defaultChannel.send("**Gracias por añadirme!** :white_check_mark:\n**-** Mi prefijo es `/`\n**-** Puedes ver mis comandos con `/ayuda`\n**-** Change the bot language with `/english`")
  client.channels.cache.get('739997803094343721').send('| Nuevo servidor | Nombre: ' + guild.name + ' | Usuarios: ' + guild.memberCount)
})

client.on("message", async (message) => {

  if (message.author.bot) return;
  if (message.webhookID) return;
  if (!message.member) return;

  if (lenguaje[message.guild.id] == 0) {
    if (r2.has(message.author.id)) {
      if (message.content.toLowerCase().includes('killer')) {
        r2.delete(message.author.id)
        LC[message.author.id] = 0;
        if (message.member) message.channel.send('Ingresa cuántas perks a nivel 3 tienes, ' + message.author.tag)
        else message.channel.send('Ingresa cuántas perks a nivel 3 tienes, ' + message.author.tag)
        p1.add(message.author.id)
        return;
      } else if (message.content.toLowerCase().includes('survivor')) {
        r2.delete(message.author.id)
        LC[message.author.id] = 0;
        if (message.member) message.channel.send('Ingresa cuántas perks a nivel 3 tienes, ' + message.author.tag)
        else message.channel.send('Ingresa cuántas perks a nivel 3 tienes, ' + message.author.tag)
        ps1.add(message.author.id)
        return;
      } else return message.channel.send(message.author.tag + ', envía por aquí "**survivor**" o "**killer**" para calcular el valor de todas las perks del que elijas.')
    }
    if (r1.has(message.author.id)) {
      if (message.content > 50 || message.content < 1 || message.content > 50) return message.member.send('El nivel debe ser entre 1 y 50, ' + message.author.tag).catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      if (message.content % 1 != '0') return message.member.send('El nivel no puede tener comas.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      r1.delete(message.author.id)
      n1[message.author.id] = message.content
      message.channel.send('Envía el nivel que quieres obtener en la red de sangre.')
      n2.add(message.author.id)
      return;
    }

    if (n2.has(message.author.id)) {
      n2.delete(message.author.id)
      if (parseInt(message.content) > 50 || parseInt(message.content) < 1 || parseInt(message.content) > 50) return message.member.send('El nivel debe ser entre 1 y 50.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      if (parseInt(message.content) % 1 != '0') return message.member.send('El nivel no puede tener comas.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      if (parseInt(message.content) < n1[message.author.id]) return message.member.send('El nivel deseado no puede ser menor al inicial.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      LC[message.author.id] = 0;
      let initialLevel = parseInt(n1[message.author.id]);
      let finalLevel = parseInt(message.content);
      let sangre = ObtenerValor(initialLevel, finalLevel, message.author.id)
      createLevelImage(message, initialLevel, finalLevel, sangre, lenguaje[message.guild.id])
      return;
    }

    if (p1.has(message.author.id)) {
      if (message.content % 1 != '0') {
        p1.delete(message.author.id)
        message.member.send('El numero no puede tener comas, el calcular se ha cancelado.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        return;
      }
      if (parseInt(message.content) * 3 >= getLength(killerPerks) * 3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      if (parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      p1.delete(message.author.id)
      perks3[message.author.id] = message.content;
      p2.add(message.author.id)
      if (message.member) message.channel.send('Ingresa cuántas perks a nivel 2 tienes, ' + message.author.tag)
      else message.channel.send('Ingresa cuántas perks a nivel 2 tienes, ' + message.author.tag)
      return;
    }

    if (p2.has(message.author.id)) {
      if (message.content % 1 != '0') {
        p2.delete(message.author.id)
        message.member.send('El numero no puede tener comas, el calcular se ha cancelado.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        return;
      }
      if (parseInt(message.content) * 2 >= getLength(killerPerks) * 3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      if (parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      if (perks3[message.author.id] * 3 + parseInt(message.content) * 2 >= getLength(killerPerks) * 3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      p2.delete(message.author.id)
      perks2[message.author.id] = message.content;
      if (message.member) message.channel.send('Ingresa cuántas perks a nivel 1 tienes, ' + message.author.tag)
      else message.channel.send('Ingresa cuántas perks a nivel 1 tienes, ' + message.author.tag)
      p3.add(message.author.id)
      return;
    }

    if (p3.has(message.author.id)) {
      if (message.content % 1 != '0') {
        p3.delete(message.author.id)
        message.member.send('El numero no puede tener comas, el calcular se ha cancelado.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        return;
      }
      if (parseInt(message.content) >= getLength(killerPerks) * 3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      if (parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      if (perks3[message.author.id] * 3 + perks2[message.author.id] * 2 + parseInt(message.content) >= getLength(killerPerks) * 3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      p3.delete(message.author.id)
      perks1[message.author.id] = message.content;
      if (message.member) message.channel.send('Ingresa a qué nivel estás con tu personaje, ' + message.author.tag)
      else message.channel.send('Ingresa a qué nivel estás con tu personaje, ' + message.author.tag)
      p4.add(message.author.id)
      return;
    }

    if (p4.has(message.author.id)) {
      if (message.content % 1 != '0') {
        p4.delete(message.author.id)
        message.member.send('El numero no puede tener comas, el calcular se ha cancelado.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        return;
      }
      if (parseInt(message.content) > 50 || parseInt(message.content) < 1) return message.member.send('Nivel inválido.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      p4.delete(message.author.id)
      NivelPJ[message.author.id] = parseInt(message.content);
      let necesitaperks = getLength(killerPerks) * Niveles - (3 * perks3[message.author.id]) - (2 * perks2[message.author.id]) - perks1[message.author.id];
      DBC[message.author.id] = necesitaperks;
      let NivelValor = ObtenerNP(NivelPJ[message.author.id], message.author.id)
      const embed = new Discord.MessageEmbed()
        .setThumbnail(message.member.user.avatarURL())
        .setAuthor(message.member.displayName + '#' + message.member.user.discriminator, message.member.user.avatarURL())
        .setTitle('| Comprar todas las Perks de Killer |')
        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
        .addField('Puntos de Sangre necesarios <:bp:724724401333076071>', '**' + Coma(NivelValor) + '**', true)
        .addField('Niveles comprados', '**' + LC[message.author.id] + '**', true)
        .setColor(0xFF0000)
      message.channel.send({ embed });
      return;
    }

    if (ps1.has(message.author.id)) {
      if (message.content % 1 != '0') {
        ps1.delete(message.author.id)
        message.member.send('El numero no puede tener comas, el calcular se ha cancelado.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        return;
      }
      if (parseInt(message.content) * 3 >= getLength(survivorPerks) * 3) return message.author.send('No puedes tener todas o más perks de las existentes.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      if (parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      ps1.delete(message.author.id)
      perks3[message.author.id] = message.content;
      ps2.add(message.author.id)
      if (message.member) message.channel.send('Ingresa cuántas perks a nivel 2 tienes, ' + message.author.tag)
      else message.channel.send('Ingresa cuántas perks a nivel 2 tienes, ' + message.author.tag)
      return;
    }

    if (ps2.has(message.author.id)) {
      if (message.content % 1 != '0') {
        ps2.delete(message.author.id)
        message.member.send('El numero no puede tener comas, el calcular se ha cancelado.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        return;
      }
      if (parseInt(message.content) * 2 >= getLength(survivorPerks) * 3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      if (parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      if (perks3[message.author.id] * 3 + parseInt(message.content) * 2 >= getLength(survivorPerks) * 3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      ps2.delete(message.author.id)
      perks2[message.author.id] = message.content;
      if (message.member) message.channel.send('Ingresa cuántas perks a nivel 1 tienes, ' + message.author.tag)
      else message.channel.send('Ingresa cuántas perks a nivel 1 tienes, ' + message.author.tag)
      ps3.add(message.author.id)
      return;
    }

    if (ps3.has(message.author.id)) {
      if (message.content % 1 != '0') {
        ps3.delete(message.author.id)
        message.author.send('El numero no puede tener comas, el calcular se ha cancelado.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        return;
      }
      if (parseInt(message.content) >= getLength(survivorPerks) * 3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      if (parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      if (perks3[message.author.id] * 3 + perks2[message.author.id] * 2 + parseInt(message.content) >= getLength(survivorPerks) * 3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      ps3.delete(message.author.id)
      perks1[message.author.id] = message.content;
      if (message.member) message.channel.send('Ingresa a qué nivel estás con tu personaje, ' + message.author.tag)
      else message.channel.send('Ingresa a qué nivel estás contu personaje, ' + message.author.tag)
      ps4.add(message.author.id)
      return;
    }

    if (ps4.has(message.author.id)) {
      if (message.content % 1 != '0') {
        ps4.delete(message.author.id)
        message.member.send('El numero no puede tener comas, el calcular se ha cancelado.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        return;
      }
      if (parseInt(message.content) > 50 || parseInt(message.content) < 1) return message.member.send('Nivel inválido.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
      ps4.delete(message.author.id)
      NivelPJ[message.author.id] = parseInt(message.content);
      let necesitaperks = getLength(survivorPerks) * Niveles - (3 * perks3[message.author.id]) - (2 * perks2[message.author.id]) - perks1[message.author.id];
      DBC[message.author.id] = necesitaperks;
      let NivelValor = ObtenerNP(NivelPJ[message.author.id], message.author.id)
      const embed = new Discord.MessageEmbed()
        .setThumbnail(message.member.user.avatarURL())
        .setAuthor(message.member.user.username + '#' + message.member.user.discriminator, message.member.user.avatarURL())
        .setTitle('| Comprar todas las Perks de Survivor |')
        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
        .addField('Puntos de Sangre necesarios <:bp:724724401333076071>', '**' + Coma(NivelValor) + '**', true)
        .addField('Niveles comprados', '**' + LC[message.author.id] + '**', true)
        .setColor(0xFF0000)
      message.channel.send({ embed });
      return;
    }
  }
  else {
    if (r2.has(message.author.id)) {
      if (message.content.toLowerCase().includes('killer')) {
        r2.delete(message.author.id)
        LC[message.author.id] = 0;
        if (message.member) message.channel.send('Enter how many level 3 perks you have, ' + message.author.tag)
        else message.channel.send('Enter how many level 3 perks you have, ' + message.author.tag)
        p1.add(message.author.id)
        return;
      } else if (message.content.toLowerCase().includes('survivor')) {
        r2.delete(message.author.id)
        LC[message.author.id] = 0;
        if (message.member) message.channel.send('Enter how many level 3 perks you have, ' + message.author.tag)
        else message.channel.send('Enter how many level 3 perks you have, ' + message.author.tag)
        ps1.add(message.author.id)
        return;
      } else return message.channel.send(message.author.tag + ', send this way "**survivor**" or "**killer**" to calculate the value of all the perks that you enter.')
    }
    if (r1.has(message.author.id)) {
      if (message.content > 50 || message.content < 1 || message.content > 50) return message.member.send('The level must be between 1 and 50, ' + message.author.tag).catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      if (message.content % 1 != '0') return message.member.send('Level can not contain commas.').catch(function (err) { message.channel.send(message.member.user.toString() + '  Activate your private messagges so the bot can inform you.') });
      r1.delete(message.author.id)
      n1[message.author.id] = message.content
      message.channel.send('Enter the level that you want from the bloodweb, ' + message.author.tag)
      n2.add(message.author.id)
      return;
    }

    if (n2.has(message.author.id)) {
      n2.delete(message.author.id)
      if (parseInt(message.content) > 50 || parseInt(message.content) < 1 || parseInt(message.content) > 50) return message.member.send('The level must be between 1 and 50,').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      if (parseInt(message.content) % 1 != '0') return message.member.send('Level can not contain commas.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      if (parseInt(message.content) < n1[message.author.id]) return message.member.send('The level wanted can not be less than the initial level.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      LC[message.author.id] = 0;
      let sangre = ObtenerValor(parseInt(n1[message.author.id]), parseInt(message.content), message.author.id)
      let initialLevel = parseInt(n1[message.author.id]);
      let finalLevel = parseInt(message.content);
      createLevelImage(message, initialLevel, finalLevel, sangre, lenguaje[message.guild.id])
      message.channel.send({ embed });
      return;
    }

    if (p1.has(message.author.id)) {
      if (message.content % 1 != '0') {
        p1.delete(message.author.id)
        message.member.send('The level can not contain dots, the calculate funtion was canceled.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
        return;
      }
      if (parseInt(message.content) * 3 >= getLength(killerPerks) * 3) return message.member.send('You can not have all or more than the existant perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      if (parseInt(message.content) < 0) return message.member.send('You can not have less than 0 perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      p1.delete(message.author.id)
      perks3[message.author.id] = message.content;
      p2.add(message.author.id)
      if (message.member) message.channel.send('Enter how many level 2 perks you have, ' + message.author.tag)
      else message.channel.send('Enter how many level 2 perks you have, ' + message.author.tag)
      return;
    }

    if (p2.has(message.author.id)) {
      if (message.content % 1 != '0') {
        p2.delete(message.author.id)
        message.member.send('The level can not contain dots, the calculate funtion was canceled.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
        return;
      }
      if (parseInt(message.content) * 2 >= getLength(killerPerks) * 3) return message.member.send('You can not have all or more than the existant perks.').catch(function (err) { message.channel.send(message.member.user.toString() + 'Activate your private messagges so the bot can inform you.') });
      if (parseInt(message.content) < 0) return message.member.send('You can not have less than 0 perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      if (perks3[message.author.id] * 3 + parseInt(message.content) * 2 >= getLength(killerPerks) * 3) return message.member.send('You can not have all or more than the existant perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      p2.delete(message.author.id)
      perks2[message.author.id] = message.content;
      if (message.member) message.channel.send('Enter how many level 1 perks you have, ' + message.author.tag)
      else message.channel.send('Enter how many level 1 perks you have, ' + message.author.tag)
      p3.add(message.author.id)
      return;
    }

    if (p3.has(message.author.id)) {
      if (message.content % 1 != '0') {
        p3.delete(message.author.id)
        message.member.send('The number can not contain dots, the calculate function was canceled.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
        return;
      }
      if (parseInt(message.content) >= getLength(killerPerks) * 3) return message.member.send('You can not have all or more than the existant perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      if (parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      if (perks3[message.author.id] * 3 + perks2[message.author.id] * 2 + parseInt(message.content) >= getLength(killerPerks) * 3) return message.member.send('You can not have all or more than the existant perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      p3.delete(message.author.id)
      perks1[message.author.id] = message.content;
      if (message.member) message.channel.send('Enter the level your character is, ' + message.author.tag)
      else message.channel.send('Enter the level your character is, ' + message.author.tag)
      p4.add(message.author.id)
      return;
    }

    if (p4.has(message.author.id)) {
      if (message.content % 1 != '0') {
        p4.delete(message.author.id)
        message.member.send('The number can not contain dots, the calculate function was canceled.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
        return;
      }
      if (parseInt(message.content) > 50 || parseInt(message.content) < 1) return message.member.send('Nivel inválido.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      p4.delete(message.author.id)
      NivelPJ[message.author.id] = parseInt(message.content);
      let necesitaperks = getLength(killerPerks) * Niveles - (3 * perks3[message.author.id]) - (2 * perks2[message.author.id]) - perks1[message.author.id];
      DBC[message.author.id] = necesitaperks;
      let NivelValor = ObtenerNP(NivelPJ[message.author.id], message.author.id)
      const embed = new Discord.MessageEmbed()
        .setThumbnail(message.member.user.avatarURL())
        .setAuthor(message.member.displayName + '#' + message.member.user.discriminator, message.member.user.avatarURL())
        .setTitle('| Buy all the killer perks |')
        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
        .addField('Bloodpoints needed <:bp:724724401333076071>', '**' + Coma(NivelValor) + '**', true)
        .addField('Levels bought', '**' + LC[message.author.id] + '**', true)
        .setColor(0xFF0000)
      message.channel.send({ embed });
      return;
    }

    if (ps1.has(message.author.id)) {
      if (message.content % 1 != '0') {
        ps1.delete(message.author.id)
        message.member.send('The number can not contain dots, the calculate function was canceled.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
        return;
      }
      if (parseInt(message.content) * 3 >= getLength(survivorPerks) * 3) return message.member.send('You can not have all or more than the existant perks.').catch(function (err) { message.channel.send(message.member.user.toString() + 'Activate your private messagges so the bot can inform you.') });
      if (parseInt(message.content) < 0) return message.member.send('You can not have less than 0 perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      ps1.delete(message.author.id)
      perks3[message.author.id] = message.content;
      ps2.add(message.author.id)
      if (message.member) message.channel.send('Enter how many level 2 perks you have, ' + message.author.tag)
      else message.channel.send('Enter how many level 2 perks you have, ' + message.author.tag)
      return;
    }

    if (ps2.has(message.author.id)) {
      if (message.content % 1 != '0') {
        ps2.delete(message.author.id)
        message.member.send('The number can not contain dots, the calculate function was canceled.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
        return;
      }
      if (parseInt(message.content) * 2 >= getLength(survivorPerks) * 3) return message.member.send('You can not have all or more than the existant perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      if (parseInt(message.content) < 0) return message.member.send('You can not have less than 0 perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      if (perks3[message.author.id] * 3 + parseInt(message.content) * 2 >= getLength(survivorPerks) * 3) return message.member.send('You can not have all or more than the existant perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      ps2.delete(message.author.id)
      perks2[message.author.id] = message.content;
      if (message.member) message.channel.send('Enter how many level 1 perks you have, ' + message.author.tag)
      else message.channel.send('Enter how many level 1 perks you have, ' + message.author.tag)
      ps3.add(message.author.id)
      return;
    }

    if (ps3.has(message.author.id)) {
      if (message.content % 1 != '0') {
        ps3.delete(message.author.id)
        message.member.send('The number can not contain dots, the calculate function was canceled.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
        return;
      }
      if (parseInt(message.content) >= getLength(survivorPerks) * 3) return message.member.send('You can not have all or more than the existant perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      if (parseInt(message.content) < 0) return message.member.send('You can not have less than 0 perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      if (perks3[message.author.id] * 3 + perks2[message.author.id] * 2 + parseInt(message.content) >= getLength(survivorPerks) * 3) return message.member.send('You can not have all or more than the existant perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      ps3.delete(message.author.id)
      perks1[message.author.id] = message.content;
      if (message.member) message.channel.send('Enter the level your character is, ' + message.author.tag)
      else message.channel.send('Enter the level your character is, ' + message.author.tag)
      ps4.add(message.author.id)
      return;
    }

    if (ps4.has(message.author.id)) {
      if (message.content % 1 != '0') {
        ps4.delete(message.author.id)
        message.member.send('The number can not contain dots, the calculate function was canceled.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
        return;
      }
      if (parseInt(message.content) > 50 || parseInt(message.content) < 1) return message.member.send('Nivel inválido.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
      ps4.delete(message.author.id)
      NivelPJ[message.author.id] = parseInt(message.content);
      let necesitaperks = getLength(survivorPerks) * Niveles - (3 * perks3[message.author.id]) - (2 * perks2[message.author.id]) - perks1[message.author.id];
      DBC[message.author.id] = necesitaperks;
      let NivelValor = ObtenerNP(NivelPJ[message.author.id], message.author.id)
      const embed = new Discord.MessageEmbed()
        .setThumbnail(message.member.user.avatarURL())
        .setAuthor(message.member.user.username + '#' + message.member.user.discriminator, message.member.user.avatarURL())
        .setTitle('| Buy all the survivor perks |')
        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
        .addField('Bloodpoints needed <:bp:724724401333076071>', '**' + Coma(NivelValor) + '**', true)
        .addField('Levels bought', '**' + LC[message.author.id] + '**', true)
        .setColor(0xFF0000)
      message.channel.send({ embed });
      return;
    }
  }

  const args = message.content.slice(1).trim().split(/ +/g);
  let jejox = args.shift();
  const command = jejox.toLowerCase();
  let texto = args.join(" ");

  if (prefix[message.guild.id] == null) prefix[message.guild.id] = '/';
  if (lenguaje[message.guild.id] == null) lenguaje[message.guild.id] = 0;
  if (message.content.startsWith(prefix[message.guild.id])) {

    if (lenguaje[message.guild.id] == 0) {
      con.query(`UPDATE commands SET count = count + 1 WHERE language = 'spanish'`);
    } else {
      con.query(`UPDATE commands SET count = count + 1 WHERE language = 'english'`);
    }

    console.log(`${message.author.tag} command: ${message.content}`)


    if (lenguaje[message.guild.id] == 0) {
      let channel = client.guilds.cache.get(message.guild.id).channels.cache.get(cid[message.guild.id]);
      if (channel && channel.id != message.channel.id) {
        message.channel.send(`Las utilidades del bot solo pueden ser usadas en el canal de: <#${cid[message.guild.id]}>`)
        return;
      }
      if (p1.has(message.author.id)) p1.delete(message.author.id)
      if (p2.has(message.author.id)) p2.delete(message.author.id)
      if (p3.has(message.author.id)) p3.delete(message.author.id)
      if (p4.has(message.author.id)) p4.delete(message.author.id)

      if (command == 'calcular') {
        if (!texto) return message.member.send('Usa: **' + prefix[message.guild.id] + 'calcular [Opción]** | Opciones: Killer o Survivor | Comando para obtener puntos de sangre necesarios para comprar todas las perks desde el nivel que estés.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        if (p1.has(message.author.id)) return message.member.send('Ya tienes una solicitud abierta.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        if (texto.toLowerCase() == 'killer') p1.add(message.author.id)
        else if (texto.toLowerCase() == 'survivor') ps1.add(message.author.id)
        else return message.member.send('Usa: **' + prefix[message.guild.id] + 'calcular [Opción]** | Opciones: Killer o Survivor | Comando para obtener puntos de sangre necesarios para comprar todas las perks desde el nivel que estés.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        LC[message.author.id] = 0;
        message.channel.send('Ingresa cuántas perks a nivel 3 tienes, ' + message.author.tag)
        return;
      }

      if (command == 'español') return message.channel.send('El bot ya está configurado en español.')
      if (command == 'spanish') return message.channel.send('El bot ya está configurado en español.')

      if (command == 'english') {
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('El comando sólo puede ser usado por personas con permisos de Administrador. || The command can only be used by people with Administrator permissions.')
        lenguaje[message.guild.id] = 1;
        con.query(`SELECT * FROM Servidores WHERE ID = ${message.guild.id}`, (err, rows) => {
          if (err) throw err;
          if (rows.length >= 1) {
            con.query(`UPDATE Servidores SET lenguaje = 1 WHERE ID = ${message.guild.id}`)
          } else {
            con.query(`INSERT INTO Servidores (ID, lenguaje) VALUES ('${message.guild.id}', '1')`)
          }
        })
        message.channel.send('Okay, the bot is fully config in english. If you wanna take it back to spanish use **' + prefix[message.guild.id] + 'spanish** | For assistance use **' + prefix[message.guild.id] + 'help**')
        return;
      }

      if (command == 'sv') {
        if (message.author.id != '277506787261939712' && message.author.id != '313496742156959745' && message.author.id != '389320439932911626' && message.author.id != '169818091281186816') return message.member.send('SACA LA MANO DE AHÍ CARAJO', {
          files: [{
            attachment: 'https://i.ytimg.com/vi/7A6FricobFA/hqdefault.jpg',
            name: "SACA_LA_MANO.jpg"
          }]
        });
        let users = 0;
        client.guilds.cache.forEach((guild) => {
          users += guild.memberCount
        });
        message.channel.send('Estoy actualmente en **' + client.guilds.cache.size + '** servidores.')
        message.channel.send('Y **' + users + '** usuarios tienen acceso a mis funcionalidades.')
        return;
      }

      if (command == 'forzar') {
        if (message.author.id != '277506787261939712' && message.author.id != '313496742156959745' && message.author.id != '389320439932911626' && message.author.id != '169818091281186816') return message.member.send('SACA LA MANO DE AHÍ CARAJO', {
          files: [{
            attachment: 'https://i.ytimg.com/vi/7A6FricobFA/hqdefault.jpg',
            name: "SACA_LA_MANO.jpg"
          }]
        });
        if (texto) forceShrine(texto)
        else verifyShrine(true);
        return;
      }

      if (command == 'cmdcount') {
        if (message.author.id != '277506787261939712' && message.author.id != '313496742156959745' && message.author.id != '389320439932911626' && message.author.id != '169818091281186816') return message.member.send('SACA LA MANO DE AHÍ CARAJO', {
          files: [{
            attachment: 'https://i.ytimg.com/vi/7A6FricobFA/hqdefault.jpg',
            name: "SACA_LA_MANO.jpg"
          }]
        });
        con.query(`SELECT * FROM commands`, (err, rows) => {
          if (err) throw err;
          if (rows.length) {
            message.channel.send(`Comandos usados:\n**${rows[0].language}**: **${rows[0].count}**\n**${rows[1].language}**: **${rows[1].count}**`);
          }
        });
        return
      }

      if (command == 'santuario') {
        con.query(`SELECT * FROM santuario`, async (err, rows) => {
          if (err) throw err;
          let perksName = [rows[0].perk_1.split(":")[0], rows[0].perk_2.split(":")[0], rows[0].perk_3.split(":")[0], rows[0].perk_4.split(":")[0]]
          let perksShard = [rows[0].perk_1.split(":")[1], rows[0].perk_2.split(":")[1], rows[0].perk_3.split(":")[1], rows[0].perk_4.split(":")[1]]
          let perk1 = await getPerkById(perksName[0]);
          let perk2 = await getPerkById(perksName[1]);
          let perk3 = await getPerkById(perksName[2]);
          let perk4 = await getPerkById(perksName[3]);
          if (!perk1 || !perk2 || !perk3 || !perk4) {
            console.log(`Invalid perks in shrine: ${perk1} (${rows[0].perk_1}) | ${perk2} (${rows[0].perk_2}) | ${perk3} (${rows[0].perk_3}) | ${perk4} (${rows[0].perk_4})`)
            message.channel.send("Actualmente no podemos mostrar esta información, por favor reportalo en nuestro Discord en la sección de bugs: https://discord.gg/T6rEERg")
            return
          }
          sendShrine(perk1, perk2, perk3, perk4, perksShard, message.channel, lenguaje[message.guild.id])
        });
        verifyShrine(true);
        return;
      }

      if (command == 'ayuda') {
        if (!texto) {
          createHelpMessage(message);
          return;
        }
        else if (texto == 'admin') {
          if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('El comando sólo puede ser usado por personas con permisos de Administrador.')
          const embedd = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('🔰 Ayuda - Admins 🔰')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .setThumbnail(client.user.avatarURL())
            .addField(prefix[message.guild.id] + 'prefijo [Opción]', 'Reemplaza **Opción** por el prefijo de comandos que te gustaría usar. Default: **/** | Opciones: **!**, **#**, **%**, **&**, **/**, **.** y **-**')
            .addField(prefix[message.guild.id] + 'canal #nombre', 'Sólo puede ser usado por **ADMINISTRADORES**, puedes selecccionar un canal para que los comandos sólo funcionen allí. Usa **' + prefix[message.guild.id] + 'canal borrar** para poder usarlos en cualquier canal nuevamente.')
            .setTimestamp()
            .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL());
          message.member.send(embedd)
          return;
        }
        else if (texto == 'discord') {
          const embedd = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('🔰 ' + prefix[message.guild.id] + 'discord 🔰')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .setThumbnail(client.user.avatarURL())
            .addField('¿Para qué sirve?', 'Este comando te enviará el link para unir el bot al servidor que quieras y poder usarlo allí.')
            .setTimestamp()
            .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL());
          message.member.send(embedd)
          return;
        }
        else if (texto == 'calcular') {
          const embedd = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('🔰 ' + prefix[message.guild.id] + 'calcular [Killer o Survivor] 🔰')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .setThumbnail(client.user.avatarURL())
            .addField('¿Para qué sirve?', 'Este comando es para calcular cuántos __puntos de sangre__ son necesarios para comprar todas las habilidades de todos los personajes. Se te preguntará la cantidad de perks que tengas con un personaje, y en base a eso el bot calculará las faltantes y cuántos puntos de sangre te costaría.')
            .addField('Ejemplo:', 'Si tengo a Meg Thomas sólo con sus 3 perks básicas, cada una a nivel 1 y quiero saber cuánto me costará obtener todas las perks de todos los supervivientes a nivel 3 deberé usar: **' + prefix[message.guild.id] + 'calcular survivor** | Luego el bot me pedirá la cantidad de habilidades que tengo con Meg, y por último me dirá cuánto me costará obtener todas las perks.')
            .setTimestamp()
            .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL());
          message.member.send(embedd)
          return;
        }
        else if (texto == 'stats') {
          const embedd = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('🔰 ' + prefix[message.guild.id] + 'stats [Killer o Survivor] [URL Perfil Steam o Código de amigo] 🔰')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .setThumbnail(client.user.avatarURL())
            .addField('¿Para qué sirve?', 'Podrás obtener las estadísticas de un jugador de Steam de Dead By Daylight, recuerda que debe estar en público todas las configuraciones de privacidad.')
            .addField('Ejemplo:', 'Si quiero ver mis estadísticas de asesino usaré: **' + prefix[message.guild.id] + 'stats killer steamcommunity.com/id/Crltoz/** | El link es el de mi perfil de Steam.')
            .setTimestamp()
            .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL());
          message.member.send(embedd)
          return;
        }
        else if (texto == 'nivel') {
          const embedd = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('🔰 ' + prefix[message.guild.id] + 'nivel [Nivel Actual] [Nivel Deseado] 🔰')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .setThumbnail(client.user.avatarURL())
            .addField('¿Para qué sirve?', 'Calcula los puntos de sangre necesarios para comprar los niveles de la red de sangre que quieras.')
            .addField('Ejemplo:', 'Si con Dwight estoy en nivel 5 y quiero llegar al 20 debo usar: **' + prefix[message.guild.id] + 'nivel 5 20** | El bot me enviará toda la información de los puntos de sangre necesarios y la cantidad de niveles comprados.')
            .setTimestamp()
            .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL());
          message.member.send(embedd)
          return;
        }
        else if (texto == 'lobby') {
          const embedd = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('🔰 ' + prefix[message.guild.id] + 'lobby 🔰')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .setThumbnail(client.user.avatarURL())
            .addField('¿Para qué sirve?', 'El lobby tiene funciones como la de los comandos, pero se utiliza a través de reacciones para que las personas que no les gusta usar comandos puedan usar otra alternativa.')
            .setTimestamp()
            .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL());
          message.member.send(embedd)
          return;
        }
        else if (texto == 'random') {
          const embedd = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('🔰 ' + prefix[message.guild.id] + 'random [Survivor o Killer] 🔰')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .setThumbnail(client.user.avatarURL())
            .addField('¿Para qué sirve?', 'Este comando te dará un asesino o superviviente totalmente aleatorio, con una build de 4 perks al azar.')
            .addField('Ejemplo:', 'Si quiero un superviviente random con 4 habilidades debo usar: **' + prefix[message.guild.id] + 'random survivor** | El bot me enviará un superviviente random con 4 habilidades al azar.')
            .setTimestamp()
            .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL());
          message.member.send(embedd)
          return;
        } else {
          const embedd = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('🔰 Ayuda - Comandos 🔰')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .setThumbnail(client.user.avatarURL())
            .addField(prefix[message.guild.id] + 'discord', 'Para más info: **' + prefix[message.guild.id] + 'ayuda discord**')
            .addField('NOTA:', 'Los paréntesis: **[]** no deben ser usados en los comandos, es simplemente para resaltar cómo se usa el comando.')
            .addField(prefix[message.guild.id] + 'calcular [Killer o Survivor]', 'Para más info: **' + prefix[message.guild.id] + 'ayuda calcular**')
            .addField(prefix[message.guild.id] + 'stats [Survivor o Killer] [URL Perfil Steam o Código de amigo]', 'Para más info: **' + prefix[message.guild.id] + 'ayuda stats**')
            .addField(prefix[message.guild.id] + 'nivel [Nivel Actual] [Nivel Deseado]', 'Para más info: **' + prefix[message.guild.id] + 'ayuda nivel**')
            .addField(prefix[message.guild.id] + 'lobby', 'Para más info: **' + prefix[message.guild.id] + 'ayuda lobby**')
            .addField(prefix[message.guild.id] + 'random [Survivor o Killer]', 'Para más info: **' + prefix[message.guild.id] + 'ayuda random**')
            .addField(prefix[message.guild.id] + 'santuario', 'Te mostrará el santuario de los secretos actual del juego.')
            .addField(prefix[message.guild.id] + 'ayuda admin', 'Mostrará los comandos que pueden ser utilizados por **administradores** para personalizar el bot.')
            .setTimestamp()
            .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL());
          message.channel.send(embedd)
          return;
        }
      }

      if (command == 'prefijo') {
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('El comando sólo puede ser usado por personas con permisos de Administrador.')
        if (!texto) return message.channel.send('Usa **' + prefix[message.guild.id] + 'prefijo [Opción]** | Reemplaza **Opción** por el prefijo de comandos que te gustaría usar. Default: **/** | Opciones: **!**, **#**, **%**, **&**, **/**, **.** y **-**')
        if (texto != '!' && texto != '#' && texto != '%' && texto != '&' && texto != '/' && texto != '.' && texto != '-') return message.channel.send('Usa **/prefijo [Opción]** | Reemplaza **Opción** por el prefijo de comandos que te gustaría usar. Default: **/** | Opciones: **!**, **#**, **%**, **&**, **/**, **.** y **-**')
        con.query(`SELECT * FROM Servidores WHERE ID = ${message.guild.id}`, (err, rows) => {
          if (err) throw err;
          if (rows.length >= 1) {
            con.query(`UPDATE Servidores SET Prefix = '${texto}' WHERE ID = ${message.guild.id}`)
          } else {
            con.query(`INSERT INTO Servidores (ID, cid, prefix) VALUES ('${message.guild.id}', 'null', '${texto}')`)
          }
        })
        prefix[message.guild.id] = texto;
        message.channel.send(`Cambiaste el prefijo para usar comandos a: **${texto}**`)
        return;
      }

      if (command == 'discord') {
        message.channel.send('<:Entityicon:881447186896916500> Agrega el bot a tu servidor con el URL: **https://cutt.ly/entidadbot**')
        return;
      }

      if (command == 'stats') {
        if (!texto) return message.channel.send('Usa: **' + prefix[message.guild.id] + 'stats [Survivor o Killer] [URL Perfil Steam o Código de amigo]**')
        if (args[0].toLowerCase() != 'killer' && args[0].toLowerCase() != 'survivor') return message.channel.send('Usa: **/stats [Survivor o Killer] [URL Perfil Steam]**')
        let isSurv;
        if (args[0].toLowerCase() == 'survivor') isSurv = true
        else if (args[0].toLowerCase() == 'killer') isSurv = false
        if (!args[1]) return message.channel.send('Usa: **' + prefix[message.guild.id] + 'stats [Survivor o Killer] [URL Perfil Steam]**')
        let text = args[1];
        //Perfil con SteamID32
        if (!text.includes('steamcommunity.com/id/') && !text.includes('steamcommunity.com/profiles/')) {
          if (isNaN(args[1])) return message.channel.send('El código de amigo o el URL de perfil de Steam es incorrecto, ' + message.author.tag)
          if (args[1].length < 8) return message.channel.send('El código de amigo es incorrecto, ' + message.author.tag)
          let steamid = steamID_64(args[1])
          getSteamProfile(steamid, message.channel.id, message.author.id, message.guild.id, isSurv, lenguaje[message.guild.id])
          return
        }
        else if (text.includes('steamcommunity.com/profiles/')) {
          //Perfil con SteamID64.
          let steamid = text.slice(text.indexOf("profiles/") + 9, text.length)
          steamid = steamid.replace("/", "")
          getSteamProfile(steamid, message.channel.id, message.author.id, message.guild.id, isSurv, lenguaje[message.guild.id])
          return
        }
        else if (text.includes('steamcommunity.com/id/')) {
          //Perfil con Vanityurl.
          text = text.slice(text.indexOf("/id/") + 4, text.length)
          text = text.replace("/", "")
          let options = {
            host: 'api.steampowered.com',
            path: '/ISteamUser/ResolveVanityURL/v0001/?key=DF0A08E817CCE67F129D35FFFB14901A&vanityurl=' + text,
            headers: { 'User-Agent': 'EntityBot/' + version_bot }
          };
          http.get(options, function (res) {
            let bodyChunks_ = [];
            res.on('data', function (chunk) {
              bodyChunks_.push(chunk);
            }).on('end', function () {
              let body3 = Buffer.concat(bodyChunks_);
              if (res.statusCode == 200 || res.statusCode == 201) {
                body3 = JSON.parse(body3)
                if (isEmptyObject(body3)) return message.author.send("URL de perfil inválido.")
                if (body3.response.success != 1) return message.author.send("URL de perfil inválido.")
                getSteamProfile(body3.response.steamid, message.channel.id, message.author.id, message.guild.id, isSurv, lenguaje[message.guild.id])
              } else return message.author.send("URL de perfil inválido.")
            })
          })
          return
        } else return message.channel.send('Usa: **' + prefix[message.guild.id] + 'stats [Survivor o Killer] [URL Perfil Steam o Código de amigo]**')
      }

      if (command == 'nivel') {
        if (!texto) return message.member.send('Ingresa: **' + prefix[message.guild.id] + 'nivel [Nivel Actual] [Nivel Deseado]** | Te dirá la cantidad de puntos de sangre necesaria para llegar a ese nivel.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        if (parseInt(args[0]) >= parseInt(args[1])) return message.member.send('El nivel deseado no puede ser mayor o igual al que tenes.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        if (parseInt(args[1]) > 50 || parseInt(args[0]) < 1 || parseInt(args[0]) > 50) return message.member.send('El nivel iniciado debe ser entre 1 y 49, y el nivel deseado entre 1 y 50.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        if (parseInt(args[1]) % 1 != '0' || parseInt(args[0]) % 1 != '0') return message.member.send('El nivel no puede tener comas.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        LC[message.author.id] = 0;
        let sangre = ObtenerValor(parseInt(args[0]), parseInt(args[1]), message.author.id)
        createLevelImage(message, args[0], args[1], sangre, lenguaje[message.guild.id])
        return;
      }

      if (command == 'canal') {
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('El comando sólo puede ser usado por personas con permisos de Administrador.')
        if (!texto) return message.member.send('Usa: **' + prefix[message.guild.id] + 'canal #Nombre** | Para setear un canal donde puedan usarse los comandos. Si deseas quitar la restriccion de canales usa **' + prefix[message.guild.id] + 'canal borrar**.')
        if (texto == 'borrar') {
          con.query(`SELECT * FROM Servidores WHERE ID = '${message.guild.id}'`, (err, rows) => {
            if (err) throw err;
            if (rows.length == 1) {
              con.query(`UPDATE Servidores SET cid = 'null' WHERE ID = '${message.guild.id}'`)
            } else {
              con.query(`INSERT INTO Servidores (ID) VALUES ('${message.guild.id}')`)
            }
          })
          cid[message.guild.id] = null;
          message.channel.send('A partir de ahora los comandos funcionan en todos los canales.')
          return;
        }
        let channel_id = message.mentions.channels.first().id
        if (channel_id == null) return message.member.send('Canal inexistente.')
        con.query(`UPDATE Servidores SET cid = '${channel_id}' WHERE ID = '${message.guild.id}'`)
        con.query(`SELECT * FROM Servidores WHERE ID = '${message.guild.id}'`, (err, rows) => {
          if (err) throw err;
          if (rows.length >= 1) {
            con.query(`UPDATE Servidores SET cid = '${channel_id}' WHERE ID = '${message.guild.id}'`)
          } else {
            con.query(`INSERT INTO Servidores (ID, cid) VALUES ('${message.guild.id}', '${channel_id}')`)
          }
        })
        cid[message.guild.id] = channel_id;
        message.channel.send(`A partir de ahora los comandos sólo funcionarán en: <#${channel_id}>`)
        return;
      }

      if (command == 'lobby') {
        if (lobby_set.has(message.author.id)) return message.channel.send(message.member.user.toString() + ', has usado el lobby hace menos de 20 segundos.')
        lobby_set.add(message.author.id)
        let menu_options = []

        menu_options[0] = new disbut.MessageMenuOption()
          .setLabel("Comprar niveles")
          .setEmoji('1⃣')
          .setValue('calculateBloodpoints')
          .setDescription('Calcular puntos de sangre para comprar niveles.');

        menu_options[1] = new disbut.MessageMenuOption()
          .setLabel("Random (superviviente)")
          .setEmoji('2⃣')
          .setValue('randomSurvivor')
          .setDescription('Build con 4 perks y un superviviente random.');

        menu_options[2] = new disbut.MessageMenuOption()
          .setLabel("Random (asesino)")
          .setEmoji('3⃣')
          .setValue('randomKiller')
          .setDescription('Build con 4 perks y un asesino random.');

        menu_options[3] = new disbut.MessageMenuOption()
          .setLabel("Ver ayuda")
          .setEmoji('4⃣')
          .setValue('help')
          .setDescription('Ver todos los comandos y funciones del bot.');

        menu_options[4] = new disbut.MessageMenuOption()
          .setLabel("Invitación del bot")
          .setEmoji('5⃣')
          .setValue('discord')
          .setDescription('Link de invitación para unirme a un Discord.');

        let menu = new disbut.MessageMenu()
          .setID('lobbyMenu')
          .setPlaceholder('➡ Opciones')
          .setMaxValues(1)
          .setMinValues(1)
          .addOptions(menu_options);

        const lembed = new Discord.MessageEmbed()
          .setColor('#FF0000')
          .setTitle('🔰 Lobby 🔰')
          .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
          .setAuthor('Entidad', client.user.avatarURL())
          .setDescription('Selecciona la opción que quieras utilizar en el menú:')
          .setThumbnail(client.user.avatarURL())
          .setTimestamp()
          .setFooter('V' + version_bot + ' - Beta Pública', client.user.avatarURL());
        message.channel.send(lembed, menu)
        setTimeout(() => {
          lobby_set.delete(message.author.id)
        }, 20000);
        return;
      }


      if (command == 'random') {
        if (!texto) return message.member.send('Usa **' + prefix[message.guild.id] + 'random [Survivor o Killer]** || Te retornará un survivor o killer aleatorio con 4 perks.')
        let isSurv, nCharacter, nPerks;
        if (texto.toLowerCase() == 'survivor') isSurv = true
        else if (texto.toLowerCase() == 'killer') isSurv = false
        else return message.member.send('Usa **/random [Survivor o Killer]** || Te retornará un survivor o killer aleatorio con 4 perks.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        let perk1, perk2, perk3, perk4;
        if (isSurv) {
          nCharacter = Math.floor(Math.random() * getLength(survivors));
          nPerks = getRandomNumber(getLength(survivorPerks));
          perk1 = survivorPerks[nPerks.n1];
          perk2 = survivorPerks[nPerks.n2];
          perk3 = survivorPerks[nPerks.n3];
          perk4 = survivorPerks[nPerks.n4];
        } else {
          nCharacter = Math.floor(Math.random() * getLength(killers));
          nPerks = getRandomNumber(getLength(killerPerks));
          perk1 = killerPerks[nPerks.n1];
          perk2 = killerPerks[nPerks.n2];
          perk3 = killerPerks[nPerks.n3];
          perk4 = killerPerks[nPerks.n4];
        }
        createRandomBuild(message, nCharacter, perk1, perk2, perk3, perk4, isSurv, lenguaje[message.guild.id]);
        return;
      }

      if (command == 'tperks') {
        let isSurv, character;
        if (!texto) return message.member.send('Usa ' + prefix[message.guild.id] + 'tperks [Numero de perks a mostrar] [Survivor o Killer]')
        if (args[0] % 4 != 0) return message.member.send('Usa numeros multiplos de 4. Como la tienen a tu hermana')
        if (args[1].toLowerCase() == 'survivor') isSurv = true
        else if (args[1].toLowerCase() == 'killer') isSurv = false
        else return message.member.user('Usa survivor o killer de forma correcta. PD:Zander no lo rompas')
        let perkLength = isSurv ? getLength(survivorPerks) : getLength(killerPerks);
        if (isSurv) {
          character = getLength(survivors) - 1;
          createRandomBuild(message, character, survivorPerks[perkLength - 1], survivorPerks[perkLength - 2], survivorPerks[perkLength - 3], survivorPerks[perkLength - 4], isSurv, lenguaje[message.guild.id])
        }
        else {
          character = getLength(killers) - 1;
          createRandomBuild(message, character, killerPerks[perkLength - 1], killerPerks[perkLength - 2], killerPerks[perkLength - 3], killerPerks[perkLength - 4], isSurv, lenguaje[message.guild.id])
        }
        return
      }

      if (command == 'reglas') {
        let randomNum = Math.floor(Math.random() * rulesEsp.length + 1)
        message.channel.send('> ' + rulesEsp[randomNum], {
          files: [
            {
              attachment: 'https://i.imgur.com/I4LhmO8.png',
              name: 'Survivor_rule_book_for_killers.jpg'
            }
          ]
        })
        return
      }
      message.member.send('El comando no existe. Usa ' + prefix[message.guild.id] + '**ayuda** para ver todas las funciones y comandos.')
    } else {
      if (cid[message.guild.id] != null && message.channel.id != cid[message.guild.id]) {
        message.channel.send(`The bot utilities can only be used in the channel: <#${cid[message.guild.id]}>`)
        return;
      }
      if (p1.has(message.author.id)) p1.delete(message.author.id)
      if (p2.has(message.author.id)) p2.delete(message.author.id)
      if (p3.has(message.author.id)) p3.delete(message.author.id)
      if (p4.has(message.author.id)) p4.delete(message.author.id)

      if (command == 'calculate') {
        if (!texto) return message.member.send('Use: **' + prefix[message.guild.id] + 'calculate [Option]** | Options: Killer or Survivor | This command tells you the amount of bloodpoints that you need to buy all the perks from the level you are.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
        if (p1.has(message.author.id)) return message.member.send('Ya tienes una solicitud abierta.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activa tus mensajes privados para que el bot pueda informarte.') });
        if (texto.toLowerCase() == 'killer') p1.add(message.author.id)
        else if (texto.toLowerCase() == 'survivor') ps1.add(message.author.id)
        else return message.member.send('Use: **' + prefix[message.guild.id] + 'calculate [Option]** | Options: Killer or Survivor | This command tells you the amount of bloodpoints that you need to buy all the perks from the level you are.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
        LC[message.author.id] = 0;
        message.channel.send('Enter how many level 3 perks you have, ' + message.author.tag)
        return;
      }

      if (command == 'shrine') {
        con.query(`SELECT * FROM santuario`, async (err, rows) => {
          if (err) throw err;
          let perksName = [rows[0].perk_1.split(":")[0], rows[0].perk_2.split(":")[0], rows[0].perk_3.split(":")[0], rows[0].perk_4.split(":")[0]]
          let perksShard = [rows[0].perk_1.split(":")[1], rows[0].perk_2.split(":")[1], rows[0].perk_3.split(":")[1], rows[0].perk_4.split(":")[1]]
          let perk1 = await getPerkById(perksName[0])
          let perk2 = await getPerkById(perksName[1])
          let perk3 = await getPerkById(perksName[2])
          let perk4 = await getPerkById(perksName[3])
          if (!perk1 || !perk2 || !perk3 || !perk4) {
            console.log(`Invalid perks in shrine: ${perk1} (${rows[0].perk_1}) | ${perk2} (${rows[0].perk_2}) | ${perk3} (${rows[0].perk_3}) | ${perk4} (${rows[0].perk_4})`)
            message.channel.send("We are currently unable to display this information, please report it on our Discord in the bugs section: https://discord.gg/T6rEERg")
            return
          }
          sendShrine(perk1, perk2, perk3, perk4, perksShard, message.channel, lenguaje[message.guild.id])
        });
        verifyShrine(true);
        return;
      }

      if (command == 'help') {
        if (!texto) {
          createHelpMessage(message)
          return;
        }
        else if (texto == 'admin') {
          if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('This command is only availiable for administrator users.')
          const embedd = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('🔰 Help - Admins 🔰')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .setThumbnail(client.user.avatarURL())
            .addField(prefix[message.guild.id] + 'Prefix [Option]', 'Replace **Option** with the prefix of your choice. Default: **/** | Options: **!**, **#**, **%**, **&**, **/**, **.** y **-**')
            .addField(prefix[message.guild.id] + 'Channel #name', 'This only can be use by **ADMINISTRATOR** users. Just select a channel and the commands will only work there. Use' + prefix[message.guild.id] + '**canal borrar** and the commands will work in every channel.')
            .setTimestamp()
            .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL());
          message.member.send(embedd)
          return;
        }
        else if (texto == 'discord') {
          const embedd = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('🔰 ' + prefix[message.guild.id] + 'discord 🔰')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .setThumbnail(client.user.avatarURL())
            .addField('What is it for?', 'This command will send you a link to join the bot to any discord server and use it there.')
            .setTimestamp()
            .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL());
          message.member.send(embedd)
          return;
        }
        else if (texto == 'calculate') {
          const embedd = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('🔰 ' + prefix[message.guild.id] + 'calculate [Killer or Survivor] 🔰')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .setThumbnail(client.user.avatarURL())
            .addField('What is it for?', 'This command will calculate the amount of __Bloodpoints__ that you need to buy all the perks from a caracter. It will ask you how many perks of each level you have and the bot will calculate counting those perks you dont have and giving you the aproximate cost in Bloodpoints. ')
            .addField('For example:', 'If i have Meg Thomas only with his 3 teacheable perk, each one of them level 1 and i wanna know how many bloodpoints it will cost to buy all the perks availeable at level 3, just using: **' + prefix[message.guild.id] + 'calculate survivor** | Then the bot will ask the amaount of perks that i have with Meg and then it will tell me how much it will cost.')
            .setTimestamp()
            .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL());
          message.member.send(embedd)
          return;
        }
        else if (texto == 'stats') {
          const embedd = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('🔰 ' + prefix[message.guild.id] + 'stats [Killer or Survivor] [Steam profile URL or Steam friend code] 🔰')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .setThumbnail(client.user.avatarURL())
            .addField('What is it for?', 'It will tell you specific stats of a Dead by Daylight Steam player, remember that the steam profile privacy config must be all public.')
            .addField('For example:', ' If i wanna see my killer stats i use: **' + prefix[message.guild.id] + 'stats killer steamcommunity.com/id/Creepzstah** | This link is from my steam profile.')
            .setTimestamp()
            .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL());
          message.member.send(embedd)
          return;
        }
        else if (texto == 'level') {
          const embedd = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('🔰 ' + prefix[message.guild.id] + 'level [Current Level] [Level wanted] 🔰')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .setThumbnail(client.user.avatarURL())
            .addField('What is it for?', 'It calculate the amaount of Bloodpoints to buy those levels of bloodweb you want.')
            .addField('For example:', 'You have Dwight level 5 and you wanna level it up to 20 just use: **' + prefix[message.guild.id] + 'level 5 20** | The bot will tell you the amaunt of bloodpoints needed and how many levels you wanna buy.')
            .setTimestamp()
            .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL());
          message.member.send(embedd)
          return;
        }
        else if (texto == 'lobby') {
          const embedd = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('🔰 ' + prefix[message.guild.id] + 'lobby 🔰')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .setThumbnail(client.user.avatarURL())
            .addField('What is it for?', 'The lobby works like the commands, but using reactions for those users that doesnt like using commands.')
            .setTimestamp()
            .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL());
          message.member.send(embedd)
          return;
        }
        else if (texto == 'random') {
          const embedd = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('🔰 ' + prefix[message.guild.id] + 'random [Survivor or Killer] 🔰')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .setThumbnail(client.user.avatarURL())
            .addField('What is it for?', 'It will show you a random 4 perk build for a random killer or survivor.')
            .addField('For example:', 'If you want a random survivor 4 perk build just use: **' + prefix[message.guild.id] + 'random survivor** | The bot will send a random survivor 4 perk build.')
            .setTimestamp()
            .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL());
          message.member.send(embedd)
          return;
        } else {
          const embedd = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('🔰 Help - Commands 🔰')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .setThumbnail(client.user.avatarURL())
            .addField(prefix[message.guild.id] + 'discord', 'More info: **' + prefix[message.guild.id] + 'help discord**')
            .addField('BTW:', 'Brackets **[]** should not be used, only use spacebar between words.')
            .addField(prefix[message.guild.id] + 'calculate [Killer or Survivor]', 'More info: **' + prefix[message.guild.id] + 'help calculate**')
            .addField(prefix[message.guild.id] + 'stats [Survivor or Killer] [Steam profile URL or Steam friend code]', 'More info: **' + prefix[message.guild.id] + 'help stats**')
            .addField(prefix[message.guild.id] + 'level [Current Level] [Level wanted]', 'More info: **' + prefix[message.guild.id] + 'help level**')
            .addField(prefix[message.guild.id] + 'lobby', 'More info: **' + prefix[message.guild.id] + 'help lobby**')
            .addField(prefix[message.guild.id] + 'random [Survivor or Killer]', 'More info: **' + prefix[message.guild.id] + 'help random**')
            .addField(prefix[message.guild.id] + 'shrine', 'It will show you the shrine of secrets that is current in the game.')
            .addField(prefix[message.guild.id] + 'help admin', 'It will show you the commands that can only be use by **administrators** to customize the bot.')
            .setTimestamp()
            .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL());
          message.channel.send(embedd)
          return;
        }
      }

      if (command == 'prefix') {
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('The command can only be used by a administrator user.')
        if (!texto) return message.channel.send('Use **' + prefix[message.guild.id] + 'prefix [Option]** | Replace **Option** with the prefix of your choice. Default: **/** | Options: **!**, **#**, **%**, **&**, **/**, **.** and **-**')
        if (texto != '!' && texto != '#' && texto != '%' && texto != '&' && texto != '/' && texto != '.' && texto != '-') return message.channel.send('Use **/prefix [Option]** | Replace **Option** with the prefix of your choice. Default: **/** | Options: **!**, **#**, **%**, **&**, **/**, **.** and **-**')
        con.query(`SELECT * FROM Servidores WHERE ID = ${message.guild.id}`, (err, rows) => {
          if (err) throw err;
          if (rows.length >= 1) {
            con.query(`UPDATE Servidores SET Prefix = '${texto}' WHERE ID = ${message.guild.id}`)
          } else {
            con.query(`INSERT INTO Servidores (ID, cid, prefix) VALUES ('${message.guild.id}', 'null', '${texto}')`)
          }
        })
        prefix[message.guild.id] = texto;
        message.channel.send(`You have changed the commands prefix to: **${texto}**`)
        return;
      }

      if (command == 'discord') {
        message.channel.send('<:Entityicon:881447186896916500> Add the bot to your discord server here: **https://cutt.ly/entidadbot** ')
        return;
      }

      if (command == 'english') return message.channel.send('The bot is fully config in english')
      if (command == 'spanish') {
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('El comando sólo puede ser usado por personas con permisos de Administrador. || The command can only be used by administrator users.')
        lenguaje[message.guild.id] = 0;
        con.query(`SELECT * FROM Servidores WHERE ID = ${message.guild.id}`, (err, rows) => {
          if (err) throw err;
          if (rows.length >= 1) {
            con.query(`UPDATE Servidores SET lenguaje = 0 WHERE ID = ${message.guild.id}`)
          } else {
            con.query(`INSERT INTO Servidores (ID, lenguaje) VALUES ('${message.guild.id}', '0')`)
          }
        })
        message.channel.send('Bien, el bot está configurado en español. Si desea volver a inglés use **' + prefix[message.guild.id] + 'english**. Para consultar los comandos use **' + prefix[message.guild.id] + 'ayuda**.')
        return;
      }
      if (command == 'rules') {
        let randomNum = Math.floor(Math.random() * rulesEng.length + 1)
        message.channel.send('> ' + rulesEng[randomNum], {
          files: [
            {
              attachment: 'https://i.imgur.com/I4LhmO8.png',
              name: 'Survivor_rule_book_for_killers.jpg'
            }
          ]
        })
        return
      }

      if (command == 'stats') {
        if (!texto) return message.channel.send('Use: **' + prefix[message.guild.id] + 'stats [Survivor or Killer] [Steam profile URL or Steam friend code]**')
        if (args[0].toLowerCase() != 'killer' && args[0].toLowerCase() != 'survivor') return message.channel.send('Use: **/stats [Survivor or Killer] [Steam profile URL]**')
        let isSurv;
        if (args[0].toLowerCase() == 'survivor') isSurv = true
        else if (args[0].toLowerCase() == 'killer') isSurv = false
        if (!args[1]) return message.channel.send('Usa: **' + prefix[message.guild.id] + 'stats [Survivor o Killer] [URL Perfil Steam]**')
        let text = args[1];
        //Perfil con SteamID32
        if (!text.includes('steamcommunity.com/id/') && !text.includes('steamcommunity.com/profiles/')) {
          if (isNaN(args[1])) return message.channel.send('Steam profile URL or friend code is not correct, ' + message.author.tag)
          if (args[1].length < 8) return message.channel.send('Steam friend code is not correct, ' + message.author.tag)
          let steamid = steamID_64(args[1])
          getSteamProfile(steamid, message.channel.id, message.author.id, message.guild.id, isSurv, lenguaje[message.guild.id])
          return
        }
        else if (text.includes('steamcommunity.com/profiles/')) {
          //Perfil con SteamID64.
          let steamid = text.slice(28, text.length)
          getSteamProfile(steamid, message.channel.id, message.author.id, message.guild.id, isSurv, lenguaje[message.guild.id])
          return
        }
        else if (text.includes('steamcommunity.com/id/')) {
          //Perfil con Vanityurl.
          text = text.slice(text.indexOf("/id/") + 4, text.length)
          text = text.replace("/", "")
          let options = {
            host: 'api.steampowered.com',
            path: '/ISteamUser/ResolveVanityURL/v0001/?key=DF0A08E817CCE67F129D35FFFB14901A&vanityurl=' + text,
            headers: { 'User-Agent': 'EntityBot/' + version_bot }
          };
          http.get(options, function (res) {
            let bodyChunks_ = [];
            res.on('data', function (chunk) {
              bodyChunks_.push(chunk);
            }).on('end', function () {
              let body3 = Buffer.concat(bodyChunks_);
              if (res.statusCode == 200 || res.statusCode == 201) {
                body3 = JSON.parse(body3)
                if (isEmptyObject(body3)) return message.author.send("Invalid URL Profile.")
                if (body3.response.success != 1) return message.author.send("Invalid URL Profile.")
                getSteamProfile(body3.response.steamid, message.channel.id, message.author.id, message.guild.id, isSurv, lenguaje[message.guild.id])
              } else return message.author.send("Invalid URL Profile.")
            })
          })
          return
        } else return message.channel.send('Use: **' + prefix[message.guild.id] + 'stats [Survivor or Killer] [Steam profile URL or Steam friend code]**')
      }

      if (command == 'level') {
        if (!texto) return message.member.send('Enter: **' + prefix[message.guild.id] + 'level [Current Level] [Level wanted]** | It will tell you the amount of bloodpoints needed to reach that level.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
        if (parseInt(args[0]) >= parseInt(args[1])) return message.member.send('The wanted level can not be higher that the current level.').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
        if (parseInt(args[1]) > 50 || parseInt(args[0]) < 1 || parseInt(args[0]) > 50) return message.member.send('The current level must be between 1 and 49 and the wanted level must be between 1 and 50.').catch(function (err) { message.channel.send(message.member.user.toString() + '  Activate your private messagges so the bot can inform you.') });
        if (parseInt(args[1]) % 1 != '0' || parseInt(args[0]) % 1 != '0') return message.member.send('Level can not contain commas').catch(function (err) { message.channel.send(message.member.user.toString() + ' Activate your private messagges so the bot can inform you.') });
        LC[message.author.id] = 0;
        let sangre = ObtenerValor(parseInt(args[0]), parseInt(args[1]), message.author.id)
        createLevelImage(message, args[0], args[1], sangre, lenguaje[message.guild.id])
        return;
      }

      if (command == 'channel') {
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('The command is only availiable for administrator users.')
        if (!texto) return message.member.send('Use: **' + prefix[message.guild.id] + 'channel #Name** | To set the channel where the commands can be used. If u wanna take back the channel selected use' + prefix[message.guild.id] + 'channel delete')
        if (texto == 'delete') {
          con.query(`SELECT * FROM Servidores WHERE ID = '${message.guild.id}'`, (err, rows) => {
            if (err) throw err;
            if (rows.length == 1) {
              con.query(`UPDATE Servidores SET cid = 'null' WHERE ID = '${message.guild.id}'`)
            } else {
              con.query(`INSERT INTO Servidores (ID) VALUES ('${message.guild.id}')`)
            }
          })
          cid[message.guild.id] = null;
          message.channel.send('From now on the commands will work in every channel.')
          return;
        }
        let channel_id = message.mentions.channels.first().id
        if (channel_id == null) return message.member.send('Nonexistent channel.')
        con.query(`UPDATE Servidores SET cid = '${channel_id}' WHERE ID = '${message.guild.id}'`)
        con.query(`SELECT * FROM Servidores WHERE ID = '${message.guild.id}'`, (err, rows) => {
          if (err) throw err;
          if (rows.length >= 1) {
            con.query(`UPDATE Servidores SET cid = '${channel_id}' WHERE ID = '${message.guild.id}'`)
          } else {
            con.query(`INSERT INTO Servidores (ID, cid) VALUES ('${message.guild.id}', '${channel_id}')`)
          }
        })
        cid[message.guild.id] = channel_id;
        let canal = client.channels.cache.get(channel_id)
        message.channel.send('From now on the commans will work in: ' + canal)
        return;
      }

      if (command == 'lobby') {
        if (lobby_set.has(message.author.id)) return message.channel.send(message.member.user.toString() + ', You used the lobby less than 20 seconds ago.')
        lobby_set.add(message.author.id)
        let menu_options = []

        menu_options[0] = new disbut.MessageMenuOption()
          .setLabel("Buy bloodweb levels")
          .setEmoji('1⃣')
          .setValue('calculateBloodpoints')
          .setDescription('Calculate bloodpoints to buy levels.');

        menu_options[1] = new disbut.MessageMenuOption()
          .setLabel("Random survivor")
          .setEmoji('2⃣')
          .setValue('randomSurvivor')
          .setDescription('Build with 4 perks and survivor random.');

        menu_options[2] = new disbut.MessageMenuOption()
          .setLabel("Random killer")
          .setEmoji('3⃣')
          .setValue('randomKiller')
          .setDescription('Build with 4 perks and killer random.');

        menu_options[3] = new disbut.MessageMenuOption()
          .setLabel("Help")
          .setEmoji('4⃣')
          .setValue('help')
          .setDescription('See all commands and functions.');

        menu_options[4] = new disbut.MessageMenuOption()
          .setLabel("Bot invitation")
          .setEmoji('5⃣')
          .setValue('discord')
          .setDescription('Link to invite bot to your own discord server.');

        let menu = new disbut.MessageMenu()
          .setID('lobbyMenu')
          .setPlaceholder('➡ Options')
          .setMaxValues(1)
          .setMinValues(1)
          .addOptions(menu_options);

        const lembed = new Discord.MessageEmbed()
          .setColor('#FF0000')
          .setTitle('🔰 Lobby 🔰')
          .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
          .setAuthor('Entity', client.user.avatarURL())
          .setDescription('Select the option in the menu:')
          .setThumbnail(client.user.avatarURL())
          .setTimestamp()
          .setFooter('V' + version_bot + ' - Public Beta', client.user.avatarURL());
        message.channel.send(lembed, menu)
        setTimeout(() => {
          lobby_set.delete(message.author.id)
        }, 20000);
        return;
      }

      if (command == 'random') {
        if (!texto) return message.member.send('Use **' + prefix[message.guild.id] + 'random [Survivor or Killer]** || It will give you a random 4 perk build for a survivor or killer.')
        let isSurv, nCharacter, nPerks;
        if (texto.toLowerCase() == 'survivor') isSurv = true
        else if (texto.toLowerCase() == 'killer') isSurv = false
        else return message.member.send('Use **' + prefix[message.guild.id] + 'random [Survivor or Killer]** || It will give you a random 4 perk build for a survivor or killer.')
        let perk1, perk2, perk3, perk4;
        if (isSurv) {
          nCharacter = Math.floor(Math.random() * getLength(survivors));
          nPerks = getRandomNumber(getLength(survivorPerks));
          perk1 = survivorPerks[nPerks.n1];
          perk2 = survivorPerks[nPerks.n2];
          perk3 = survivorPerks[nPerks.n3];
          perk4 = survivorPerks[nPerks.n4];
        } else {
          nCharacter = Math.floor(Math.random() * getLength(killers));
          nPerks = getRandomNumber(getLength(killerPerks));
          perk1 = killerPerks[nPerks.n1];
          perk2 = killerPerks[nPerks.n2];
          perk3 = killerPerks[nPerks.n3];
          perk4 = killerPerks[nPerks.n4];
        }
        createRandomBuild(message, nCharacter, perk1, perk2, perk3, perk4, isSurv, lenguaje[message.guild.id]);
        return;
      }

      message.member.send('The command doesnt exists. Use **' + prefix[message.guild.id] + 'help** to see all the funtions and commands')
    }
  }
});

client.on('clickMenu', async (menu) => {
  if (menu.id == "lobbyMenu") {
    switch (menu.values[0]) {
      case "calculateBloodpoints": {
        await menu.reply.think()
        r1.add(menu.clicker.id)
        if (lenguaje[menu.message.guild.id] == 0) menu.reply.edit('Envía por aquí el nivel inicial de la red de sangre en el que estás, ' + menu.clicker.user.tag)
        else menu.reply.edit('Enter the level that you want from the bloodweb, ' + menu.clicker.user.tag)
        break;
      }
      case "randomSurvivor": {
        await menu.reply.think();
        let nCharacter = Math.floor(Math.random() * getLength(survivors));
        let nPerks = getRandomNumber(getLength(survivorPerks));
        let think = menu.reply;
        let perk1 = survivorPerks[nPerks.n1];
        let perk2 = survivorPerks[nPerks.n2];
        let perk3 = survivorPerks[nPerks.n3];
        let perk4 = survivorPerks[nPerks.n4];
        createRandomBuild(menu.message, nCharacter, perk1, perk2, perk3, perk4, true, lenguaje[menu.message.guild.id], think)
        break;
      }
      case "randomKiller": {
        await menu.reply.think();
        let think = menu.reply;
        let nCharacter = Math.floor(Math.random() * getLength(killers));
        let nPerks = getRandomNumber(getLength(killerPerks));
        let perk1 = killerPerks[nPerks.n1];
        let perk2 = killerPerks[nPerks.n2];
        let perk3 = killerPerks[nPerks.n3];
        let perk4 = killerPerks[nPerks.n4];
        createRandomBuild(menu.message, nCharacter, perk1, perk2, perk3, perk4, false, lenguaje[menu.message.guild.id], think);
        break;
      }
      case "help": {
        await menu.reply.think()
        createHelpMessage(menu.message, menu.reply);
        break;
      }

      case "discord": {
        await menu.reply.think()
        if (lenguaje[menu.message.guild.id] == 0) menu.reply.edit('<:Entityicon:881447186896916500> Añade el bot en tu propio servidor de Discord: **https://cutt.ly/entidadbot** ')
        else menu.reply.edit('<:Entityicon:881447186896916500> Add the bot to your discord server here: **https://cutt.ly/entidadbot** ')
        break;
      }
    }
  }
});

async function createLevelImage(message, initialLevel, targetLevel, bloodpoints, language) {
  const canvas = Canvas.createCanvas(541, 447);
  const ctx = canvas.getContext('2d');
  let fontSize = 10
  ctx.drawImage(backgroundLevel, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#74037b';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Slightly smaller text placed above the member's display name
  ctx.font = '50px "dbd"';
  ctx.fillStyle = '#ffffff';
  let levelHeader = language == 0 ? "Nivel" : "Level"

  ctx.fillText(levelHeader, calculateCenter(270, levelHeader.length, fontSize), 75);
  ctx.fillText(initialLevel, calculateCenter(113, initialLevel.toString().length, fontSize), 210);
  ctx.fillText(targetLevel, calculateCenter(419, targetLevel.toString().length, fontSize), 213);
  ctx.fillText(Coma(bloodpoints), calculateCenter(290, bloodpoints.toString().length, fontSize), 355);

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'calculate-image.png');
  message.channel.send('‎      ‏‏‎', attachment)
}

function ObtenerValor(nivel, Deseado, id) {
  let total = 0;
  for (let x = nivel; x <= Deseado; x++) {
    if (x == Deseado) break;
    LC[id] = LC[id] + 1;
    if (x >= 1 && x <= 9) total = total + 12000;
    if (x >= 10 && x <= 19) total = total + 24000;
    if (x >= 20 && x <= 29) total = total + 34000;
    if (x >= 30 && x <= 39) total = total + 40000;
    if (x >= 40 && x <= 50) total = total + 50000;
  }
  return total;
}

function ObtenerNP(nivel, id) {
  let total = 0;
  let x = nivel;
  while (DBC[id] != 0) {
    LC[id] = LC[id] + 1;
    if (x >= 1 && x <= 9) {
      total = total + 12000;
      DBC[id] = DBC[id] - 1;
      x = x + 1;
      if (DBC[id] == 1) {
        DBC[id] = DBC[id] - 1;
        break;
      }
    }
    if (x >= 10 && x <= 19) {
      total = total + 24000;
      DBC[id] = DBC[id] - 1;
      x = x + 1;
      if (DBC[id] == 1) {
        DBC[id] = DBC[id] - 1;
        break;
      }
    }
    if (x >= 20 && x <= 29) {
      total = total + 34000;
      DBC[id] = DBC[id] - 1;
      x = x + 1;
      if (DBC[id] == 1) {
        DBC[id] = DBC[id] - 1;
        break;
      }
    }
    if (x >= 30 && x <= 39) {
      total = total + 40000;
      DBC[id] = DBC[id] - 1;
      x = x + 1;
      if (DBC[id] == 1) {
        DBC[id] = DBC[id] - 1;
        break;
      }
    }
    if (x >= 40 && x <= 50) {
      if (x == 50) {
        x = x - 1;
      }
      x = x + 1;
      total = total + 50000;
      if (DBC[id] == 1) {
        DBC[id] = DBC[id] - 1;
        break;
      }
      DBC[id] = DBC[id] - 2;
    }
  }
  return total;
}


/**
 * @param {BigInt64Array} channel - Channel ID to send Embed Stats.
 * @param {Boolean} isSurv - true = survivor | false = killer
 * @param {ObjectConstructor} data_steam - Steam profile data.
 * @param {ObjectConstructor} data_dbd - DBD Stats from profile steam.
 * @param {Int8Array} language - 0 = spanish | 1 = english

 * @description - Send embed stats with all info.
 */
async function sendEmbedStats(channel, isSurv, data_steam, data_dbd, language) {
  if (!isSurv) {
    const canvas = Canvas.createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d');
    let fontSize = 10;
    ctx.drawImage(backgroundStatsKiller, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Statistics centered
    ctx.font = '80px "dbd"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(texts.stats.statistics[language], calculateCenter(910, texts.stats.statistics[language].length, fontSize), 75);

    // Killer logo
    ctx.drawImage(killerImage, 900, 150, 128, 128);

    // Hours
    ctx.font = '50px "dbd"';
    ctx.fillText(texts.stats.hoursPlayed[language] + Coma(parseInt(data_dbd.playtime / 60)), 230, 180);

    // Bloodpoints
    ctx.drawImage(bpImage, 25, 230, 64, 64);
    ctx.font = '50px "dbd"';
    ctx.fillText(Coma(data_dbd.bloodpoints), 100, 280);

    // Kills
    ctx.drawImage(killsImage, 25, 330, 64, 64);
    ctx.fillText(texts.stats.kills[language] + data_dbd.killed, 100, 380);

    // Sacrificed
    ctx.drawImage(sacrificedImage, 25, 430, 64, 64);
    ctx.fillText(texts.stats.sacrificed[language] + data_dbd.sacrificed, 100, 480);

    // Sacrificed obsessions
    ctx.drawImage(sacrificedObsessionsImage, 25, 530, 64, 64);
    ctx.fillText(texts.stats.sacrificedObessions[language] + data_dbd.sacrificed_obsessions, 100, 580);

    // Perfect games
    ctx.drawImage(perfectGamesImage, 25, 630, 64, 64);
    ctx.fillText(texts.stats.perfectGames[language] + data_dbd.killer_perfectgames, 100, 680);

    // Full load out
    ctx.drawImage(paletImage, 25, 730, 64, 64);
    ctx.fillText(texts.stats.killerFullLoadout[language] + data_dbd.killer_fullloadout, 100, 780);

    // Gens damaged
    ctx.drawImage(genDamagedImage, 25, 830, 64, 64);
    ctx.fillText(texts.stats.gensDamaged[language] + data_dbd.gensdamagedwhileonehooked, 100, 880);

    // Survivors grabbed
    ctx.drawImage(carryImage, 25, 930, 64, 64);
    ctx.fillText(texts.stats.survivorsGrabbed[language] + data_dbd.survivorsgrabbedrepairinggen, 100, 980);

    // profile name
    ctx.fillStyle = '#E52121';
    ctx.font = '70px "dbd"';
    ctx.fillText(data_steam.personaname, 230, 110);

    // Draw circle
    ctx.beginPath();
    ctx.arc(125, 125, 80, 0, Math.PI * 2, true);
    ctx.strokeStyle = '#F32C2C';
    ctx.lineWidth = 8;
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(data_steam.avatarfull);
    ctx.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'stats-image.jpg');
    let flagOrSteam = data_steam.loccountrycode ? `:flag_${data_steam.loccountrycode.toLowerCase()}:` : "<:steam:914663956860248134>";
    client.channels.cache.get(channel).send(`${flagOrSteam} **${data_steam.personaname}** | ${texts.stats.seeFullStatistics[language]} https://dbd.onteh.net.au/playerstats/${data_steam.steamid}`, attachment);
  } else {
    const canvas = Canvas.createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d');
    let fontSize = 10;
    ctx.drawImage(backgroundStatsSurvivor, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Statistics centered
    ctx.font = '80px "dbd"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(texts.stats.statistics[language], calculateCenter(910, texts.stats.statistics[language].length, fontSize), 75);

    // Killer logo
    ctx.drawImage(survivorImage, 900, 150, 128, 128);

    // Hours
    ctx.font = '50px "dbd"';
    ctx.fillText(texts.stats.hoursPlayed[language] + Coma(parseInt(data_dbd.playtime / 60)), 230, 180);

    // Bloodpoints
    ctx.drawImage(bpImage, 25, 230, 64, 64);
    ctx.font = '50px "dbd"';
    ctx.fillText(Coma(data_dbd.bloodpoints), 100, 280);

    // Kills
    ctx.drawImage(killsImage, 25, 330, 64, 64);
    ctx.fillText(texts.stats.perfectGames[language] + data_dbd.survivor_perfectgames, 100, 380);

    // Sacrificed
    ctx.drawImage(sacrificedImage, 25, 430, 64, 64);
    ctx.fillText(texts.stats.gensRepaired[language] + data_dbd.gensrepaired, 100, 480);

    // Sacrificed obsessions
    ctx.drawImage(sacrificedObsessionsImage, 25, 530, 64, 64);
    ctx.fillText(texts.stats.survivorsHealed[language] + data_dbd.survivorshealed, 100, 580);

    // Perfect games
    ctx.drawImage(perfectGamesImage, 25, 630, 64, 64);
    ctx.fillText(texts.stats.skillchecks[language] + data_dbd.skillchecks, 100, 680);

    // Stuns
    ctx.drawImage(paletImage, 25, 730, 64, 64);
    ctx.fillText(texts.stats.escaped[language] + data_dbd.escaped, 100, 780);

    // Gens damaged
    ctx.drawImage(genDamagedImage, 25, 830, 64, 64);
    ctx.fillText(texts.stats.hexTotemsCleansed[language] + data_dbd.hextotemscleansed, 100, 880);

    // Survivors grabbed
    ctx.drawImage(carryImage, 25, 930, 64, 64);
    ctx.fillText(texts.stats.exitGatesOpened[language] + data_dbd.exitgatesopened, 100, 980);

    // profile name
    ctx.fillStyle = '#E52121';
    ctx.font = '70px "dbd"';
    ctx.fillText(data_steam.personaname, 230, 110);

    // Draw circle
    ctx.beginPath();
    ctx.arc(125, 125, 80, 0, Math.PI * 2, true);
    ctx.strokeStyle = '#F32C2C';
    ctx.lineWidth = 8;
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(data_steam.avatarfull);
    ctx.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'stats-image.jpg');
    let flagOrSteam = data_steam.loccountrycode ? `:flag_${data_steam.loccountrycode.toLowerCase()}:` : "<:steam:914663956860248134>";
    client.channels.cache.get(channel).send(`${flagOrSteam} **${data_steam.personaname}** | ${texts.stats.seeFullStatistics[language]} https://dbd.onteh.net.au/playerstats/${data_steam.steamid}`, attachment);
  }
  return
}


/**
 * @param {Int8Array} type - 1 = Update in progress | 2 = Account Private. | 3 = Unknown error.
 * @param {ObjectConstructor} user - User object.
 * @param {BigInt64Array} channel - Channel ID to send embed.
 * @param {Int8Array} language - 0 = spanish | 1 = english.
 * @description - Send embed error with information.
 */
function sendEmbedError(type, user, channel, language) {
  if (language == 0) {
    switch (type) {
      case 1: {
        const embedd = new Discord.MessageEmbed()
          .setColor('#FF0000')
          .setTitle('Cuenta en actualización...')
          .setAuthor(user.user.tag, user.user.avatarURL())
          .setThumbnail(user.user.avatarURL())
          .addField('¿Hay algún problema?', 'Parece ser que tu cuenta estuvo en privado anteriormente, aunque no tienes de qué preocuparte. ¡Ya está siendo actualizada! Prueba cada **10** minutos obtener tus estadísticas.')
          .setTimestamp()
          .setFooter('La entidad', client.user.avatarURL());
        client.channels.cache.get(channel).send(embedd)
        break;
      }
      case 2: {
        const embedd = new Discord.MessageEmbed()
          .setColor('#FF0000')
          .setTitle('¡Ups! Esto es vergonzoso...')
          .setAuthor(user.user.tag, user.user.avatarURL())
          .setThumbnail(user.user.avatarURL())
          .addField('Al parecer tu cuenta está en privada.', 'Recuerda tener todas las opciones de privacidad en público.')
          .addField('¿Ya cambiaste todas tus configuraciones a público y sigues sin aparecer?', 'Normalmente al pasar tu perfil a público, puede tardar desde 24 a 48 horas en actualizar tus datos la web (ajeno a nosotros).')
          .addField('Si siempre tuviste todo en público y no funciona:', 'Revisa esta imagen y asegurate de tener todo en orden.')
          .setTimestamp()
          .setImage('https://cdn.discordapp.com/attachments/738848207328772237/739269462510796800/unknown.png')
          .setFooter('La entidad', client.user.avatarURL());
        client.channels.cache.get(channel).send(embedd)
        break;
      }
      case 3: {
        const embedd = new Discord.MessageEmbed()
          .setColor('#FF0000')
          .setTitle('No podemos agregar tu cuenta...')
          .setAuthor(user.user.tag, user.user.avatarURL())
          .setThumbnail(client.user.avatarURL())
          .addField('Tenemos problemas con la web.', 'Actualmente, por muchas peticiones, la web no nos permite postear cuentas, por lo que deberás hacerlo apretando el botón de abajo y pegando tu link de perfil. Luego de ponerla ya podrás ver tus **/stats** por aquí sin problema.')
          .addField('Agregar cuenta:', '[Haz click aquí](https://dbd.onteh.net.au)')
          .setTimestamp()
          .setFooter('La entidad', client.user.avatarURL())
        client.channels.cache.get(channel).send(embedd)
        break;
      }
    }
  } else {
    switch (type) {
      case 1: {
        const embedd = new Discord.MessageEmbed()
          .setColor('#FF0000')
          .setTitle('Your account is being updated...')
          .setAuthor(user.user.tag, user.user.avatarURL())
          .setThumbnail(user.user.avatarURL())
          .addField('Is there any problem?', 'Seems like your account was private previously, but dont worry. Your account is being updated! Try again every **10** minutes to get your statistics.')
          .setTimestamp()
          .setFooter('Entity', client.user.avatarURL());
        client.channels.cache.get(channel).send(embedd)
        break;
      }
      case 2: {
        const embedd = new Discord.MessageEmbed()
          .setColor('#FF0000')
          .setTitle('¡Ups! This is embarrassing...')
          .setAuthor(user.user.tag, user.user.avatarURL())
          .setThumbnail(user.user.avatarURL())
          .addField('Seems like your steam account is private.', 'Remember switching all privacy options to public.')
          .addField('Already changed all the privacy confing and still doesnt work?', 'Usually when switching the privacy confing to public might take between 24 to 48 hours to refresh the data from the web (Not in our hands).')
          .addField('If your profile always has been public and still doesnt work:', 'Check this image and make sure you have everything in order')
          .setTimestamp()
          .setImage('https://cdn.discordapp.com/attachments/738848207328772237/739269462510796800/unknown.png')
          .setFooter('Entity', client.user.avatarURL());
        client.channels.cache.get(channel).send(embedd)
        break;
      }
      case 3: {
        const embedd = new Discord.MessageEmbed()
          .setColor('#FF0000')
          .setTitle("We can't add your account ...")
          .setAuthor(user.user.tag, user.user.avatarURL())
          .setThumbnail(user.user.avatarURL())
          .addField('There are problems with the web.', 'Currently, due to many requests, the web does not allow us to post accounts, so you must do it by pressing the button below and pasting your profile link. After putting it in, you will be able to see your **stats** around here without problem.')
          .addField('Add account:', '[Click here](https://dbd.onteh.net.au)')
          .setTimestamp()
          .setFooter('Entity', client.user.avatarURL())
        client.channels.cache.get(channel).send(embedd)
        break;
      }
    }
  }
  return
}


/**
 * @param {BigInt64Array} steamid - Steam ID to POST DBD Stats.
 * @param {BigInt64Array} channelid - Channel ID to send info.
 * @param {Int8Array} language - 0 = spanish | 1 = english
 * @description - Post stats to Australian Website.
 */
function postStats(steamid, channelid, user, language) {
  let options = {
    host: "dbd.onteh.net.au",
    path: "/api/playerstats?steamid=" + steamid,
    method: 'POST',
    headers: { 'User-Agent': 'EntityBot/' + version_bot }
  };
  let req = https.request(options, function (res) {
    if (res.statusCode != 201) {
      console.log(`ERROR POST: ${res.statusCode} | message: ${res.statusMessage} | headers: ${JSON.stringify(res.headers)} | steamid: ${steamid}`)
      sendEmbedError(2, user, channelid, language)
    } else {
      console.log(`SUCESS POST: ${res.statusCode} | steamid: ${steamid}`)
      if (language == 0) user.send("La cuenta de Steam está en la cola para ser agregada ya que no estaba registrada, recuerda que puede tardar hasta 1 hora.")
      else user.send("The Steam account is in the queue to be added since it was not registered, remember that it can take up to 1 hour.")
    }
  })
  req.end()
  return
}

/**
 * @param {JSON} data_steam - JSON with data from steam profile
 * @param {BigInt64Array} channelid - Channel ID to send info.
 * @param {ObjectConstructor} user - User ID to send private messages.
 * @param {Boolean} isSurv - true = survivor | false = killer
 * @param {Int8Array} language - 0 = spanish | 1 = english
 * @description - Get stats from Australian Website, and send this to the channel.
 */
function getStats(data_steam, channelid, user, isSurv, language) {
  let options = {
    host: "dbd.onteh.net.au",
    path: "/api/playerstats?steamid=" + data_steam.steamid,
    headers: { 'User-Agent': 'EntityBot/' + version_bot }
  };
  https.get(options, function (res) {
    let bodyChunks_ = [];
    res.on('data', function (chunk) {
      bodyChunks_.push(chunk);
    }).on('end', function () {
      let body = Buffer.concat(bodyChunks_);
      console.log(`australian site code: ${res.statusCode}`)
      if (res.statusCode == 200 || res.statusCode == 201) {
        body = JSON.parse(body);
        if (body.killer_rank == 20 && body.killed == 0 && body.sacrificed == 0 && body.bloodpoints == 0) sendEmbedError(1, user, channelid, language)
        else sendEmbedStats(channelid, isSurv, data_steam, body, language)
        return;
      } else return postStats(data_steam.steamid, channelid, user, language)
    })
  })
}

/**
 * @description - Load MySQL Data base.
 */
function handleDisconnect() {
  con = mysql.createConnection(db_config);

  con.connect(function (err) {
    if (err) {
      console.log('Error al conectar la base de datos (reconectado): ', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      let servers;
      con.query('SELECT * FROM Servidores', (err, rows) => {
        if (err) throw err;
        if (rows.length >= 1) {
          servers = rows.length;
          for (let x = 0; x < servers; x++) {
            let cidd = rows[x].cid;
            let IDD = rows[x].ID;
            let prefixx = rows[x].prefix
            let lan = rows[x].lenguaje
            prefix[IDD] = prefixx;
            cid[IDD] = cidd;
            lenguaje[IDD] = lan;
            if (cidd == null || cidd == 'null') cid[IDD] = null;
          }
        }
      });
      console.log('Base de datos conectada.');
      //client.guilds.cache.get("731243458249097286").channels.cache.get("915426335512469514").send("Bot encendido, base de datos conectada.");
    }
    setInterval(function () {
      con.query('SELECT * FROM Servidores')
      verifyShrine();
    }, 5000);
  })

  con.on('error', function (err) {
    console.log('Data base error.', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
      console.log('Reconectado por caida del sistema...')
    } else {
      throw err;
    }
  });
}

function verifyShrine(force = false) {
  const time = new Date();
  if (time.toUTCString().toLowerCase().includes('wed') && time.getUTCHours() == '0' && time.getUTCMinutes() == '1' && actualizar == '1' || force) {
    actualizar = 0;
    setTimeout(() => {
      actualizar = 1;
    }, 120000)
    let options = {
      host: 'dbd.onteh.net.au',
      path: '/api/shrine',
      headers: { 'User-Agent': 'EntityBot/' + version_bot }
    };
    https.get(options, function (res) {
      let bodyChunks2 = [];
      res.on('data', function (chunk) {
        bodyChunks2.push(chunk);
      }).on('end', function () {
        let body2 = Buffer.concat(bodyChunks2);
        if (res.statusCode == 200 || res.statusCode == 201) {
          console.log(`parsing ${JSON.stringify(body2)} || ${body2.toString()} || ${body2}`)
          let parsed = JSON.parse(body2)
          con.query(`DELETE FROM santuario`)
          con.query(`INSERT INTO santuario (perk_1, perk_2, perk_3, perk_4) VALUES ('${parsed.perks[0].id.toLowerCase()}:${parsed.perks[0].shards}', '${parsed.perks[1].id.toLowerCase()}:${parsed.perks[1].shards}', '${parsed.perks[2].id.toLowerCase()}:${parsed.perks[2].shards}', '${parsed.perks[3].id.toLowerCase()}:${parsed.perks[3].shards}')`)
        }
      })
    })
    return;
  }
}

function forceShrine(text) {
  text = JSON.parse(text)
  con.query(`DELETE FROM santuario`)
  con.query(`INSERT INTO santuario (perk_1, perk_2, perk_3, perk_4) VALUES ('${text.perks[0].id.toLowerCase()}:${text.perks[0].shards}', '${text.perks[1].id.toLowerCase()}:${text.perks[1].shards}', '${text.perks[2].id.toLowerCase()}:${text.perks[2].shards}', '${text.perks[3].id.toLowerCase()}:${text.perks[3].shards}')`)
  return
}

/**
 * @param {Int8Array} x - Number to add commas.
 * @description Returns the number with commas every 3 digits.
 */
function Coma(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * @param {Object} obj - Object.
 * @description Check if object is empty.
 */
function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

/**
 * @param {ArrayBuffer} d - Number with 1 decimal.
 * @description Return number with 2 decimals.
 */
function twoDigits(d) {
  if (0 <= d && d < 10) return "0" + d.toString();
  if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
  return d.toString();
}

Date.prototype.toMysqlFormat = function () {
  return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

/**
 * @param {ArrayBuffer} buffer - Buffer with information
 * @description Return if steam account is private. DEPRECATED.
 */
function verifyPrivate(buffer) {
  let state_1 = buffer.slice(buffer.indexOf('"state"') + 9)
  let state_2 = state_1.slice(0, state_1.indexOf(',') - 1)
  let result = 0;
  if (state_2 == 1) result = 1
  return result;
}

/**
 * @param {String} text - String.
 * @description Replace all "_" with space.
 */
function replaceSpace(text) {
  let str = texto
  while (str.includes('_')) {
    str = str.replace('_', ' ')
  }
  return str;
}

/**
 * @description Load perks info.
 */
function loadPerks() {
  fs.readFile('assets/perks/survivor.json', 'utf8', function (err, data) {
    if (err) return console.log(err)
    const msg = JSON.parse(data)
    for (let x = 0; x < msg.perks.length; x++) {
      survivorPerks[x] = {
        nameEs: msg.perks[x].nameEs,
        nameEn: msg.perks[x].nameEn,
        link: msg.perks[x].link,
        id: msg.perks[x].id,
        index: x,
        isSurv: true,
      }
    }
    return;
  });
  setTimeout(() => {
    fs.readFile('assets/perks/killer.json', 'utf8', function (err, data) {
      if (err) return console.log(err)
      const msg = JSON.parse(data)
      for (let x = 0; x < msg.perks.length; x++) {
        killerPerks[x] = {
          nameEs: msg.perks[x].nameEs,
          nameEn: msg.perks[x].nameEn,
          link: msg.perks[x].link,
          id: msg.perks[x].id,
          index: x,
          isSurv: false
        };
      }
      return;
    });
  }, 1500);
  return
}

/**
 * @description Load characters info.
 */
function loadCharacters() {
  fs.readFile('assets/characters/survivors.json', 'utf8', function (err, data) {
    if (err) return console.log(err)
    const msg = JSON.parse(data)
    for (let x = 0; x < msg.survivors.length; x++) {
      survivors[x] = {
        name: msg.survivors[x].name,
        link: msg.survivors[x].link
      }
    }
    return;
  });
  setTimeout(() => {
    fs.readFile('assets/characters/killers.json', 'utf8', function (err, data) {
      if (err) return console.log(err)
      const msg = JSON.parse(data)
      for (let x = 0; x < msg.killers.length; x++) {
        killers[x] = {
          nameEs: msg.killers[x].nameEs,
          nameEn: msg.killers[x].nameEn,
          link: msg.killers[x].link
        }
      }
      return;
    });
  }, 1500);
  return
}

function loadRules() {
  fs.readFile('assets/rules/en.json', 'utf8', function (err, data) {
    if (err) return console.log(err)
    const msg = JSON.parse(data)
    rulesEng = msg.rules
  })
  fs.readFile('assets/rules/es.json', 'utf8', function (err, data) {
    if (err) return console.log(err)
    const msg = JSON.parse(data)
    rulesEsp = msg.rules
  })
  return
}

/**
 * @param {String} id - Perk ID from Australian Site.
 * @description Get perk (undefined if not find)
 */
async function getPerkById(id) {
  let perk;
  for (let x = 0; x < getLength(survivorPerks); x++) {
    if (id == survivorPerks[x].id) {
      perk = survivorPerks[x];
      break;
    }
  }

  if (!perk) {
    for (let x = 0; x < getLength(killerPerks); x++) {
      if (id == killerPerks[x].id) {
        perk = killerPerks[x];
        break;
      }
    }
  }
  return perk;
}

function createHelpMessage(message, think = null) {
  if (lenguaje[message.guild.id] == 0) {
    const embedd = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setTitle('🔰 Ayuda - Comandos 🔰')
      .setAuthor(message.member.user.tag, message.member.user.avatarURL())
      .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
      .setThumbnail(client.user.avatarURL())
      .addField(prefix[message.guild.id] + 'discord', 'Para más info: **' + prefix[message.guild.id] + 'ayuda discord**')
      .addField('NOTA:', 'Los paréntesis: **[]** no deben ser usados en los comandos, es simplemente para resaltar cómo se usa el comando.')
      .addField(prefix[message.guild.id] + 'calcular [Killer o Survivor]', 'Para más info: **' + prefix[message.guild.id] + 'ayuda calcular**')
      .addField(prefix[message.guild.id] + 'stats [Survivor o Killer] [URL Perfil Steam o Código de amigo]', 'Para más info: **' + prefix[message.guild.id] + 'ayuda stats**')
      .addField(prefix[message.guild.id] + 'nivel [Nivel Actual] [Nivel Deseado]', 'Para más info: **' + prefix[message.guild.id] + 'ayuda nivel**')
      .addField(prefix[message.guild.id] + 'lobby', 'Para más info: **' + prefix[message.guild.id] + 'ayuda lobby**')
      .addField(prefix[message.guild.id] + 'random [Survivor o Killer]', 'Para más info: **' + prefix[message.guild.id] + 'ayuda random**')
      .addField(prefix[message.guild.id] + 'santuario', 'Te mostrará el santuario de los secretos actual del juego.')
      .addField(prefix[message.guild.id] + 'ayuda admin', 'Mostrará los comandos que pueden ser utilizados por **administradores** para personalizar el bot.')
      .setTimestamp()
      .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL());
    if (!think) message.channel.send(embedd)
    else think.edit(embedd)
  } else {
    const embedd = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setTitle('🔰 Help - Commands 🔰')
      .setAuthor(message.member.user.tag, message.member.user.avatarURL())
      .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
      .setThumbnail(client.user.avatarURL())
      .addField(prefix[message.guild.id] + 'discord', 'More info: **' + prefix[message.guild.id] + 'help discord**')
      .addField('BTW:', 'Brackets **[]** should not be used, only use spacebar between words.')
      .addField(prefix[message.guild.id] + 'calculate [Killer or Survivor]', 'More info: **' + prefix[message.guild.id] + 'help calculate**')
      .addField(prefix[message.guild.id] + 'stats [Survivor or Killer] [Steam profile URL or Steam friend code]', 'More info: **' + prefix[message.guild.id] + 'help stats**')
      .addField(prefix[message.guild.id] + 'level [Current Level] [Level wanted]', 'More info: **' + prefix[message.guild.id] + 'help level**')
      .addField(prefix[message.guild.id] + 'lobby', 'More info: **' + prefix[message.guild.id] + 'help lobby**')
      .addField(prefix[message.guild.id] + 'random [Survivor or Killer]', 'More info: **' + prefix[message.guild.id] + 'help random**')
      .addField(prefix[message.guild.id] + 'shrine', 'It will show you the shrine of secrets that is current in the game.')
      .addField(prefix[message.guild.id] + 'help admin', 'It will show you the commands that can only be use by **administrators** to customize the bot.')
      .setTimestamp()
      .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL());
    if (!think) message.channel.send(embedd)
    else think.edit(embedd)
  }
  return;
}

/**
 * @param {Int8Array} index - Perk index from JSON file.
 * @description Return true if perk is valid, else, false.
 */
function isValidPerk(index) {
  if (index == -1) return false
  if (index === undefined) return false
  if (index === null) return false
  return true
}

/**
 * @description Get length from object
 */
function getLength(obj) {
  return Object.keys(obj).length
}

/**
 * @param {Int8Array} max - Max number for the random selector.
 * @description Get 4 random numbers without repeating.
 */
function getRandomNumber(max) {
  let n1 = Math.floor(Math.random() * max);
  let n2 = Math.floor(Math.random() * max);
  if (n2 == n1) {
    while (n2 == n1) {
      n2 = Math.floor(Math.random() * max);
    }
  }
  let n3 = Math.floor(Math.random() * max);
  if (n3 == n1 || n3 == n2) {
    while (n3 == n1) {
      n3 = Math.floor(Math.random() * max);
    }
    while (n3 == n2) {
      n3 = Math.floor(Math.random() * max);
    }
  }
  let n4 = Math.floor(Math.random() * max);
  if (n4 == n1 || n4 == n2 || n4 == n3) {
    while (n4 == n1) {
      n4 = Math.floor(Math.random() * max);
    }
    while (n4 == n2) {
      n4 = Math.floor(Math.random() * max);
    }
    while (n4 == n3) {
      n4 = Math.floor(Math.random() * max);
    }
  }
  return {
    n1: n1,
    n2: n2,
    n3: n3,
    n4: n4
  }
}

/**
 * @param {Int8Array} numberCharacter - Number of the character from JSON File.
 * @param {Int8Array} perk1 - perk 1 data
 * @param {Int8Array} perk2 - perk 2 data
 * @param {Int8Array} perk3 - perk 3 data
 * @param {Int8Array} perk4 - perk 4 data
 * @param {Boolean} isSurv - true = Survivor | false = Killer
 * @param {Int8Array} language - 0 = Spanish | 1 = English 
 * @description Get embed with random build and character.
 */
async function createRandomBuild(message, numberCharacter, perk1, perk2, perk3, perk4, isSurv, language, think = null) {
    const canvas = Canvas.createCanvas(1579, 1114);
    const ctx = canvas.getContext('2d');
    let fontSize = 21
    ctx.drawImage(isSurv ? backgroundSurvivor : backgroundKiller, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // avatar
    ctx.font = '101px "dbd"';
    ctx.fillStyle = '#ffffff';
    if (isSurv) ctx.fillText(survivors[numberCharacter].name, calculateCenter(1267, survivors[numberCharacter].name.length, fontSize), 207);
    else {
      let string = language == 0 ? killers[numberCharacter].nameEs : killers[numberCharacter].nameEn
      ctx.fillText(string, calculateCenter(1267, string.length, fontSize), 207);
    }
    const avatar = await Canvas.loadImage(isSurv ? survivors[numberCharacter].link : killers[numberCharacter].link);
    ctx.drawImage(avatar, 1045, 227, 447, 619);

    // perks
    const perkImage_1 = await Canvas.loadImage(perk1.link);
    const perkImage_2 = await Canvas.loadImage(perk2.link);
    const perkImage_3 = await Canvas.loadImage(perk3.link);
    const perkImage_4 = await Canvas.loadImage(perk4.link);
    ctx.drawImage(perkImage_1, 302, 234, 256, 256);
    ctx.drawImage(perkImage_2, 116, 429, 256, 256);
    ctx.drawImage(perkImage_3, 493, 429, 256, 256);
    ctx.drawImage(perkImage_4, 303, 605, 256, 256);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'random.png');

    if (language == 0) {
      if (!think) message.channel.send(`**PERKS:**\n1⃣: ${perk1.nameEs}\n2⃣: ${perk2.nameEs}\n3⃣: ${perk3.nameEs}\n4⃣: ${perk4.nameEs}`, attachment);
      else think.edit(`**PERKS:**\n1⃣: ${perk1.nameEs}\n2⃣: ${perk2.nameEs}\n3⃣: ${perk3.nameEs}\n4⃣: ${perk4.nameEs}`, attachment);
    } else {
      if (!think) message.channel.send(`**PERKS:**\n1⃣: ${perk1.nameEn}\n2⃣: ${perk2.nameEn}\n3⃣: ${perk3.nameEn}\n4⃣: ${perk4.nameEn}`, attachment);
      else think.edit(`**PERKS:**\n1⃣: ${perk1.nameEn}\n2⃣: ${perk2.nameEn}\n3⃣: ${perk3.nameEn}\n4⃣: ${perk4.nameEn}`, attachment);
    }
  return;
}

/**
 * @param {BigInt64Array} steamId64 - SteamID in 64bits.
 * @description - Return steamID 32 bits.
 */
function steamID_32(steamId64) {
  steamId64 = new bigNumber(steamId64);
  let steamId32 = steamId64.minus(convert)
  return steamId32.toString();
}

/**
 * @param {BigInt32Array} steamId32 - SteamID in 32bits.
 * @description - Return steamID 64 bits.
 */
function steamID_64(steamId32) {
  steamId32 = new bigNumber(steamId32);
  let steamId64 = steamId32.plus(convert)
  return steamId64.toString();
}


/**
 * @param {BigInt64Array} steamid - SteamID in 64bits.
 * @param {BigInt64Array} channelid - ChannelID to send message.
 * @param {BigInt64Array} userid - UserID to get guild.
 * @param {BigInt64Array} serverid - ServerID to get user guild.
 * @param {Boolean} isSurv - true = survivor | false = killer
 * @param {Int8Array} language - 0 = spanish | 1 = english
 * @description - First part for get user stats from Australian Website.
 */
function getSteamProfile(steamid, channelid, userid, serverid, isSurv, language) {
  let server = client.guilds.cache.get(serverid)
  let user = server.members.cache.get(userid)
  let options = {
    host: 'api.steampowered.com',
    path: '/ISteamUser/GetPlayerSummaries/v0002/?key=DF0A08E817CCE67F129D35FFFB14901A&steamids=' + steamid,
    headers: { 'User-Agent': 'EntityBot/' + version_bot }
  };
  http.get(options, function (res) {
    let bodyChunks_ = [];
    res.on('data', function (chunk) {
      bodyChunks_.push(chunk);
    }).on('end', function () {
      let body = Buffer.concat(bodyChunks_);
      if (body.includes("<html><head><title>Bad Request</title>")) return user.send(errors.profileNotFound[language]);
      if (isEmptyObject(body)) return user.send(errors.profileNotFound[language]);
      if (res.statusCode == 200 || res.statusCode == 201) {
        body = JSON.parse(body)
        if (body.response && body.response.players && body.response.players.length && body.response.players[0].profilestate) {
          if (body.response.players[0].profilestate != 1) return user.send(errors.privateProfile[language]);
          getStats(body.response.players[0], channelid, user, isSurv, language)
          return
        } else return user.send(errors.profileNotFound[language]);
      } else return user.send(errors.profileNotFound[language]);
    })
  })
}

async function sendShrine(perk1, perk2, perk3, perk4, shards, channel, language) {
  const canvas = Canvas.createCanvas(1163, 664);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(backgroundShrine, 0, 0, canvas.width, canvas.height);
  const perkImage_1 = await Canvas.loadImage(perk1.link);
  const perkImage_2 = await Canvas.loadImage(perk2.link);
  const perkImage_3 = await Canvas.loadImage(perk3.link);
  const perkImage_4 = await Canvas.loadImage(perk4.link);
  ctx.drawImage(perkImage_1, 454, 3.5, 256, 256);
  ctx.drawImage(perkImage_2, 280, 177, 256, 256);
  ctx.drawImage(perkImage_3, 626, 177, 256, 256);
  ctx.drawImage(perkImage_4, 454, 355, 256, 256);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'shrine-image.png');
  if (language == 0) {
    channel.send(`🈴 **Santuario:**\n1⃣ ${perk1.nameEs} - <:frag_iri:739690491829813369> ${shards[0]}\n2⃣ ${perk2.nameEs} - <:frag_iri:739690491829813369> ${shards[1]}\n3⃣ ${perk3.nameEs} - <:frag_iri:739690491829813369> ${shards[2]}\n4⃣ ${perk4.nameEs} - <:frag_iri:739690491829813369> ${shards[3]}`, attachment)
  } else {
    channel.send(`🈴 **Santuario:**\n1⃣ ${perk1.nameEn} - <:frag_iri:739690491829813369> ${shards[0]}\n2⃣ ${perk2.nameEn} - <:frag_iri:739690491829813369> ${shards[1]}\n3⃣ ${perk3.nameEn} - <:frag_iri:739690491829813369> ${shards[2]}\n4⃣ ${perk4.nameEn} - <:frag_iri:739690491829813369> ${shards[3]}`, attachment)
  }
}


function calculateCenter(x, letters, fontSize) {
  return x - (letters * fontSize)
}

async function loadImages() {
  backgroundKiller = await Canvas.loadImage("assets/Visuals/Background/random_killer.jpg");
  backgroundSurvivor = await Canvas.loadImage("assets/Visuals/Background/random_survivor.jpg");
  backgroundShrine = await Canvas.loadImage("assets/Visuals/Background/shrine.jpg");
  backgroundLevel = await Canvas.loadImage("assets/Visuals/Background/level.jpg");
  backgroundStatsSurvivor = await Canvas.loadImage("assets/Visuals/Background/stats_survivor.jpg");
  backgroundStatsKiller = await Canvas.loadImage("assets/Visuals/Background/stats_killer.jpg");
  killerImage = await Canvas.loadImage("./assets/Visuals/icons/killer_rank.png");
  survivorImage = await Canvas.loadImage("./assets/Visuals/icons/survivor_rank.png");
  bpImage = await Canvas.loadImage("./assets/Visuals/icons/bp.png");
  killsImage = await Canvas.loadImage("./assets/Visuals/icons/killer.png");
  sacrificedImage = await Canvas.loadImage("./assets/Visuals/icons/hook.png");
  sacrificedObsessionsImage = await Canvas.loadImage("./assets/Visuals/icons/entity.png");
  perfectGamesImage = await Canvas.loadImage("./assets/Visuals/icons/killer_perfect.png");
  paletImage = await Canvas.loadImage("./assets/Visuals/icons/palet.png");
  genDamagedImage = await Canvas.loadImage("./assets/Visuals/icons/genbreak.png");
  carryImage = await Canvas.loadImage("./assets/Visuals/icons/carry.png");
}

client.login(process.env.token);