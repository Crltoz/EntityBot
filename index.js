const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
var https = require('https');
var http = require('http');
var useragent = require('express-useragent')
const version_bot = '0.8.6'
const mysql = require("mysql");
const { parse } = require("path");
const { SSL_OP_NO_TLSv1_1 } = require("constants");
const PerkSurv = 86;
const PerkKill = 78;
const Niveles = 3;
const Survivors = 24;
const Killers = 22;


const p1 = new Set();
const p2 = new Set();
const p3 = new Set();
const p4 = new Set();
const ps1 = new Set();
const ps2 = new Set();
const ps3 = new Set();
const ps4 = new Set();
var perks3 = {}
var perks2 = {}
var perks1 = {}
var NivelPJ = {}
var DBC = {}
var LC = {}
var NombrePersonaje;
var ImagenPersonaje;
var cid = {}
var prefix = {}
var lenguaje = {}
const lobby_set = new Set();
const r1 = new Set();
const r2 = new Set();
const n1 = {}
const n2 = new Set();
var actualizar = 1;
var k = {}

var db_config = {
    host: '185.201.10.94',
    user: 'u642668726_sh',
    password: 'y`SBzagH',
    database: 'u642668726_shsv'
}
var con;


client.on("ready", () => {
    console.log("El bot esta cargando sistemas, base de datos.");
    handleDisconnect();
  client.user.setPresence( {
      status: "online",
      game: {
          name: 'La muerte no es un escape.',
            type: "PLAYING"
      }
  } );
});



client.on("guildCreate", guild => {
  
  let defaultChannel = "";
  guild.channels.forEach((channel) => {
    if(channel.type == "text" && defaultChannel == "") {
      if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
        defaultChannel = channel;
      }
    }
  })
  lenguaje[guild.id] = 0
  defaultChannel.send("**Gracias por añadirme!** :white_check_mark:\n**-** Mi prefijo es `/`\n**-** Puedes ver mis comandos con `/ayuda`\n**-** Change the bot language with `/english`")
  client.channels.get('739997803094343721').send('| Nuevo servidor | Nombre: '+guild.name+' | Usuarios: '+guild.memberCount)
})



client.on("messageReactionAdd", (messageReaction, user) => {
                if (messageReaction.emoji == '1⃣' || messageReaction.emoji == '2⃣' || messageReaction.emoji == '3⃣' || messageReaction.emoji == '4⃣') {
                  if(lenguaje[messageReaction.message.guild.id] == 0)
                  {
                if(lobby_set.has(user.id))
                {
                  lobby_set.delete(user.id)
                  if(messageReaction.emoji == '1⃣')
                  {
                    r1.add(user.id)
                    messageReaction.message.channel.send('Envía por aquí el nivel inicial de la red de sangre en el que estás, '+user.tag)
                  } else if(messageReaction.emoji == '2⃣')
                  {
                    let numero = Math.floor(Math.random() * Survivors);
                    let numero_perk_1 = Math.floor(Math.random() * PerkSurv);
                    let numero_perk_2 = Math.floor(Math.random() * PerkSurv);
                    if(numero_perk_2 == numero_perk_1)
                    {
                      while(numero_perk_2 == numero_perk_1)
                      {
                        console.log('Loop Linea 99')
                        numero_perk_2 = Math.floor(Math.random() * PerkSurv);
                      }
                    }
                    let numero_perk_3 = Math.floor(Math.random() * PerkSurv);
                    if(numero_perk_3 == numero_perk_1 || numero_perk_3 == numero_perk_2)
                    {
                      while(numero_perk_3 == numero_perk_1)
                      {
                        console.log('Loop Linea 108')
                        numero_perk_3 = Math.floor(Math.random() * PerkSurv);
                      }
                      while(numero_perk_3 == numero_perk_2)
                      {
                        console.log('Loop Linea 113')
                        numero_perk_3 = Math.floor(Math.random() * PerkSurv);
                      }
                    }
                    let numero_perk_4 = Math.floor(Math.random() * PerkSurv);
                    if(numero_perk_4 == numero_perk_1 || numero_perk_4 == numero_perk_2 || numero_perk_4 == numero_perk_3)
                    {
                      while(numero_perk_4 == numero_perk_1)
                      {
                        console.log('Loop Linea 122')
                        numero_perk_4 = Math.floor(Math.random() * PerkSurv);
                      }
                      while(numero_perk_4 == numero_perk_2)
                      {
                        console.log('Loop Linea 127')
                        numero_perk_4 = Math.floor(Math.random() * PerkSurv);
                      }
                      while(numero_perk_4 == numero_perk_3)
                      {
                        console.log('Loop Linea 132')
                        numero_perk_4 = Math.floor(Math.random() * PerkSurv);
                      }
                    }
                    SurvivorRandom(numero);
                    const embed = new Discord.RichEmbed()
                        .setThumbnail(ImagenPersonaje)
                        .setAuthor('| '+NombrePersonaje+' |', ImagenPersonaje)
                        .setTitle('Perks:')
                        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
                        .addField('ㅤ', '**► '+ObtenerPerkSurv(numero_perk_1)+'**\n**► '+ObtenerPerkSurv(numero_perk_2)+'**\n**► '+ObtenerPerkSurv(numero_perk_3)+'**\n**► '+ObtenerPerkSurv(numero_perk_4)+'**', true)
                        .setColor(0xFF0000)
                        messageReaction.message.channel.send(embed).then(function(message) { message.channel.send(ObtenerIconPerk(numero_perk_1, 1)+' '+ObtenerIconPerk(numero_perk_2, 1)+' '+ObtenerIconPerk(numero_perk_3, 1)+' '+ObtenerIconPerk(numero_perk_4, 1)) })
                    return;
                  } else if(messageReaction.emoji == '3⃣')
                  {
                    let numero = Math.floor(Math.random() * Killers);
                    KillerRandom(numero);
                    let numero_perk_1 = Math.floor(Math.random() * PerkKill);
                    let numero_perk_2 = Math.floor(Math.random() * PerkKill);
                    if(numero_perk_2 == numero_perk_1)
                    {
                      while(numero_perk_2 == numero_perk_1)
                      {
                        console.log('Loop Linea 156')
                        numero_perk_2 = Math.floor(Math.random() * PerkKill);
                      }
                    }
                    let numero_perk_3 = Math.floor(Math.random() * PerkKill);
                    if(numero_perk_3 == numero_perk_1 || numero_perk_3 == numero_perk_2)
                    {
                      while(numero_perk_3 == numero_perk_1)
                      {
                        console.log('Loop Linea 165')
                        numero_perk_3 = Math.floor(Math.random() * PerkKill);
                      }
                      while(numero_perk_3 == numero_perk_2)
                      {
                        console.log('Loop Linea 170')
                        numero_perk_3 = Math.floor(Math.random() * PerkKill);
                      }
                    }
                    let numero_perk_4 = Math.floor(Math.random() * PerkKill);
                    if(numero_perk_4 == numero_perk_1 || numero_perk_4 == numero_perk_2 || numero_perk_4 == numero_perk_3)
                    {
                      while(numero_perk_4 == numero_perk_1)
                      {
                        console.log('Loop Linea 179')
                        numero_perk_4 = Math.floor(Math.random() * PerkKill);
                      }
                      while(numero_perk_4 == numero_perk_2)
                      {
                        console.log('Loop Linea 184')
                        numero_perk_4 = Math.floor(Math.random() * PerkKill);
                      }
                      while(numero_perk_4 == numero_perk_3)
                      {
                        console.log('Loop Linea 189')
                        numero_perk_4 = Math.floor(Math.random() * PerkKill);
                      }
                    }
                    const embed = new Discord.RichEmbed()
                        .setThumbnail(ImagenPersonaje)
                        .setAuthor('| '+NombrePersonaje+' |', ImagenPersonaje)
                        .setTitle('Build:')
                        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
                        .addField('ㅤ', '**► '+ObtenerPerkKiller(numero_perk_1)+'**\n**► '+ObtenerPerkKiller(numero_perk_2)+'**\n**► '+ObtenerPerkKiller(numero_perk_3)+'**\n**► '+ObtenerPerkKiller(numero_perk_4)+'**', true)
                        .setColor(0xFF0000)
                        messageReaction.message.channel.send(embed).then(function(message) { message.channel.send(ObtenerIconPerk(numero_perk_1, 0)+' '+ObtenerIconPerk(numero_perk_2, 0)+' '+ObtenerIconPerk(numero_perk_3, 0)+' '+ObtenerIconPerk(numero_perk_4, 0)) })
                    return;
                  } else if(messageReaction.emoji == '4⃣')
                  {
                    r2.add(user.id)
                    messageReaction.message.channel.send(user.tag+', envía por aquí "**survivor**" o "**killer**" para calcular el valor de todas las perks del que elijas, '+messageReaction.message.member.user)
                    return;
                  }
                  else if(messageReaction.emoji == '5⃣')
                  {
                    messageReaction.message.channel.send('<:Entityicon:733814957111771146> En nuestro Discord podrás obtener el bot para tu servidor, y soporte. Link: https://discord.gg/6eBRcRK')
                    return;
                  }
                }
              }
               else

               {

                if(lobby_set.has(user.id))
                {
                  lobby_set.delete(user.id)
                  if(messageReaction.emoji == '1⃣')
                  {
                    r1.add(user.id)
                    messageReaction.message.channel.send('Send the initial level that your bloodweb is, '+user.tag)
                  } else if(messageReaction.emoji == '2⃣')
                  {
                    let numero = Math.floor(Math.random() * Survivors);
                    let numero_perk_1 = Math.floor(Math.random() * PerkSurv);
                    let numero_perk_2 = Math.floor(Math.random() * PerkSurv);
                    if(numero_perk_2 == numero_perk_1)
                    {
                      while(numero_perk_2 == numero_perk_1)
                      {
                        console.log('Loop Linea 235')
                        numero_perk_2 = Math.floor(Math.random() * PerkSurv);
                      }
                    }
                    let numero_perk_3 = Math.floor(Math.random() * PerkSurv);
                    if(numero_perk_3 == numero_perk_1 || numero_perk_3 == numero_perk_2)
                    {
                      while(numero_perk_3 == numero_perk_1)
                      {
                        console.log('Loop Linea 244')
                        numero_perk_3 = Math.floor(Math.random() * PerkSurv);
                      }
                      while(numero_perk_3 == numero_perk_2)
                      {
                        console.log('Loop Linea 249')
                        numero_perk_3 = Math.floor(Math.random() * PerkSurv);
                      }
                    }
                    let numero_perk_4 = Math.floor(Math.random() * PerkSurv);
                    if(numero_perk_4 == numero_perk_1 || numero_perk_4 == numero_perk_2 || numero_perk_4 == numero_perk_3)
                    {
                      while(numero_perk_4 == numero_perk_1)
                      {
                        console.log('Loop Linea 258')
                        numero_perk_4 = Math.floor(Math.random() * PerkSurv);
                      }
                      while(numero_perk_4 == numero_perk_2)
                      {
                        console.log('Loop Linea 263')
                        numero_perk_4 = Math.floor(Math.random() * PerkSurv);
                      }
                      while(numero_perk_4 == numero_perk_3)
                      {
                        console.log('Loop Linea 268')
                        numero_perk_4 = Math.floor(Math.random() * PerkSurv);
                      }
                    }
                    SurvivorRandom(numero);
                    const embed = new Discord.RichEmbed()
                        .setThumbnail(ImagenPersonaje)
                        .setAuthor('| '+NombrePersonaje+' |', ImagenPersonaje)
                        .setTitle('Perks:')
                        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
                        .addField('ㅤ', '**► '+ObtenerPerkSurv_ING(numero_perk_1)+'**\n**► '+ObtenerPerkSurv_ING(numero_perk_2)+'**\n**► '+ObtenerPerkSurv_ING(numero_perk_3)+'**\n**► '+ObtenerPerkSurv_ING(numero_perk_4)+'**', true)
                        .setColor(0xFF0000)
                        messageReaction.message.channel.send(embed).then(function(message) { message.channel.send(ObtenerIconPerk(numero_perk_1, 1)+' '+ObtenerIconPerk(numero_perk_2, 1)+' '+ObtenerIconPerk(numero_perk_3, 1)+' '+ObtenerIconPerk(numero_perk_4, 1)) })
                    return;
                  } else if(messageReaction.emoji == '3⃣')
                  {
                    let numero = Math.floor(Math.random() * Killers);
                    KillerRandom(numero);
                    let numero_perk_1 = Math.floor(Math.random() * PerkKill);
                    let numero_perk_2 = Math.floor(Math.random() * PerkKill);
                    if(numero_perk_2 == numero_perk_1)
                    {
                      while(numero_perk_2 == numero_perk_1)
                      {
                        console.log('Loop Linea 292')
                        numero_perk_2 = Math.floor(Math.random() * PerkKill);
                      }
                    }
                    let numero_perk_3 = Math.floor(Math.random() * PerkKill);
                    if(numero_perk_3 == numero_perk_1 || numero_perk_3 == numero_perk_2)
                    {
                      while(numero_perk_3 == numero_perk_1)
                      {
                        console.log('Loop Linea 301')
                        numero_perk_3 = Math.floor(Math.random() * PerkKill);
                      }
                      while(numero_perk_3 == numero_perk_2)
                      {
                        console.log('Loop Linea 306')
                        numero_perk_3 = Math.floor(Math.random() * PerkKill);
                      }
                    }
                    let numero_perk_4 = Math.floor(Math.random() * PerkKill);
                    if(numero_perk_4 == numero_perk_1 || numero_perk_4 == numero_perk_2 || numero_perk_4 == numero_perk_3)
                    {
                      while(numero_perk_4 == numero_perk_1)
                      {
                        console.log('Loop Linea 315')
                        numero_perk_4 = Math.floor(Math.random() * PerkKill);
                      }
                      while(numero_perk_4 == numero_perk_2)
                      {
                        console.log('Loop Linea 320')
                        numero_perk_4 = Math.floor(Math.random() * PerkKill);
                      }
                      while(numero_perk_4 == numero_perk_3)
                      {
                        console.log('Loop Linea 325')
                        numero_perk_4 = Math.floor(Math.random() * PerkKill);
                      }
                    }
                    const embed = new Discord.RichEmbed()
                        .setThumbnail(ImagenPersonaje)
                        .setAuthor('| '+NombrePersonaje+' |', ImagenPersonaje)
                        .setTitle('Build:')
                        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
                        .addField('ㅤ', '**► '+ObtenerPerkKiller_ING(numero_perk_1)+'**\n**► '+ObtenerPerkKiller_ING(numero_perk_2)+'**\n**► '+ObtenerPerkKiller_ING(numero_perk_3)+'**\n**► '+ObtenerPerkKiller_ING(numero_perk_4)+'**', true)
                        .setColor(0xFF0000)
                        messageReaction.message.channel.send(embed).then(function(message) { message.channel.send(ObtenerIconPerk(numero_perk_1, 0)+' '+ObtenerIconPerk(numero_perk_2, 0)+' '+ObtenerIconPerk(numero_perk_3, 0)+' '+ObtenerIconPerk(numero_perk_4, 0)) })
                    return;
                  } else if(messageReaction.emoji == '4⃣')
                  {
                    r2.add(user.id)
                    messageReaction.message.channel.send(user.tag+', Send "**survivor**" or "**killer**" to calculate the value of all the perks of the one you choose, '+messageReaction.message.member.user)
                    return;
                  }
                  else if(messageReaction.emoji == '5⃣')
                  {
                    messageReaction.message.channel.send('<:Entityicon:733814957111771146> On our discord server you can obtain the bot for your own discord server and also support. Link: https://discord.gg/6eBRcRK')
                    return;
                  }
                }


               }
                return;
              }
})

client.on("message", async (message) => {

 if(message.author.bot) return;
 if(message.webhookID) return;
 if(!message.member) return;


 if(lenguaje[message.guild.id] == 0)
 {
    if(r2.has(message.author.id))
    {
      if(message.content.toLowerCase().includes('killer'))
      {
        r2.delete(message.author.id)
        LC[message.author.id] = 0;
        if(message.member) message.channel.send('Ingresa cuántas perks a nivel 3 tienes, '+message.member.user)
        else message.channel.send('Ingresa cuántas perks a nivel 3 tienes, '+message.author.tag)
        p1.add(message.author.id)
        return;
      } else if(message.content.toLowerCase().includes('survivor'))
      {
        r2.delete(message.author.id)
        LC[message.author.id] = 0;
        if(message.member) message.channel.send('Ingresa cuántas perks a nivel 3 tienes, '+message.member.user)
        else message.channel.send('Ingresa cuántas perks a nivel 3 tienes, '+message.author.tag)
        ps1.add(message.author.id)
        return;
      } else return message.channel.send(message.author.tag+', envía por aquí "**survivor**" o "**killer**" para calcular el valor de todas las perks del que elijas.')
    }
    if(r1.has(message.author.id))
    {
      if(message.content > 50 || message.content < 1 || message.content > 50) return message.member.send('El nivel debe ser entre 1 y 50, '+message.author.tag).catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      if(message.content % 1 != '0') return message.member.send('El nivel no puede tener comas.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      r1.delete(message.author.id)
      n1[message.author.id] = message.content
      message.channel.send('Envía el nivel que quieres obtener en la red de sangre.')
      n2.add(message.author.id)
      return;
    }

    if(n2.has(message.author.id))
    {
      n2.delete(message.author.id)
      if(parseInt(message.content) > 50 || parseInt(message.content) < 1 || parseInt(message.content) > 50) return message.member.send('El nivel debe ser entre 1 y 50.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      if(parseInt(message.content) % 1 != '0') return message.member.send('El nivel no puede tener comas.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      if(parseInt(message.content) < n1[message.author.id]) return message.member.send('El nivel deseado no puede ser menor al inicial.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      LC[message.author.id] = 0;
        let sangre = ObtenerValor(parseInt(n1[message.author.id]),parseInt(message.content), message.author.id)
        const embed = new Discord.RichEmbed()
            .setThumbnail(message.member.user.avatarURL)
            .setAuthor(message.member.displayName+'#'+message.member.user.discriminator, message.member.user.avatarURL)
            .setTitle('| Subir Nivel |')
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .addField('Puntos de Sangre necesarios <:bp:724724401333076071>', '**'+Coma(sangre)+'**', true)
            .addField('Niveles comprados', '**'+LC[message.author.id]+'**', true)
            .addField('ㅤ', 'ㅤ')
            .addField('Nivel Inicial', '**'+n1[message.author.id]+'**', true)
            .addField('Nivel Final', '**'+message.content+'**',true)
            .setColor(0xFF0000)
          message.channel.send({ embed });
          return;
    }

    if(p1.has(message.author.id))
    {
      if(message.content % 1 != '0') 
      {
        p1.delete(message.author.id)
        message.member.send('El numero no puede tener comas, el calcular se ha cancelado.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
        return;
      }
      if(parseInt(message.content)*3 >= PerkKill*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      if(parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      p1.delete(message.author.id)
      perks3[message.author.id] = message.content;
      p2.add(message.author.id)
      if(message.member) message.channel.send('Ingresa cuántas perks a nivel 2 tienes, '+message.member.user)
        else message.channel.send('Ingresa cuántas perks a nivel 2 tienes, '+message.author.tag)
      return;
    }

    if(p2.has(message.author.id))
    {
      if(message.content % 1 != '0') 
      {
        p2.delete(message.author.id)
        message.member.send('El numero no puede tener comas, el calcular se ha cancelado.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
        return;
      }
      if(parseInt(message.content)*2 >= PerkKill*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      if(parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      if(perks3[message.author.id]*3+parseInt(message.content)*2 >= PerkKill*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      p2.delete(message.author.id)
      perks2[message.author.id] = message.content;
      if(message.member) message.channel.send('Ingresa cuántas perks a nivel 1 tienes, '+message.member.user)
      else message.channel.send('Ingresa cuántas perks a nivel 1 tienes, '+message.author.tag)
      p3.add(message.author.id)
      return;
    }

    if(p3.has(message.author.id))
    {
      if(message.content % 1 != '0') 
      {
        p3.delete(message.author.id)
        message.member.send('El numero no puede tener comas, el calcular se ha cancelado.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
        return;
      }
      if(parseInt(message.content) >= PerkKill*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      if(parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      if(perks3[message.author.id]*3+perks2[message.author.id]*2+parseInt(message.content) >= PerkKill*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      p3.delete(message.author.id)
      perks1[message.author.id] = message.content;
      if(message.member) message.channel.send('Ingresa a qué nivel estás con tu personaje, '+message.member.user)
        else message.channel.send('Ingresa a qué nivel estás con tu personaje, '+message.author.tag)
      p4.add(message.author.id)
      return;
    }

    if(p4.has(message.author.id))
    {
      if(message.content % 1 != '0') 
      {
        p4.delete(message.author.id)
        message.member.send('El numero no puede tener comas, el calcular se ha cancelado.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
        return;
      }
      if(parseInt(message.content) > 50 || parseInt(message.content) < 1) return message.member.send('Nivel inválido.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      p4.delete(message.author.id)
      NivelPJ[message.author.id] = parseInt(message.content);
      let necesitaperks = PerkKill*Niveles-(3*perks3[message.author.id])-(2*perks2[message.author.id])-perks1[message.author.id];
      DBC[message.author.id] = necesitaperks;
      let NivelValor = ObtenerNP(NivelPJ[message.author.id], message.author.id)
      const embed = new Discord.RichEmbed()
            .setThumbnail(message.member.user.avatarURL)
            .setAuthor(message.member.displayName+'#'+message.member.user.discriminator, message.member.user.avatarURL)
            .setTitle('| Comprar todas las Perks de Killer |')
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .addField('Puntos de Sangre necesarios <:bp:724724401333076071>', '**'+Coma(NivelValor)+'**', true)
            .addField('Niveles comprados', '**'+LC[message.author.id]+'**', true)
            .setColor(0xFF0000)
            message.channel.send({ embed });
      return;
    }

    if(ps1.has(message.author.id))
    {
      if(message.content % 1 != '0') 
      {
        ps1.delete(message.author.id)
        message.member.send('El numero no puede tener comas, el calcular se ha cancelado.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
        return;
      }
      if(parseInt(message.content)*3 >= PerkSurv*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      if(parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      ps1.delete(message.author.id)
      perks3[message.author.id] = message.content;
      ps2.add(message.author.id)
      if(message.member) message.channel.send('Ingresa cuántas perks a nivel 2 tienes, '+message.member.user)
        else message.channel.send('Ingresa cuántas perks a nivel 2 tienes, '+message.author.tag)
      return;
    }

    if(ps2.has(message.author.id))
    {
      if(message.content % 1 != '0') 
      {
        ps2.delete(message.author.id)
        message.member.send('El numero no puede tener comas, el calcular se ha cancelado.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
        return;
      }
      if(parseInt(message.content)*2 >= PerkSurv*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      if(parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      if(perks3[message.author.id]*3+parseInt(message.content)*2 >= PerkSurv*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      ps2.delete(message.author.id)
      perks2[message.author.id] = message.content;
      if(message.member) message.channel.send('Ingresa cuántas perks a nivel 1 tienes, '+message.member.user)
        else message.channel.send('Ingresa cuántas perks a nivel 1 tienes, '+message.author.tag)
      ps3.add(message.author.id)
      return;
    }

    if(ps3.has(message.author.id))
    {
      if(message.content % 1 != '0') 
      {
        ps3.delete(message.author.id)
        message.member.send('El numero no puede tener comas, el calcular se ha cancelado.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
        return;
      }
      if(parseInt(message.content) >= PerkSurv*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      if(parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      if(perks3[message.author.id]*3+perks2[message.author.id]*2+parseInt(message.content) >= PerkSurv*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      ps3.delete(message.author.id)
      perks1[message.author.id] = message.content;
      if(message.member) message.channel.send('Ingresa a qué nivel estás con tu personaje, '+message.member.user)
        else message.channel.send('Ingresa a qué nivel estás contu personaje, '+message.author.tag)
      ps4.add(message.author.id)
      return;
    }

    if(ps4.has(message.author.id))
    {
      if(message.content % 1 != '0') 
      {
        ps4.delete(message.author.id)
        message.member.send('El numero no puede tener comas, el calcular se ha cancelado.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
        return;
      }
      if(parseInt(message.content) > 50 || parseInt(message.content) < 1) return message.member.send('Nivel inválido.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      ps4.delete(message.author.id)
      NivelPJ[message.author.id] = parseInt(message.content);
      let necesitaperks = PerkSurv*Niveles-(3*perks3[message.author.id])-(2*perks2[message.author.id])-perks1[message.author.id];
      DBC[message.author.id] = necesitaperks;
      let NivelValor = ObtenerNP(NivelPJ[message.author.id], message.author.id)
      const embed = new Discord.RichEmbed()
            .setThumbnail(message.member.user.avatarURL)
            .setAuthor(message.member.user.username+'#'+message.member.user.discriminator, message.member.user.avatarURL)
            .setTitle('| Comprar todas las Perks de Survivor |')
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .addField('Puntos de Sangre necesarios <:bp:724724401333076071>', '**'+Coma(NivelValor)+'**', true)
            .addField('Niveles comprados', '**'+LC[message.author.id]+'**', true)
            .setColor(0xFF0000)
            message.channel.send({ embed });
      return;
    }
  }
  else
  {
    if(r2.has(message.author.id))
    {
      if(message.content.toLowerCase().includes('killer'))
      {
        r2.delete(message.author.id)
        LC[message.author.id] = 0;
        if(message.member) message.channel.send('Enter how many level 3 perks you have, '+message.member.user)
        else message.channel.send('Enter how many level 3 perks you have, '+message.author.tag)
        p1.add(message.author.id)
        return;
      } else if(message.content.toLowerCase().includes('survivor'))
      {
        r2.delete(message.author.id)
        LC[message.author.id] = 0;
        if(message.member) message.channel.send('Enter how many level 3 perks you have, '+message.member.user)
        else message.channel.send('Enter how many level 3 perks you have, '+message.author.tag)
        ps1.add(message.author.id)
        return;
      } else return message.channel.send(message.author.tag+', send this way "**survivor**" or "**killer**" to calculate the value of all the perks that you enter.')
    }
    if(r1.has(message.author.id))
    {
      if(message.content > 50 || message.content < 1 || message.content > 50) return message.member.send('The level must be between 1 and 50, '+message.author.tag).catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      if(message.content % 1 != '0') return message.member.send('Level can not contain commas.').catch(function(err) { message.channel.send(message.member.user+'  Activate your private messagges so the bot can inform you.') } );
      r1.delete(message.author.id)
      n1[message.author.id] = message.content
      message.channel.send('Enter the level that you want from the bloodweb, '+message.author.tag)
      n2.add(message.author.id)
      return;
    }

    if(n2.has(message.author.id))
    {
      n2.delete(message.author.id)
      if(parseInt(message.content) > 50 || parseInt(message.content) < 1 || parseInt(message.content) > 50) return message.member.send('The level must be between 1 and 50,').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      if(parseInt(message.content) % 1 != '0') return message.member.send('Level can not contain commas.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      if(parseInt(message.content) < n1[message.author.id]) return message.member.send('The level wanted can not be less than the initial level.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      LC[message.author.id] = 0;
        let sangre = ObtenerValor(parseInt(n1[message.author.id]),parseInt(message.content), message.author.id)
        const embed = new Discord.RichEmbed()
            .setThumbnail(message.member.user.avatarURL)
            .setAuthor(message.member.displayName+'#'+message.member.user.discriminator, message.member.user.avatarURL)
            .setTitle('| Level Up |')
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .addField('Bloodpoints needed <:bp:724724401333076071>', '**'+Coma(sangre)+'**', true)
            .addField('Levels bought', '**'+LC[message.author.id]+'**', true)
            .addField('ㅤ', 'ㅤ')
            .addField('Initial level', '**'+n1[message.author.id]+'**', true)
            .addField('Final level', '**'+message.content+'**',true)
            .setColor(0xFF0000)
          message.channel.send({ embed });
          return;
    }

    if(p1.has(message.author.id))
    {
      if(message.content % 1 != '0') 
      {
        p1.delete(message.author.id)
        message.member.send('The level can not contain dots, the calculate funtion was canceled.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
        return;
      }
      if(parseInt(message.content)*3 >= PerkKill*3) return message.member.send('You can not have all or more than the existant perks.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      if(parseInt(message.content) < 0) return message.member.send('You can not have less than 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      p1.delete(message.author.id)
      perks3[message.author.id] = message.content;
      p2.add(message.author.id)
      if(message.member) message.channel.send('Enter how many level 2 perks you have, '+message.member.user)
        else message.channel.send('Enter how many level 2 perks you have, '+message.author.tag)
      return;
    }

    if(p2.has(message.author.id))
    {
      if(message.content % 1 != '0') 
      {
        p2.delete(message.author.id)
        message.member.send('The level can not contain dots, the calculate funtion was canceled.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
        return;
      }
      if(parseInt(message.content)*2 >= PerkKill*3) return message.member.send('You can not have all or more than the existant perks.').catch(function(err) { message.channel.send(message.member.user+'Activate your private messagges so the bot can inform you.') } );
      if(parseInt(message.content) < 0) return message.member.send('You can not have less than 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      if(perks3[message.author.id]*3+parseInt(message.content)*2 >= PerkKill*3) return message.member.send('You can not have all or more than the existant perks.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      p2.delete(message.author.id)
      perks2[message.author.id] = message.content;
      if(message.member) message.channel.send('Enter how many level 1 perks you have, '+message.member.user)
      else message.channel.send('Enter how many level 1 perks you have, '+message.author.tag)
      p3.add(message.author.id)
      return;
    }

    if(p3.has(message.author.id))
    {
      if(message.content % 1 != '0') 
      {
        p3.delete(message.author.id)
        message.member.send('The number can not contain dots, the calculate function was canceled.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
        return;
      }
      if(parseInt(message.content) >= PerkKill*3) return message.member.send('You can not have all or more than the existant perks.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      if(parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      if(perks3[message.author.id]*3+perks2[message.author.id]*2+parseInt(message.content) >= PerkKill*3) return message.member.send('You can not have all or more than the existant perks.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      p3.delete(message.author.id)
      perks1[message.author.id] = message.content;
      if(message.member) message.channel.send('Enter the level your character is, '+message.member.user)
        else message.channel.send('Enter the level your character is, '+message.author.tag)
      p4.add(message.author.id)
      return;
    }

    if(p4.has(message.author.id))
    {
      if(message.content % 1 != '0') 
      {
        p4.delete(message.author.id)
        message.member.send('The number can not contain dots, the calculate function was canceled.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
        return;
      }
      if(parseInt(message.content) > 50 || parseInt(message.content) < 1) return message.member.send('Nivel inválido.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      p4.delete(message.author.id)
      NivelPJ[message.author.id] = parseInt(message.content);
      let necesitaperks = PerkKill*Niveles-(3*perks3[message.author.id])-(2*perks2[message.author.id])-perks1[message.author.id];
      DBC[message.author.id] = necesitaperks;
      let NivelValor = ObtenerNP(NivelPJ[message.author.id], message.author.id)
      const embed = new Discord.RichEmbed()
            .setThumbnail(message.member.user.avatarURL)
            .setAuthor(message.member.displayName+'#'+message.member.user.discriminator, message.member.user.avatarURL)
            .setTitle('| Buy all the killer perks |')
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .addField('Bloodpoints needed <:bp:724724401333076071>', '**'+Coma(NivelValor)+'**', true)
            .addField('Levels bought', '**'+LC[message.author.id]+'**', true)
            .setColor(0xFF0000)
            message.channel.send({ embed });
      return;
    }

    if(ps1.has(message.author.id))
    {
      if(message.content % 1 != '0') 
      {
        ps1.delete(message.author.id)
        message.member.send('The number can not contain dots, the calculate function was canceled.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
        return;
      }
      if(parseInt(message.content)*3 >= PerkSurv*3) return message.member.send('You can not have all or more than the existant perks.').catch(function(err) { message.channel.send(message.member.user+'Activate your private messagges so the bot can inform you.') } );
      if(parseInt(message.content) < 0) return message.member.send('You can not have less than 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      ps1.delete(message.author.id)
      perks3[message.author.id] = message.content;
      ps2.add(message.author.id)
      if(message.member) message.channel.send('Enter how many level 2 perks you have, '+message.member.user)
        else message.channel.send('Enter how many level 2 perks you have, '+message.author.tag)
      return;
    }

    if(ps2.has(message.author.id))
    {
      if(message.content % 1 != '0') 
      {
        ps2.delete(message.author.id)
        message.member.send('The number can not contain dots, the calculate function was canceled.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
        return;
      }
      if(parseInt(message.content)*2 >= PerkSurv*3) return message.member.send('You can not have all or more than the existant perks.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      if(parseInt(message.content) < 0) return message.member.send('You can not have less than 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      if(perks3[message.author.id]*3+parseInt(message.content)*2 >= PerkSurv*3) return message.member.send('You can not have all or more than the existant perks.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      ps2.delete(message.author.id)
      perks2[message.author.id] = message.content;
      if(message.member) message.channel.send('Enter how many level 1 perks you have, '+message.member.user)
        else message.channel.send('Enter how many level 1 perks you have, '+message.author.tag)
      ps3.add(message.author.id)
      return;
    }

    if(ps3.has(message.author.id))
    {
      if(message.content % 1 != '0') 
      {
        ps3.delete(message.author.id)
        message.member.send('The number can not contain dots, the calculate function was canceled.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
        return;
      }
      if(parseInt(message.content) >= PerkSurv*3) return message.member.send('You can not have all or more than the existant perks.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      if(parseInt(message.content) < 0) return message.member.send('You can not have less than 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      if(perks3[message.author.id]*3+perks2[message.author.id]*2+parseInt(message.content) >= PerkSurv*3) return message.member.send('You can not have all or more than the existant perks.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      ps3.delete(message.author.id)
      perks1[message.author.id] = message.content;
      if(message.member) message.channel.send('Enter the level your character is, '+message.member.user)
        else message.channel.send('Enter the level your character is, '+message.author.tag)
      ps4.add(message.author.id)
      return;
    }

    if(ps4.has(message.author.id))
    {
      if(message.content % 1 != '0') 
      {
        ps4.delete(message.author.id)
        message.member.send('The number can not contain dots, the calculate function was canceled.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
        return;
      }
      if(parseInt(message.content) > 50 || parseInt(message.content) < 1) return message.member.send('Nivel inválido.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
      ps4.delete(message.author.id)
      NivelPJ[message.author.id] = parseInt(message.content);
      let necesitaperks = PerkSurv*Niveles-(3*perks3[message.author.id])-(2*perks2[message.author.id])-perks1[message.author.id];
      DBC[message.author.id] = necesitaperks;
      let NivelValor = ObtenerNP(NivelPJ[message.author.id], message.author.id)
      const embed = new Discord.RichEmbed()
            .setThumbnail(message.member.user.avatarURL)
            .setAuthor(message.member.user.username+'#'+message.member.user.discriminator, message.member.user.avatarURL)
            .setTitle('| Buy all the survivor perks |')
            .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
            .addField('Bloodpoints needed <:bp:724724401333076071>', '**'+Coma(NivelValor)+'**', true)
            .addField('Levels bought', '**'+LC[message.author.id]+'**', true)
            .setColor(0xFF0000)
            message.channel.send({ embed });
      return;
    }    
  }

 const args = message.content.slice(1).trim().split(/ +/g);
 var jejox = args.shift();
 const command = jejox.toLowerCase();
 let texto = args.join(" ");
 const usa = new Date();

 if(prefix[message.guild.id] == null) prefix[message.guild.id] = '/';
 if(lenguaje[message.guild.id] == null) lenguaje[message.guild.id] = 0;
 if(message.content.startsWith(prefix[message.guild.id]))
 {
   if(lenguaje[message.guild.id] == 0)
   {
     if (cid[message.guild.id] != null && message.channel.id != cid[message.guild.id])
     {
    const disc = client.channels.get(cid[message.guild.id]);
    message.channel.send('Las utilidades del bot solo pueden ser usadas en el canal de: '+disc)
    return;
    }
  if(p1.has(message.author.id)) p1.delete(message.author.id)
  if(p2.has(message.author.id)) p2.delete(message.author.id)
  if(p3.has(message.author.id)) p3.delete(message.author.id)
  if(p4.has(message.author.id)) p4.delete(message.author.id)
  if(command == 'calcular')
  {
    if(!texto) return message.member.send('Usa: **'+prefix[message.guild.id]+'calcular [Opción]** | Opciones: Killer o Survivor | Comando para obtener puntos de sangre necesarios para comprar todas las perks desde el nivel que estés.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
    if(p1.has(message.author.id)) return message.member.send('Ya tienes una solicitud abierta.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
    if(texto.toLowerCase() == 'killer')
    {
      LC[message.author.id] = 0;
      message.channel.send('Ingresa cuántas perks a nivel 3 tienes, '+message.member.user)
      p1.add(message.author.id)
      return;
    }
    if(texto.toLowerCase() == 'survivor')
    {
      LC[message.author.id] = 0;
      message.channel.send('Ingresa cuántas perks a nivel 3 tienes, '+message.member.user)
      ps1.add(message.author.id)
      return;
    }
    message.member.send('Usa: **'+prefix[message.guild.id]+'calcular [Opción]** | Opciones: Killer o Survivor | Comando para obtener puntos de sangre necesarios para comprar todas las perks desde el nivel que estés.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
    return;
     }

     if(command == 'español') return message.channel.send('El bot ya está configurado en español.')
     if(command == 'spanish') return message.channel.send('El bot ya está configurado en español.')

     if(command == 'english')
     {
      if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('El comando sólo puede ser usado por personas con permisos de Administrador. || The command can only be used by people with Administrator permissions.')
      lenguaje[message.guild.id] = 1;
      con.query(`SELECT * FROM Servidores WHERE ID = ${message.guild.id}`, (err, rows) => {
        if(err) throw err;
        if(rows.length >= 1)
        {
          con.query(`UPDATE Servidores SET lenguaje = 1 WHERE ID = ${message.guild.id}`)
        } else
        {
          con.query(`INSERT INTO Servidores (ID, lenguaje) VALUES ('${message.guild.id}', '1')`)
        }
      })
      message.channel.send('Okay, the bot is fully config in english. If you wanna take it back to spanish use **'+prefix[message.guild.id]+'spanish** | For assistance use **'+prefix[message.guild.id]+'help**')
      return;
     }

     if(command == 'sv')
     {
       if(message.author.id != '277506787261939712' && message.author.id != '313496742156959745' && message.author.id != '389320439932911626' && message.author.id != '169818091281186816') return message.member.send('SACA LA MANO DE AHÍ CARAJO',  {files: [{ attachment: 'https://i.ytimg.com/vi/7A6FricobFA/hqdefault.jpg',
       name: "SACA_LA_MANO.jpg"}]}); 
       message.channel.send('Estoy actualmente en **'+client.guilds.size+'** servidores.')
      return;
     }

     if(command == 'forzar')
     {
      if(message.author.id != '277506787261939712' && message.author.id != '313496742156959745' && message.author.id != '389320439932911626' && message.author.id != '169818091281186816') return message.member.send('SACA LA MANO DE AHÍ CARAJO',  {files: [{ attachment: 'https://i.ytimg.com/vi/7A6FricobFA/hqdefault.jpg',
      name: "SACA_LA_MANO.jpg"}]}); 
      let options = {
        host: 'dbd.onteh.net.au',
        path: '/api/shrine',
        agent: false
        };
        const req = https.get(options, function (res) {
          var bodyChunks2 = [];
          res.on('data', function (chunk) {
              bodyChunks2.push(chunk);
          }).on('end', function () {
            var body2 = Buffer.concat(bodyChunks2);
            var perk_1_a = body2.slice(body2.indexOf('"id"')+6)
            body2 = perk_1_a;
            var perk_1_b = perk_1_a.slice(0, perk_1_a.indexOf('"'))
            var perk_2_a = body2.slice(body2.indexOf('"id"')+6)
            body2 = perk_2_a;
            var perk_2_b = perk_2_a.slice(0, perk_2_a.indexOf('"'))
            var perk_3_a = body2.slice(body2.indexOf('"id"')+6)
            body2 = perk_3_a;
            var perk_3_b = perk_3_a.slice(0, perk_3_a.indexOf('"'))
            var perk_4_a = body2.slice(body2.indexOf('"id"')+6)
            var perk_4_b = perk_4_a.slice(0, perk_4_a.indexOf('"'))
            con.query(`DELETE FROM santuario`)
            con.query(`INSERT INTO santuario (perk_1, perk_2, perk_3, perk_4) VALUES ('${perk_1_b}', '${perk_2_b}', '${perk_3_b}', '${perk_4_b}')`)
          })
        })
        return;
     }

     if(command == 'santuario')
     {
      con.query(`SELECT * FROM santuario`, (err, rows) => {
        if(err) throw err;
        let perkk_1 = rows[0].perk_1
        let perkk_2 = rows[0].perk_2
        let perkk_3 = rows[0].perk_3
        let perkk_4 = rows[0].perk_4
        let numerop1 = ObtenerNumeroPerk(perkk_1.toLowerCase())
        let numerop2 = ObtenerNumeroPerk(perkk_2.toLowerCase())
        let numerop3 = ObtenerNumeroPerk(perkk_3.toLowerCase())
        let numerop4 = ObtenerNumeroPerk(perkk_4.toLowerCase())
        let perkf1 = TraducirPerk(perkk_1.toLowerCase(), message.author.id)
        let pr1 = k[message.author.id]
        let perkf2 = TraducirPerk(perkk_2.toLowerCase(), message.author.id)
        let pr2 = k[message.author.id]
        let perkf3 = TraducirPerk(perkk_3.toLowerCase(), message.author.id)
        let pr3 = k[message.author.id]
        let perkf4 = TraducirPerk(perkk_4.toLowerCase(), message.author.id)
        let pr4 = k[message.author.id]
        const embed = new Discord.RichEmbed()
      .setThumbnail(message.member.user.avatarURL)
      .setAuthor('| '+message.author.tag+' |', )
      .setTitle('🈴 Santuario de los secretos:')
      .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
      .addField('Habilidades:', '**► '+perkf1+'** - <:frag_iri:739690491829813369>2000\n**► '+perkf2+'** - <:frag_iri:739690491829813369>2000\n**► '+perkf3+'** - <:frag_iri:739690491829813369>2000\n**► '+perkf4+'** - <:frag_iri:739690491829813369>2000', true)
      .setColor(0xFF0000)
      message.channel.send(embed).then(function(message) { message.channel.send(ObtenerIconPerk(numerop1, pr1)+' '+ObtenerIconPerk(numerop2, pr2)+' '+ObtenerIconPerk(numerop3, pr3)+' '+ObtenerIconPerk(numerop4, pr4)) })
     })
      return;
     }

     if(command == 'ayuda')
     {
      if(!texto)
      {
        const embedd = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setTitle('🔰 Ayuda - Comandos 🔰')
        .setAuthor(message.member.user.tag, message.member.user.avatarURL)
        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
        .setThumbnail(client.user.avatarURL)
        .addField(prefix[message.guild.id]+'discord', 'Para más info: **'+prefix[message.guild.id]+'ayuda discord**')
        .addField('NOTA:', 'Los paréntesis: **[]** no deben ser usados en los comandos, es simplemente para resaltar cómo se usa el comando.')
        .addField(prefix[message.guild.id]+'calcular [Killer o Survivor]', 'Para más info: **'+prefix[message.guild.id]+'ayuda calcular**')
        .addField(prefix[message.guild.id]+'stats [Survivor o Killer] [URL Perfil Steam o Código de amigo]', 'Para más info: **'+prefix[message.guild.id]+'ayuda stats**')
        .addField(prefix[message.guild.id]+'nivel [Nivel Actual] [Nivel Deseado]', 'Para más info: **'+prefix[message.guild.id]+'ayuda nivel**')
        .addField(prefix[message.guild.id]+'lobby', 'Para más info: **'+prefix[message.guild.id]+'ayuda lobby**')
        .addField(prefix[message.guild.id]+'random [Survivor o Killer]', 'Para más info: **'+prefix[message.guild.id]+'ayuda random**')
        .addField(prefix[message.guild.id]+'santuario', 'Te mostrará el santuario de los secretos actual del juego.')
        .addField(prefix[message.guild.id]+'ayuda admin', 'Mostrará los comandos que pueden ser utilizados por **administradores** para personalizar el bot.')
        .setTimestamp()
        .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL);
        message.channel.send(embedd)
        return;
      }
      else if(texto == 'admin')
      {
        if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('El comando sólo puede ser usado por personas con permisos de Administrador.')
        const embedd = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setTitle('🔰 Ayuda - Admins 🔰')
        .setAuthor(message.member.user.tag, message.member.user.avatarURL)
        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
        .setThumbnail(client.user.avatarURL)
        .addField(prefix[message.guild.id]+'prefijo [Opción]', 'Reemplaza **Opción** por el prefijo de comandos que te gustaría usar. Default: **/** | Opciones: **!**, **#**, **%**, **&**, **/**, **.** y **-**')
        .addField(prefix[message.guild.id]+'canal #nombre', 'Sólo puede ser usado por **ADMINISTRADORES**, puedes selecccionar un canal para que los comandos sólo funcionen allí. Usa **'+prefix[message.guild.id]+'canal borrar** para poder usarlos en cualquier canal nuevamente.')
        .setTimestamp()
        .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL);
        message.member.send(embedd)
        return;
      } 
      else if(texto == 'discord')
      {
        const embedd = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setTitle('🔰 '+prefix[message.guild.id]+'discord 🔰')
        .setAuthor(message.member.user.tag, message.member.user.avatarURL)
        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
        .setThumbnail(client.user.avatarURL)
        .addField('¿Para qué sirve?', 'Este comando te enviará el link para unir el bot al servidor que quieras y poder usarlo allí.')
        .setTimestamp()
        .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL);
        message.member.send(embedd)
        return;
      } 
      else if(texto == 'calcular')
      {
        const embedd = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setTitle('🔰 '+prefix[message.guild.id]+'calcular [Killer o Survivor] 🔰')
        .setAuthor(message.member.user.tag, message.member.user.avatarURL)
        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
        .setThumbnail(client.user.avatarURL)
        .addField('¿Para qué sirve?', 'Este comando es para calcular cuántos __puntos de sangre__ son necesarios para comprar todas las habilidades de todos los personajes. Se te preguntará la cantidad de perks que tengas con un personaje, y en base a eso el bot calculará las faltantes y cuántos puntos de sangre te costaría.')
        .addField('Ejemplo:', 'Si tengo a Meg Thomas sólo con sus 3 perks básicas, cada una a nivel 1 y quiero saber cuánto me costará obtener todas las perks de todos los supervivientes a nivel 3 deberé usar: **'+prefix[message.guild.id]+'calcular survivor** | Luego el bot me pedirá la cantidad de habilidades que tengo con Meg, y por último me dirá cuánto me costará obtener todas las perks.')
        .setTimestamp()
        .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL);
        message.member.send(embedd)
        return;
      }
      else if(texto == 'stats')
      {
        const embedd = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setTitle('🔰 '+prefix[message.guild.id]+'stats [Killer o Survivor] [URL Perfil Steam o Código de amigo] 🔰')
        .setAuthor(message.member.user.tag, message.member.user.avatarURL)
        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
        .setThumbnail(client.user.avatarURL)
        .addField('¿Para qué sirve?', 'Podrás obtener las estadísticas de un jugador de Steam de Dead By Daylight, recuerda que debe estar en público todas las configuraciones de privacidad.')
        .addField('Ejemplo:', 'Si quiero ver mis estadísticas de asesino usaré: **'+prefix[message.guild.id]+'stats killer steamcommunity.com/id/Crltoz/** | El link es el de mi perfil de Steam.')
        .setTimestamp()
        .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL);
        message.member.send(embedd)
        return;
      }
      else if(texto == 'nivel')
      {
        const embedd = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setTitle('🔰 '+prefix[message.guild.id]+'nivel [Nivel Actual] [Nivel Deseado] 🔰')
        .setAuthor(message.member.user.tag, message.member.user.avatarURL)
        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
        .setThumbnail(client.user.avatarURL)
        .addField('¿Para qué sirve?', 'Calcula los puntos de sangre necesarios para comprar los niveles de la red de sangre que quieras.')
        .addField('Ejemplo:', 'Si con Dwight estoy en nivel 5 y quiero llegar al 20 debo usar: **'+prefix[message.guild.id]+'nivel 5 20** | El bot me enviará toda la información de los puntos de sangre necesarios y la cantidad de niveles comprados.')
        .setTimestamp()
        .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL);
        message.member.send(embedd)
        return;
      }
      else if(texto == 'lobby')
      {
        const embedd = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setTitle('🔰 '+prefix[message.guild.id]+'lobby 🔰')
        .setAuthor(message.member.user.tag, message.member.user.avatarURL)
        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
        .setThumbnail(client.user.avatarURL)
        .addField('¿Para qué sirve?', 'El lobby tiene funciones como la de los comandos, pero se utiliza a través de reacciones para que las personas que no les gusta usar comandos puedan usar otra alternativa.')
        .setTimestamp()
        .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL);
        message.member.send(embedd)
        return;
      }
      else if(texto == 'random')
      {
        const embedd = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setTitle('🔰 '+prefix[message.guild.id]+'random [Survivor o Killer] 🔰')
        .setAuthor(message.member.user.tag, message.member.user.avatarURL)
        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
        .setThumbnail(client.user.avatarURL)
        .addField('¿Para qué sirve?', 'Este comando te dará un asesino o superviviente totalmente aleatorio, con una build de 4 perks al azar.')
        .addField('Ejemplo:', 'Si quiero un superviviente random con 4 habilidades debo usar: **'+prefix[message.guild.id]+'random survivor** | El bot me enviará un superviviente random con 4 habilidades al azar.')
        .setTimestamp()
        .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL);
        message.member.send(embedd)
        return;
      } else
      {
        const embedd = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setTitle('🔰 Ayuda - Comandos 🔰')
        .setAuthor(message.member.user.tag, message.member.user.avatarURL)
        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
        .setThumbnail(client.user.avatarURL)
        .addField(prefix[message.guild.id]+'discord', 'Para más info: **'+prefix[message.guild.id]+'ayuda discord**')
        .addField('NOTA:', 'Los paréntesis: **[]** no deben ser usados en los comandos, es simplemente para resaltar cómo se usa el comando.')
        .addField(prefix[message.guild.id]+'calcular [Killer o Survivor]', 'Para más info: **'+prefix[message.guild.id]+'ayuda calcular**')
        .addField(prefix[message.guild.id]+'stats [Survivor o Killer] [URL Perfil Steam o Código de amigo]', 'Para más info: **'+prefix[message.guild.id]+'ayuda stats**')
        .addField(prefix[message.guild.id]+'nivel [Nivel Actual] [Nivel Deseado]', 'Para más info: **'+prefix[message.guild.id]+'ayuda nivel**')
        .addField(prefix[message.guild.id]+'lobby', 'Para más info: **'+prefix[message.guild.id]+'ayuda lobby**')
        .addField(prefix[message.guild.id]+'random [Survivor o Killer]', 'Para más info: **'+prefix[message.guild.id]+'ayuda random**')
        .addField(prefix[message.guild.id]+'santuario', 'Te mostrará el santuario de los secretos actual del juego.')
        .addField(prefix[message.guild.id]+'ayuda admin', 'Mostrará los comandos que pueden ser utilizados por **administradores** para personalizar el bot.')
        .setTimestamp()
        .setFooter('La entidad - V' + version_bot + ' - Beta Pública', client.user.avatarURL);
        message.channel.send(embedd)
        return;
      }
    }

    if(command == 'prefijo')
    {
      if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('El comando sólo puede ser usado por personas con permisos de Administrador.')
      if(!texto) return message.channel.send('Usa **'+prefix[message.guild.id]+'prefijo [Opción]** | Reemplaza **Opción** por el prefijo de comandos que te gustaría usar. Default: **/** | Opciones: **!**, **#**, **%**, **&**, **/**, **.** y **-**')
      if(texto != '!' && texto != '#' && texto != '%' && texto != '&' && texto != '/' && texto != '.' && texto != '-') return message.channel.send('Usa **/prefijo [Opción]** | Reemplaza **Opción** por el prefijo de comandos que te gustaría usar. Default: **/** | Opciones: **!**, **#**, **%**, **&**, **/**, **.** y **-**')
      con.query(`SELECT * FROM Servidores WHERE ID = ${message.guild.id}`, (err, rows) =>{
        if(err) throw err;
        if(rows.length >= 1)
        {
          con.query(`UPDATE Servidores SET Prefix = '${texto}' WHERE ID = ${message.guild.id}`)
        } else
        {
          con.query(`INSERT INTO Servidores (ID, cid, Prefijo) VALUES ('${message.guild.id}', 'null', '${texto}')`)
        }
      })
      prefix[message.guild.id] = texto;
      message.channel.send(`Cambiaste el prefijo para usar comandos a: **${texto}**`)
      return;    
    }

    if(command == 'discord')
    {
      message.channel.send('<:Entityicon:733814957111771146> Agrega el bot a tu servidor con el URL: **https://cutt.ly/entidadbot**')
      return;
    }

    
     if (command == 'stats') {
       if(!texto) return message.channel.send('Usa: **'+prefix[message.guild.id]+'stats [Survivor o Killer] [URL Perfil Steam o Código de amigo]**')
       if(args[0].toLowerCase() != 'killer' && args[0].toLowerCase() != 'survivor') return message.channel.send('Usa: **/stats [Survivor o Killer] [URL Perfil Steam]**')
       if(!args[1]) return message.channel.send('Usa: **'+prefix[message.guild.id]+'stats [Survivor o Killer] [URL Perfil Steam]**')
       let text = args[1];
       if(!text.includes('steamcommunity.com/id/') && !text.includes('steamcommunity.com/profiles/')) 
       {
        if(isNaN(args[1])) return message.channel.send('El código de amigo o el URL de perfil de Steam es incorrecto, '+message.member.user)
        if(args[1].length < 8) return message.channel.send('El código de amigo es incorrecto, '+message.member.user)
        let sid_2 = args[1];
        con.query(`SELECT * FROM EntityUsers WHERE SID = '${sid_2}'`, (err, rows) =>
        {
              if(err) throw err;
            if(rows.length >= 1)
            {
            let k_rank = rows[0].killer_rank_1
            let update_att = rows[0].update_at;
            let st = rows[0].state
            let bloodp = rows[0].bloodpoints_1
            if(k_rank == 0 || k_rank == 20 && bloodp == 0)
            {
              if((parseInt(usa.getTime())-parseInt(update_att)) < 60000*60*6 && st == 1)
              {
                message.channel.send('Tu cuenta de steam estaba en privado la última vez, puedes volver a chequear en **'+tiempo(360-((((parseInt(usa.getTime())-parseInt(update_att))/1000)/60)))+'** aproximadamente.')
                return;
              }
              else if((parseInt(usa.getTime())-parseInt(update_att)) < 1000*60*10 && st == 0)
              {
                message.channel.send('La cuenta de Steam está en la cola para ser agregada. Vuelve a intentar en **'+(10-Math.round((((parseInt(usa.getTime())-parseInt(update_att))/1000)/60)))+'** minutos aproximadamente.')
                return;
              }
              else
              {
                var options = {
                  host: 'dbd.onteh.net.au',
                  path: '/api/playerstats?steamid='+sid_2,
                  headers: { 'User-Agent': 'EntityBot/0.6.5' }
                };     
                var req1 = https.get(options, function (res) {
                  var bodyChunks_ = [];
                  res.on('data', function (chunk) {
                      bodyChunks_.push(chunk);
                  }).on('end', function () {
                  var body3 = Buffer.concat(bodyChunks_);
                  if(VerificarPrivado(body3) == 1) 
                  {
                    const embedd = new Discord.RichEmbed()
                    .setColor('#FF0000')
                    .setTitle('¡Ups! Esto es vergonzoso...')
                    .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                    .setThumbnail(message.member.user.avatarURL)
                    .addField('Al parecer tu cuenta está en privada.', 'Recuerda tener todas las opciones de privacidad en público.')
                    .addField('¿Ya cambiaste todas tus configuraciones a público y sigues sin aparecer?', 'Normalmente al pasar tu perfil a público, puede tardar desde 24 a 48 horas en actualizar tus datos la web (ajeno a nosotros).')
                    .addField('Si siempre tuviste todo en público y no funciona:', 'Revisa esta imagen y asegurate de tener todo en orden.')
                    .setTimestamp()
                    .setImage('https://cdn.discordapp.com/attachments/738848207328772237/739269462510796800/unknown.png')
                    .setFooter('La entidad', client.user.avatarURL);
                    message.channel.send(embedd)
                    con.query(`UPDATE EntityUsers SET state = 1, update_at = ${usa.getTime()} WHERE SID = '${sid_2}'`)
                    return;
                  }
                  if(isEmptyObject(body3))
                  {
                    message.channel.send('La cuenta de Steam está en la cola para ser agregada, intentalo en **10** minutos y recuerda que puede tardar hasta 1 hora.')
                    con.query(`UPDATE EntityUsers SET update_at = ${usa.getTime()}, state = 0 WHERE SID = '${sid_2}'`)
                    return;
                  } else
                  {
                            if(args[0].toLowerCase() == 'survivor') 
                            {
                              obtenervalorsurv(body3, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                            }
                            if(args[0].toLowerCase() == 'killer') 
                            {
                              obtenervalorkill(body3, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                            }
                  }
                  })
                  })
                }
              return;
              }
              else
            {
              if((parseInt(usa.getTime())-parseInt(update_att)) < 60000*60*3)
              {
                if(args[0].toLowerCase() == 'killer') 
                {
                  let bloodpoints = rows[0].bloodpoints_1
                  let killer_rank = rows[0].killer_rank_1
                  let killer_perfectgames = rows[0].killer_perfectgames_1
                  let killed = rows[0].killed_1
                  let killed_sacrificed_afterlastgen = rows[0].killed_sacrificed_afterlastgen_1
                  let sacrificed = rows[0].sacrificed_1
                  let chainsawhits = rows[0].chainsawhits_1
                  let beartrapcatches = rows[0].beartrapcatches_1
                  let hatchetsthrown = rows[0].hatchetsthrown_1
                  let survivorsgrabbedrepairinggen = rows[0].survivorsgrabbedrepairinggen_1
                  let survivorshitwhilecarrying = rows[0].survivorshitwhilecarrying_1
                  let hatchesclosed = rows[0].hatchesclosed_1
                  let survivorsinterruptedcleansingtotem = rows[0].survivorsinterruptedcleansingtotem_1
                  let playtime = rows[0].playtime_1
                  let name = rows[0].name_1     
                  const embedd = new Discord.RichEmbed()
                  .setColor('#FF0000')
                  .setTitle('Estadísticas de Asesino de '+name)
                  .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                  .setThumbnail('https://i.imgur.com/y4KRvLf.png')
                  .addField('<:bp:724724401333076071> Puntos de sangre totales:', Coma(bloodpoints), true)
                  .addField('Horas de juego:', Math.round(playtime/60), true)
                  .addBlankField()
                  .addField('Rango:', killer_rank, true)
                  .addField('Partidas perfectas:', killer_perfectgames,true)
                  .addField('<:Icons_killer:739182105870991410> Asesinatos con Mori:', killed, true)
                  .addField('<:Icons_Bgen:739182106474709042> Sacrificaste a todos después del último generador:', killed_sacrificed_afterlastgen,true)
                  .addField('Sacrificios en ganchos:', sacrificed,true)
                  .addField('Ataques con motosierra (HillBilly):', chainsawhits, true)
                  .addField('<:Icons_tramp:739182105900351578> Atrapados en trampas (Trampero):', beartrapcatches, true)
                  .addField('<:Icons_axe:739182102947299539> Hachas lanzadas:', hatchetsthrown, true)
                  .addField('<:Icons_Gen:739182107095466014> Surpervivientes interrumpidos en gens:', survivorsgrabbedrepairinggen, true)
                  .addField('<:icons_upa:739182105853952120> Supervivientes golpeados mientras cargas con otro:', survivorshitwhilecarrying, true)
                  .addField('<:Icons_Hatch:739182106751664168> Trampillas cerradas:', hatchesclosed, true)
                  .addField('<:icons_totem:739182106282033272> Supervivientes interrumpidos en totems:', survivorsinterruptedcleansingtotem, true)
                  .setTimestamp()
                  .setFooter('La entidad', client.user.avatarURL);
                  message.channel.send(embedd)
                  return;
                } else if(args[0].toLowerCase() == 'survivor') 
                {
                  let bloodpoints = rows[0].bloodpoints_1
                  let survivor_rank = rows[0].survivor_rank_1
                  let survivor_perfectgames = rows[0].survivor_perfectgames_1
                  let equivgensrepaired = rows[0].equivgensrepaired_1
                  let equivsurvivorshealed = rows[0].equivsurvivorshealed_1
                  let equivsurvivorshealed_coop = rows[0].equivsurvivorshealed_coop_1
                  let skillchecks = rows[0].skillchecks_1
                  let escaped = rows[0].escaped_1
                  let escaped_ko = rows[0].escaped_ko_1
                  let escaped_hatch = rows[0].escaped_hatch_1
                  let protectionhits = rows[0].protectionhits_1
                  let exitgatesopened = rows[0].exitgatesopened_1
                  let unhookedself = rows[0].unhookedself_1
                  let mysteryboxesopened = rows[0].mysteryboxesopened_1
                  let playtime = rows[0].playtime_1
                  let name = rows[0].name_1
                  const embedd = new Discord.RichEmbed()
                  .setColor('#FF0000')
                  .setTitle('Estadísticas de Superviviente de '+name)
                  .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                  .setThumbnail('https://i.imgur.com/DG6fm1A.png')
                  .addField('<:bp:724724401333076071> Puntos de sangre totales:', Coma(bloodpoints), true)
                  .addField('Horas de juego:', Math.round(playtime/60), true)
                  .addBlankField()
                  .addField('Rango:', survivor_rank, true)
                  .addField('<:icons_perfect:739182106139295915> Partidas perfectas:', survivor_perfectgames,true)
                  .addField('<:Icons_Gen:739182107095466014> Generadores reparados:', equivgensrepaired, true)
                  .addField('<:Icons_Aidkit:739182102427467817> Jugadores curados:', equivsurvivorshealed+'/'+equivsurvivorshealed_coop+' (Coop <:Icons_coop:739182106319650966>)',true)
                  .addField('<:icons_skillCheck:739182107259043860> SkillChecks:', skillchecks,true)
                  .addField('Total de Escapes:', escaped, true)
                  .addField('Escapes arrastrándose:', escaped_ko, true)
                  .addField('Escapes por trampilla:', escaped_hatch, true)
                  .addField('Zafarse del gancho:', unhookedself, true)
                  .addField('Hits de protección:', protectionhits, true)
                  .addField('Puertas abiertas:', exitgatesopened, true)
                  .addField('<:Icons_cofre:739182106651131957> Cofres abiertos:', mysteryboxesopened, true)
                  .setTimestamp()
                  .setFooter('La entidad', client.user.avatarURL)
                  message.channel.send(embedd)
                  return;
                }
              } else
              {
                var options = {
                  host: 'dbd.onteh.net.au',
                  path: '/api/playerstats?steamid='+sid_2,
                  headers: { 'User-Agent': 'EntityBot/0.6.5' }
                };      
                var req1 = https.get(options, function (res) {
                var bodyChunks2 = [];
                res.on('data', function (chunk) {
                    bodyChunks2.push(chunk);
                }).on('end', function () {
                    var body4 = Buffer.concat(bodyChunks2);
                    if(VerificarPrivado(body4) == 1)
                    {
                      const embedd = new Discord.RichEmbed()
                        .setColor('#FF0000')
                        .setTitle('¡Ups! Esto es vergonzoso...')
                        .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                        .setThumbnail(message.member.user.avatarURL)
                        .addField('Al parecer tu cuenta está en privada.', 'Recuerda tener todas las opciones de privacidad en público.')
                        .addField('¿Ya cambiaste todas tus configuraciones a público y sigues sin aparecer?', 'Normalmente al pasar tu perfil a público, puede tardar desde 24 a 48 horas en actualizar tus datos la web (ajeno a nosotros).')
                        .addField('Si siempre tuviste todo en público y no funciona:', 'Revisa esta imagen y asegurate de tener todo en orden.')
                        .addField('Tu cuenta no fue actualizada.', 'Anteriormente ya habías solicitado tus estadísticas correctamente, la próxima vez que solicites tus estadísticas se mostrarán las antiguas hasta que pongas tu perfil en público nuevamente.')
                        .setTimestamp()
                        .setImage('https://cdn.discordapp.com/attachments/738848207328772237/739269462510796800/unknown.png')
                        .setFooter('La entidad', client.user.avatarURL);
                        message.channel.send(embedd)
                        con.query(`UPDATE EntityUsers SET state = 1, update_at = ${usa.getTime()} WHERE SID = ${sid_2}`)
                        return;
                    }                  
                    if(args[0].toLowerCase() == 'survivor') 
                    {
                      obtenervalorsurv(body4, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                    }
                    if(args[0].toLowerCase() == 'killer') 
                    {
                      obtenervalorkill(body4, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                    }
                })
              });
              return;
              }
            }
          } else
          {
              var options = {
                host: 'dbd.onteh.net.au',
                path: '/api/playerstats?steamid='+sid_2,
                headers: { 'User-Agent': 'EntityBot/0.6.5' }
              }     
              var req1 = https.get(options, function (res) {
              var bodyChunks3 = [];
              res.on('data', function (chunk) {
                  bodyChunks3.push(chunk);
              }).on('end', function () {
                  var body5 = Buffer.concat(bodyChunks3);
                  if(VerificarPrivado(body5) == 1)
                  {
                    const embedd = new Discord.RichEmbed()
                    .setColor('#FF0000')
                    .setTitle('¡Ups! Esto es vergonzoso...')
                    .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                    .setThumbnail(message.member.user.avatarURL)
                    .addField('Al parecer tu cuenta está en privada.', 'Recuerda tener todas las opciones de privacidad en público.')
                    .addField('¿Ya cambiaste todas tus configuraciones a público y sigues sin aparecer?', 'Normalmente al pasar tu perfil a público, puede tardar desde 24 a 48 horas en actualizar tus datos la web (ajeno a nosotros).')
                    .addField('Si siempre tuviste todo en público y no funciona:', 'Revisa esta imagen y asegurate de tener todo en orden.')
                    .setTimestamp()
                    .setImage('https://cdn.discordapp.com/attachments/738848207328772237/739269462510796800/unknown.png')
                    .setFooter('La entidad', client.user.avatarURL);
                    message.channel.send(embedd)
                    con.query(`INSERT INTO EntityUsers (SID, update_at, state) VALUES ('${sid_2}', '${usa.getTime()}', '1')`)
                    return;
                  } 
                  if(isEmptyObject(body5))
                  {

                    var options2 = {
                      host: 'dbd.onteh.net.au',
                      path: '/api/playerstats?steamid='+sid_2,
                      method: 'POST',
                      headers: { 'User-Agent': 'EntityBot/0.6.5' }
                  };    
                    options2.agent = new https.Agent(options2)
                    const reqq1 = https.request(options2, (res) => {
                      if(res.statusCode == 404)
                      {
                        const embedd = new Discord.RichEmbed()
                          .setColor('#FF0000')
                          .setTitle('Cuenta inválida.')
                          .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                          .setThumbnail(client.user.avatarURL)
                          .addField('Código de amigo incorrecto.', 'Has proporcionado un código de amigo inexistente por lo cual no existen estadísticas de esa cuenta. Vuelve a intentarlo con otro diferente.')
                          .setTimestamp()
                          .setFooter('La entidad', client.user.avatarURL)
                          message.channel.send(embedd)
                          return;
                      }
                      if(res.statusCode != 201)
                      {
                          console.log('statusCode:', res.statusCode);
                          console.log('headers:', res.headers);
                          const embedd = new Discord.RichEmbed()
                          .setColor('#FF0000')
                          .setTitle('No podemos agregar tu cuenta...')
                          .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                          .setThumbnail(client.user.avatarURL)
                          .addField('Tenemos problemas con la web.', 'Actualmente, por muchas peticiones, la web no nos permite postear cuentas, por lo que deberás hacerlo apretando el botón de abajo y pegando tu link de perfil. Luego de ponerla ya podrás ver tus **/stats** por aquí sin problema.')
                          .addField('Agregar cuenta:', '[Haz click aquí](https://dbd.onteh.net.au)')
                          .setTimestamp()
                          .setFooter('La entidad', client.user.avatarURL)
                          message.channel.send(embedd)
                          return;
                      }
                      message.channel.send('La cuenta de Steam está en la cola para ser agregada ya que no estaba registrada, intentalo en **10** minutos y recuerda que puede tardar hasta 1 hora.')
                      con.query(`INSERT INTO EntityUsers (SID, update_at) VALUES ('${sid_2}', '${usa.getTime()}')`)
                      console.log('statusCode:', res.statusCode);
                      console.log('headers:', res.headers);
                    })
                    reqq1.on('error', (e) => {
                      console.error(e);
                    });
                    reqq1.end()
                    return;
                  }
                  if(args[0].toLowerCase() == 'survivor') 
                  {
                    obtenervalorsurv(body5, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                  }
                  if(args[0].toLowerCase() == 'killer') 
                  {
                    obtenervalorkill(body5, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                  }
              })
            });
          }
        })
        return;
       } else
       {
          var rid_1;
          var sid_1;
          var sid_2;
          let esprofile = 0;
          if(text.includes('id'))
          {
            rid_1 = text.slice(text.indexOf('id')+3, text.length)
            if(rid_1.includes('/')) 
            {
              rid_1 = rid_1.slice(0, rid_1.indexOf('/'))
            }
          } else
          {
            esprofile = 1;
            rid_1 = text.slice(text.indexOf('profiles')+9, text.length)
              if(rid_1.includes('/')) 
              {
                rid_1 = rid_1.slice(0, rid_1.indexOf('/'))
              }
            }

          let options = {
            host: 'api.steampowered.com',
            path: '/ISteamUser/ResolveVanityURL/v0001/?key=DF0A08E817CCE67F129D35FFFB14901A&vanityurl='+rid_1,
            headers: { 'User-Agent': 'EntityBot/0.6.5' }
            };
            const req = https.get(options, function (res) {
              var bodyChunks = [];
              res.on('data', function (chunk) {
                  bodyChunks.push(chunk);
              }).on('end', function () {
                  var body = Buffer.concat(bodyChunks);
                  console.log(`Stats esprofile: ${esprofile}`)
                  if(isEmptyObject(body) && esprofile == 0) return message.channel.send('La cuenta de Steam es inválida, recuerda que debe ser pública.')
                  if(esprofile == 0)
                  {
                    sid_1 = body.slice(body.indexOf('steamid')+10)
                    sid_2 = sid_1.slice(0, sid_1.indexOf(',')-1)
                  } else
                  {
                    sid_2 = rid_1;
                  }
                  if(sid_2.includes('u')) return message.channel.send('La cuenta de Steam es inválida, recuerda que debe ser pública.')
                  con.query(`SELECT * FROM EntityUsers WHERE SID = '${sid_2}'`, (err, rows) =>
                  {
                    if(err) throw err;
                  if(rows.length >= 1)
                  {
                  let k_rank = rows[0].killer_rank_1
                  let update_att = rows[0].update_at;
                  let st = rows[0].state
                  let bloodp = rows[0].bloodpoints_1
                  if(k_rank == 0 || k_rank == 20 && bloodp == 0)
                  {
                    if((parseInt(usa.getTime())-parseInt(update_att)) < 60000*60*6 && st == 1)
                    {
                      message.channel.send('Tu cuenta de steam estaba en privado la última vez, puedes volver a chequear en **'+tiempo(360-((((parseInt(usa.getTime())-parseInt(update_att))/1000)/60)))+'** aproximadamente.')
                      return;
                    }
                    else if((parseInt(usa.getTime())-parseInt(update_att)) < 1000*60*10 && st == 0)
                    {
                      message.channel.send('La cuenta de Steam está en la cola para ser agregada. Vuelve a intentar en **'+(10-Math.round((((parseInt(usa.getTime())-parseInt(update_att))/1000)/60)))+'** minutos aproximadamente.')
                      return;
                    }
                    else
                    {
                      var options = {
                        host: 'dbd.onteh.net.au',
                        path: '/api/playerstats?steamid='+sid_2,
                        headers: { 'User-Agent': 'EntityBot/0.6.5' }
                      };     
                      var req1 = https.get(options, function (res) {
                        var bodyChunks_ = [];
                        res.on('data', function (chunk) {
                            bodyChunks_.push(chunk);
                        }).on('end', function () {
                        var body3 = Buffer.concat(bodyChunks_);
                        if(VerificarPrivado(body3) == 1) 
                        {
                          const embedd = new Discord.RichEmbed()
                          .setColor('#FF0000')
                          .setTitle('¡Ups! Esto es vergonzoso...')
                          .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                          .setThumbnail(message.member.user.avatarURL)
                          .addField('Al parecer tu cuenta está en privada.', 'Recuerda tener todas las opciones de privacidad en público.')
                          .addField('¿Ya cambiaste todas tus configuraciones a público y sigues sin aparecer?', 'Normalmente al pasar tu perfil a público, puede tardar desde 24 a 48 horas en actualizar tus datos la web (ajeno a nosotros).')
                          .addField('Si siempre tuviste todo en público y no funciona:', 'Revisa esta imagen y asegurate de tener todo en orden.')
                          .setTimestamp()
                          .setImage('https://cdn.discordapp.com/attachments/738848207328772237/739269462510796800/unknown.png')
                          .setFooter('La entidad', client.user.avatarURL);
                          message.channel.send(embedd)
                          con.query(`UPDATE EntityUsers SET state = 1, update_at = ${usa.getTime()} WHERE SID = '${sid_2}'`)
                          return;
                        }
                        if(isEmptyObject(body3))
                        {
                          message.channel.send('La cuenta de Steam está en la cola para ser agregada, intentalo en **10** minutos y recuerda que puede tardar hasta 1 hora.')
                          con.query(`UPDATE EntityUsers SET update_at = ${usa.getTime()}, state = 0 WHERE SID = '${sid_2}'`)
                          return;
                        } else
                        {
                                  if(args[0].toLowerCase() == 'survivor') 
                                  {
                                    obtenervalorsurv(body3, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                                  }
                                  if(args[0].toLowerCase() == 'killer') 
                                  {
                                    obtenervalorkill(body3, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                                  }
                        }
                        })
                        })
                      }
                    return;
                    }
                    else
                  {
                    if((parseInt(usa.getTime())-parseInt(update_att)) < 60000*60*3)
                    {
                      if(args[0].toLowerCase() == 'killer') 
                      {
                        let bloodpoints = rows[0].bloodpoints_1
                        let killer_rank = rows[0].killer_rank_1
                        let killer_perfectgames = rows[0].killer_perfectgames_1
                        let killed = rows[0].killed_1
                        let killed_sacrificed_afterlastgen = rows[0].killed_sacrificed_afterlastgen_1
                        let sacrificed = rows[0].sacrificed_1
                        let chainsawhits = rows[0].chainsawhits_1
                        let beartrapcatches = rows[0].beartrapcatches_1
                        let hatchetsthrown = rows[0].hatchetsthrown_1
                        let survivorsgrabbedrepairinggen = rows[0].survivorsgrabbedrepairinggen_1
                        let survivorshitwhilecarrying = rows[0].survivorshitwhilecarrying_1
                        let hatchesclosed = rows[0].hatchesclosed_1
                        let survivorsinterruptedcleansingtotem = rows[0].survivorsinterruptedcleansingtotem_1
                        let playtime = rows[0].playtime_1
                        let name = rows[0].name_1     
                        const embedd = new Discord.RichEmbed()
                        .setColor('#FF0000')
                        .setTitle('Estadísticas de Asesino de '+name)
                        .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                        .setThumbnail('https://i.imgur.com/y4KRvLf.png')
                        .addField('<:bp:724724401333076071> Puntos de sangre totales:', Coma(bloodpoints), true)
                        .addField('Horas de juego:', Math.round(playtime/60), true)
                        .addBlankField()
                        .addField('Rango:', killer_rank, true)
                        .addField('Partidas perfectas:', killer_perfectgames,true)
                        .addField('<:Icons_killer:739182105870991410> Asesinatos con Mori:', killed, true)
                        .addField('<:Icons_Bgen:739182106474709042> Sacrificaste a todos después del último generador:', killed_sacrificed_afterlastgen,true)
                        .addField('Sacrificios en ganchos:', sacrificed,true)
                        .addField('Ataques con motosierra (HillBilly):', chainsawhits, true)
                        .addField('<:Icons_tramp:739182105900351578> Atrapados en trampas (Trampero):', beartrapcatches, true)
                        .addField('<:Icons_axe:739182102947299539> Hachas lanzadas:', hatchetsthrown, true)
                        .addField('<:Icons_Gen:739182107095466014> Surpervivientes interrumpidos en gens:', survivorsgrabbedrepairinggen, true)
                        .addField('<:icons_upa:739182105853952120> Supervivientes golpeados mientras cargas con otro:', survivorshitwhilecarrying, true)
                        .addField('<:Icons_Hatch:739182106751664168> Trampillas cerradas:', hatchesclosed, true)
                        .addField('<:icons_totem:739182106282033272> Supervivientes interrumpidos en totems:', survivorsinterruptedcleansingtotem, true)
                        .setTimestamp()
                        .setFooter('La entidad', client.user.avatarURL);
                        message.channel.send(embedd)
                        return;
                      } else if(args[0].toLowerCase() == 'survivor') 
                      {
                        let bloodpoints = rows[0].bloodpoints_1
                        let survivor_rank = rows[0].survivor_rank_1
                        let survivor_perfectgames = rows[0].survivor_perfectgames_1
                        let equivgensrepaired = rows[0].equivgensrepaired_1
                        let equivsurvivorshealed = rows[0].equivsurvivorshealed_1
                        let equivsurvivorshealed_coop = rows[0].equivsurvivorshealed_coop_1
                        let skillchecks = rows[0].skillchecks_1
                        let escaped = rows[0].escaped_1
                        let escaped_ko = rows[0].escaped_ko_1
                        let escaped_hatch = rows[0].escaped_hatch_1
                        let protectionhits = rows[0].protectionhits_1
                        let exitgatesopened = rows[0].exitgatesopened_1
                        let unhookedself = rows[0].unhookedself_1
                        let mysteryboxesopened = rows[0].mysteryboxesopened_1
                        let playtime = rows[0].playtime_1
                        let name = rows[0].name_1
                        const embedd = new Discord.RichEmbed()
                        .setColor('#FF0000')
                        .setTitle('Estadísticas de Superviviente de '+name)
                        .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                        .setThumbnail('https://i.imgur.com/DG6fm1A.png')
                        .addField('<:bp:724724401333076071> Puntos de sangre totales:', Coma(bloodpoints), true)
                        .addField('Horas de juego:', Math.round(playtime/60), true)
                        .addBlankField()
                        .addField('Rango:', survivor_rank, true)
                        .addField('<:icons_perfect:739182106139295915> Partidas perfectas:', survivor_perfectgames,true)
                        .addField('<:Icons_Gen:739182107095466014> Generadores reparados:', equivgensrepaired, true)
                        .addField('<:Icons_Aidkit:739182102427467817> Jugadores curados:', equivsurvivorshealed+'/'+equivsurvivorshealed_coop+' (Coop <:Icons_coop:739182106319650966>)',true)
                        .addField('<:icons_skillCheck:739182107259043860> SkillChecks:', skillchecks,true)
                        .addField('Total de Escapes:', escaped, true)
                        .addField('Escapes arrastrándose:', escaped_ko, true)
                        .addField('Escapes por trampilla:', escaped_hatch, true)
                        .addField('Zafarse del gancho:', unhookedself, true)
                        .addField('Hits de protección:', protectionhits, true)
                        .addField('Puertas abiertas:', exitgatesopened, true)
                        .addField('<:Icons_cofre:739182106651131957> Cofres abiertos:', mysteryboxesopened, true)
                        .setTimestamp()
                        .setFooter('La entidad', client.user.avatarURL)
                        message.channel.send(embedd)
                        return;
                      }
                    } else
                    {
                      var options = {
                        host: 'dbd.onteh.net.au',
                        path: '/api/playerstats?steamid='+sid_2,
                        headers: { 'User-Agent': 'EntityBot/0.6.5' }
                      };      
                      var req1 = https.get(options, function (res) {
                      var bodyChunks2 = [];
                      res.on('data', function (chunk) {
                          bodyChunks2.push(chunk);
                      }).on('end', function () {
                          var body4 = Buffer.concat(bodyChunks2);
                          if(VerificarPrivado(body4) == 1)
                          {
                            const embedd = new Discord.RichEmbed()
                              .setColor('#FF0000')
                              .setTitle('¡Ups! Esto es vergonzoso...')
                              .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                              .setThumbnail(message.member.user.avatarURL)
                              .addField('Al parecer tu cuenta está en privada.', 'Recuerda tener todas las opciones de privacidad en público.')
                              .addField('¿Ya cambiaste todas tus configuraciones a público y sigues sin aparecer?', 'Normalmente al pasar tu perfil a público, puede tardar desde 24 a 48 horas en actualizar tus datos la web (ajeno a nosotros).')
                              .addField('Si siempre tuviste todo en público y no funciona:', 'Revisa esta imagen y asegurate de tener todo en orden.')
                              .addField('Tu cuenta no fue actualizada.', 'Anteriormente ya habías solicitado tus estadísticas correctamente, la próxima vez que solicites tus estadísticas se mostrarán las antiguas hasta que pongas tu perfil en público nuevamente.')
                              .setTimestamp()
                              .setImage('https://cdn.discordapp.com/attachments/738848207328772237/739269462510796800/unknown.png')
                              .setFooter('La entidad', client.user.avatarURL);
                              message.channel.send(embedd)
                              con.query(`UPDATE EntityUsers SET state = 1, update_at = ${usa.getTime()} WHERE SID = ${sid_2}`)
                              return;
                          }                  
                          if(args[0].toLowerCase() == 'survivor') 
                          {
                            obtenervalorsurv(body4, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                          }
                          if(args[0].toLowerCase() == 'killer') 
                          {
                            obtenervalorkill(body4, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                          }
                      })
                    });
                    return;
                    }
                  }
                } else
                {
                    var options = {
                      host: 'dbd.onteh.net.au',
                      path: '/api/playerstats?steamid='+sid_2,
                      headers: { 'User-Agent': 'EntityBot/0.6.5' }
                    }     
                    var req1 = https.get(options, function (res) {
                    var bodyChunks3 = [];
                    res.on('data', function (chunk) {
                        bodyChunks3.push(chunk);
                    }).on('end', function () {
                        var body5 = Buffer.concat(bodyChunks3);
                        if(VerificarPrivado(body5) == 1)
                        {
                          const embedd = new Discord.RichEmbed()
                          .setColor('#FF0000')
                          .setTitle('¡Ups! Esto es vergonzoso...')
                          .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                          .setThumbnail(message.member.user.avatarURL)
                          .addField('Al parecer tu cuenta está en privada.', 'Recuerda tener todas las opciones de privacidad en público.')
                          .addField('¿Ya cambiaste todas tus configuraciones a público y sigues sin aparecer?', 'Normalmente al pasar tu perfil a público, puede tardar desde 24 a 48 horas en actualizar tus datos la web (ajeno a nosotros).')
                          .addField('Si siempre tuviste todo en público y no funciona:', 'Revisa esta imagen y asegurate de tener todo en orden.')
                          .setTimestamp()
                          .setImage('https://cdn.discordapp.com/attachments/738848207328772237/739269462510796800/unknown.png')
                          .setFooter('La entidad', client.user.avatarURL);
                          message.channel.send(embedd)
                          con.query(`INSERT INTO EntityUsers (SID, update_at, state) VALUES ('${sid_2}', '${usa.getTime()}', '1')`)
                          return;
                        } 
                        if(isEmptyObject(body5))
                        {

                          var options2 = {
                            host: 'dbd.onteh.net.au',
                            path: '/api/playerstats?steamid='+sid_2,
                            method: 'POST',
                            headers: { 'User-Agent': 'EntityBot/0.6.5' }
                        };    
                          options2.agent = new https.Agent(options2)
                          const reqq1 = https.request(options2, (res) => {
                            if(res.statusCode == 404)
                            {
                              const embedd = new Discord.RichEmbed()
                                .setColor('#FF0000')
                                .setTitle('Cuenta inválida.')
                                .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                                .setThumbnail(client.user.avatarURL)
                                .addField('URL de Steam incorrecto.', 'Has proporcionado un URL de Steam inexistente por lo cual no existen estadísticas de esa cuenta. Vuelve a intentarlo con otro diferente.')
                                .setTimestamp()
                                .setFooter('La entidad', client.user.avatarURL)
                                message.channel.send(embedd)
                                return;
                            }
                            if(res.statusCode != 201)
                            {
                                console.log('statusCode:', res.statusCode);
                                console.log('headers:', res.headers);
                                const embedd = new Discord.RichEmbed()
                                .setColor('#FF0000')
                                .setTitle('No podemos agregar tu cuenta...')
                                .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                                .setThumbnail(client.user.avatarURL)
                                .addField('Tenemos problemas con la web.', 'Actualmente, por muchas peticiones, la web no nos permite postear cuentas, por lo que deberás hacerlo apretando el botón de abajo y pegando tu link de perfil. Luego de ponerla ya podrás ver tus **/stats** por aquí sin problema.')
                                .addField('Agregar cuenta:', '[Haz click aquí](https://dbd.onteh.net.au)')
                                .setTimestamp()
                                .setFooter('La entidad', client.user.avatarURL)
                                message.channel.send(embedd)
                                return;
                            }
                            message.channel.send('La cuenta de Steam está en la cola para ser agregada ya que no estaba registrada, intentalo en **10** minutos y recuerda que puede tardar hasta 1 hora.')
                            con.query(`INSERT INTO EntityUsers (SID, update_at) VALUES ('${sid_2}', '${usa.getTime()}')`)
                            console.log('statusCode:', res.statusCode);
                            console.log('headers:', res.headers);
                          })
                          reqq1.on('error', (e) => {
                            console.error(e);
                          });
                          reqq1.end()
                          return;
                        }
                        if(args[0].toLowerCase() == 'survivor') 
                        {
                          obtenervalorsurv(body5, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                        }
                        if(args[0].toLowerCase() == 'killer') 
                        {
                          obtenervalorkill(body5, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                        }
                    })
                  });
                }
              })
            })
          })
        }
        return;
      }


  if(command == 'nivel')
  {
    if(!texto) return message.member.send('Ingresa: **'+prefix[message.guild.id]+'nivel [Nivel Actual] [Nivel Deseado]** | Te dirá la cantidad de puntos de sangre necesaria para llegar a ese nivel.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
    if(parseInt(args[0]) >= parseInt(args[1])) return message.member.send('El nivel deseado no puede ser mayor o igual al que tenes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
    if(parseInt(args[1]) > 50 || parseInt(args[0])  < 1 || parseInt(args[0]) > 50) return message.member.send('El nivel iniciado debe ser entre 1 y 49, y el nivel deseado entre 1 y 50.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
    if(parseInt(args[1])  % 1 != '0' || parseInt(args[0]) % 1 != '0') return message.member.send('El nivel no puede tener comas.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
    LC[message.author.id] = 0;
    let sangre = ObtenerValor(parseInt(args[0]),parseInt(args[1]), message.author.id)
    const embed = new Discord.RichEmbed()
        .setThumbnail(message.member.user.avatarURL)
        .setAuthor(message.member.displayName+'#'+message.member.user.discriminator, message.member.user.avatarURL)
        .setTitle('| Subir Nivel |')
        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
        .addField('Puntos de Sangre necesarios <:bp:724724401333076071>', '**'+Coma(sangre)+'**', true)
        .addField('Niveles comprados', '**'+LC[message.author.id]+'**', true)
        .addField('ㅤ', 'ㅤ')
        .addField('Nivel Inicial', '**'+args[0]+'**', true)
        .addField('Nivel Final', '**'+args[1]+'**',true)
        .setColor(0xFF0000)
      message.channel.send({ embed });
      return;
  }
     
     if (command == 'canal') {
         if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('El comando sólo puede ser usado por personas con permisos de Administrador.')
         if (!texto) return message.member.send('Usa: **'+prefix[message.guild.id]+'canal #Nombre** | Para setear un canal donde puedan usarse los comandos. Si deseas quitar la restriccion de canales usa **'+prefix[message.guild.id]+'canal borrar**.')
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
         let canal = client.channels.get(channel_id)
         message.channel.send('A partir de ahora los comandos sólo funcionarán en: '+canal)
         return;
     }

     if (command == 'lobby') {
         if (lobby_set.has(message.author.id)) return message.channel.send(message.member.user+', has usado el lobby hace menos de 20 segundos.')
         lobby_set.add(message.author.id)
         const lembed = new Discord.RichEmbed()
             .setColor('#FF0000')
             .setTitle('🔰 Lobby 🔰')
             .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
             .setAuthor('Entidad', client.user.avatarURL)
             .setDescription('Selecciona el emoji de reacción para activar una función:')
             .setThumbnail(client.user.avatarURL)
             .addBlankField()
             .addField('1⃣ Calcular puntos de sangre de nivel a nivel.', 'Selecciona el nivel que tienes con tu personaje y al que quieres llegar, y te diré los puntos de sangre necesarios.')
             .addField('2⃣ Survivor random con 4 perks.', 'Te asignaré un survivor random con 4 perks.')
             .addField('3⃣ Killer random con 4 perks.', 'Te asignaré un killer random con 4 perks.')
             .addField('4⃣ Calcular puntos de sangre para obtener todas las perks.', 'Se calcula los puntos de sangre necesarios para comprar todas las perks de todos los personajes según las que ya tengas.')
             .addField('5⃣ Invitación del Discord Oficial del bot.', 'Aquí podrás obtener el link para unir el bot a tu Server de Discord o soporte del mismo.')
             
             .setTimestamp()
             .setFooter('V' + version_bot + ' - Beta Pública', client.user.avatarURL);
             message.channel.send(lembed).then(function (message) {
                 message.react("1⃣")
                 setTimeout(() => {
                     message.react('2⃣')
                     setTimeout(() => {
                         message.react('3⃣')
                         setTimeout(() => {
                             message.react('4⃣')
                             setTimeout(() => {
                              message.react('5⃣')
                          }, 50);
                         }, 100);
                     }, 300);
                 }, 400);
             })
         setTimeout(() => {
             lobby_set.delete(message.author.id)
         }, 120000);
             return;
     }

  
  if(command == 'random')
  {
    if(!texto) return message.member.send('Usa **'+prefix[message.guild.id]+'random [Survivor o Killer]** || Te retornará un survivor o killer aleatorio con 4 perks.')
    if(texto.toLowerCase() == 'survivor')
    {
    let numero = Math.floor(Math.random() * 24);
    let numero_perk_1 = Math.floor(Math.random() * PerkSurv);
    let numero_perk_2 = Math.floor(Math.random() * PerkSurv);
    if(numero_perk_2 == numero_perk_1)
    {
      while(numero_perk_2 == numero_perk_1)
      {
        console.log('Loop Linea 1888')
        numero_perk_2 = Math.floor(Math.random() * PerkSurv);
      }
    }
    let numero_perk_3 = Math.floor(Math.random() * PerkSurv);
    if(numero_perk_3 == numero_perk_1 || numero_perk_3 == numero_perk_2)
    {
      while(numero_perk_3 == numero_perk_1)
      {
        console.log('Loop Linea 1897')
        numero_perk_3 = Math.floor(Math.random() * PerkSurv);
      }
      while(numero_perk_3 == numero_perk_2)
      {
        console.log('Loop Linea 1902')
        numero_perk_3 = Math.floor(Math.random() * PerkSurv);
      }
    }
    let numero_perk_4 = Math.floor(Math.random() * PerkSurv);
    if(numero_perk_4 == numero_perk_1 || numero_perk_4 == numero_perk_2 || numero_perk_4 == numero_perk_3)
    {
      while(numero_perk_4 == numero_perk_1)
      {
        console.log('Loop Linea 1911')
        numero_perk_4 = Math.floor(Math.random() * PerkSurv);
      }
      while(numero_perk_4 == numero_perk_2)
      {
        console.log('Loop Linea 1916')
        numero_perk_4 = Math.floor(Math.random() * PerkSurv);
      }
      while(numero_perk_4 == numero_perk_3)
      {
        console.log('Loop Linea 1921')
        numero_perk_4 = Math.floor(Math.random() * PerkSurv);
      }
    }
    SurvivorRandom(numero);
    const embed = new Discord.RichEmbed()
        .setThumbnail(ImagenPersonaje)
        .setAuthor('| '+NombrePersonaje+' |', ImagenPersonaje)
        .setTitle('Perks:')
        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
        .addField('ㅤ', '**► '+ObtenerPerkSurv(numero_perk_1)+'**\n**► '+ObtenerPerkSurv(numero_perk_2)+'**\n**► '+ObtenerPerkSurv(numero_perk_3)+'**\n**► '+ObtenerPerkSurv(numero_perk_4)+'**', true)
        .setColor(0xFF0000)
    message.channel.send(embed).then(function(message) { message.channel.send(ObtenerIconPerk(numero_perk_1, 1)+' '+ObtenerIconPerk(numero_perk_2, 1)+' '+ObtenerIconPerk(numero_perk_3, 1)+' '+ObtenerIconPerk(numero_perk_4, 1)) })
    return;
    }
    else if(texto.toLowerCase() == 'killer')
    {
      let numero = Math.floor(Math.random() * 22);
      KillerRandom(numero);
      let numero_perk_1 = Math.floor(Math.random() * PerkKill);
      let numero_perk_2 = Math.floor(Math.random() * PerkKill);
      if(numero_perk_2 == numero_perk_1)
      {
        while(numero_perk_2 == numero_perk_1)
        {
          console.log('Loop Linea 1946')
          numero_perk_2 = Math.floor(Math.random() * PerkKill);
        }
      }
      let numero_perk_3 = Math.floor(Math.random() * PerkKill);
      if(numero_perk_3 == numero_perk_1 || numero_perk_3 == numero_perk_2)
      {
        while(numero_perk_3 == numero_perk_1)
        {
          console.log('Loop Linea 1955')
          numero_perk_3 = Math.floor(Math.random() * PerkKill);
        }
        while(numero_perk_3 == numero_perk_2)
        {
          console.log('Loop Linea 1960')
          numero_perk_3 = Math.floor(Math.random() * PerkKill);
        }
      }
      let numero_perk_4 = Math.floor(Math.random() * PerkKill);
      if(numero_perk_4 == numero_perk_1 || numero_perk_4 == numero_perk_2 || numero_perk_4 == numero_perk_3)
      {
        while(numero_perk_4 == numero_perk_1)
        {
          console.log('Loop Linea 1969')
          numero_perk_4 = Math.floor(Math.random() * PerkKill);
        }
        while(numero_perk_4 == numero_perk_2)
        {
          console.log('Loop Linea 1974')
          numero_perk_4 = Math.floor(Math.random() * PerkKill);
        }
        while(numero_perk_4 == numero_perk_3)
        {
          console.log('Loop Linea 1979')
          numero_perk_4 = Math.floor(Math.random() * PerkKill);
        }
      }
      const embed = new Discord.RichEmbed()
          .setThumbnail(ImagenPersonaje)
          .setAuthor('| '+NombrePersonaje+' |', ImagenPersonaje)
          .setTitle('Perks:')
          .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
          .addField('ㅤ', '**► '+ObtenerPerkKiller(numero_perk_1)+'**\n**► '+ObtenerPerkKiller(numero_perk_2)+'**\n**► '+ObtenerPerkKiller(numero_perk_3)+'**\n**► '+ObtenerPerkKiller(numero_perk_4)+'**', true)
          .setColor(0xFF0000)
          message.channel.send(embed).then(function(message) { message.channel.send(ObtenerIconPerk(numero_perk_1, 0)+' '+ObtenerIconPerk(numero_perk_2, 0)+' '+ObtenerIconPerk(numero_perk_3, 0)+' '+ObtenerIconPerk(numero_perk_4, 0)) })
      return;
    } else
    {
      message.member.send('Usa **/random [Survivor o Killer]** || Te retornará un survivor o killer aleatorio con 4 perks.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      return;
    }
  }
     message.member.send('El comando no existe. Usa **/ayuda** para ver todas las funciones y comandos.')
 } else
 {
  if (cid[message.guild.id] != null && message.channel.id != cid[message.guild.id])
  {
 const disc = client.channels.get(cid[message.guild.id]);
 message.channel.send('The bot utilities can only be used in the channel:'+disc)
 return;
 }
if(p1.has(message.author.id)) p1.delete(message.author.id)
if(p2.has(message.author.id)) p2.delete(message.author.id)
if(p3.has(message.author.id)) p3.delete(message.author.id)
if(p4.has(message.author.id)) p4.delete(message.author.id)
if(command == 'calculate')
{
 if(!texto) return message.member.send('Use: **'+prefix[message.guild.id]+'calculate [Option]** | Options: Killer or Survivor | This command tells you the amount of bloodpoints that you need to buy all the perks from the level you are.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
 if(texto.toLowerCase() == 'killer')
 {
   LC[message.author.id] = 0;
   message.channel.send('Enter how many level 3 perks you have, '+message.member.user)
   p1.add(message.author.id)
   return;
 }
 if(texto.toLowerCase() == 'survivor')
 {
   LC[message.author.id] = 0;
   message.channel.send('Enter how many level 3 perks you have, '+message.member.user)
   ps1.add(message.author.id)
   return;
 }
 message.member.send('Use: **'+prefix[message.guild.id]+'calculate [Option]** | Options: Killer or Survivor | This command tells you the amount of bloodpoints that you need to buy all the perks from the level you are.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
 return;
  }
  if(command == 'shrine')
  {
   con.query(`SELECT * FROM santuario`, (err, rows) => {
     if(err) throw err;
     let perkk_1 = rows[0].perk_1
     let perkk_2 = rows[0].perk_2
     let perkk_3 = rows[0].perk_3
     let perkk_4 = rows[0].perk_4
     let pk1, pk2, pk3, pk4;
     let numerop1 = ObtenerNumeroPerk(perkk_1.toLowerCase())
        let numerop2 = ObtenerNumeroPerk(perkk_2.toLowerCase())
        let numerop3 = ObtenerNumeroPerk(perkk_3.toLowerCase())
        let numerop4 = ObtenerNumeroPerk(perkk_4.toLowerCase())
        let perkf1 = TraducirPerk(perkk_1.toLowerCase(), message.author.id)
        let pr1 = k[message.author.id]
        if(pr1 == 0) pk1 = ObtenerPerkKiller_ING(numerop1)
        if(pr1 == 1) pk1 = ObtenerPerkSurv_ING(numerop1)
        let perkf2 = TraducirPerk(perkk_2.toLowerCase(), message.author.id)
        let pr2 = k[message.author.id]
        if(pr2 == 0) pk2 = ObtenerPerkKiller_ING(numerop2)
        if(pr2 == 1) pk2 = ObtenerPerkSurv_ING(numerop2)
        let perkf3 = TraducirPerk(perkk_3.toLowerCase(), message.author.id)
        let pr3 = k[message.author.id]
        if(pr3 == 0) pk3 = ObtenerPerkKiller_ING(numerop3)
        if(pr3 == 1) pk3 = ObtenerPerkSurv_ING(numerop3)
        let perkf4 = TraducirPerk(perkk_4.toLowerCase(), message.author.id)
        let pr4 = k[message.author.id]
        if(pr4 == 0) pk4 = ObtenerPerkKiller_ING(numerop4)
        if(pr4 == 1) pk4 = ObtenerPerkSurv_ING(numerop4)
     const embed = new Discord.RichEmbed()
   .setThumbnail(message.member.user.avatarURL)
   .setAuthor('| '+message.author.tag+' |', )
   .setTitle('🈴 Shrine of Secrets:')
   .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
   .addField('Perks:', '**► '+pk1+'** - <:frag_iri:739690491829813369>2000\n**► '+pk2+'** - <:frag_iri:739690491829813369>2000\n**► '+pk3+'** - <:frag_iri:739690491829813369>2000\n**► '+pk4+'** - <:frag_iri:739690491829813369>2000', true)
   .setColor(0xFF0000)
   message.channel.send(embed).then(function(message) { message.channel.send(ObtenerIconPerk(numerop1, pr1)+' '+ObtenerIconPerk(numerop2, pr2)+' '+ObtenerIconPerk(numerop3, pr3)+' '+ObtenerIconPerk(numerop4, pr4)) })
   })
   return;
  }

if(command == 'help')
  {
   if(!texto)
   {
     const embedd = new Discord.RichEmbed()
     .setColor('#FF0000')
     .setTitle('🔰 Help - Commands 🔰')
     .setAuthor(message.member.user.tag, message.member.user.avatarURL)
     .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
     .setThumbnail(client.user.avatarURL)
     .addField(prefix[message.guild.id]+'discord', 'More info: **'+prefix[message.guild.id]+'help discord**')
     .addField('BTW:', 'Brackets **[]** should not be used, only use spacebar between words.')
     .addField(prefix[message.guild.id]+'calculate [Killer or Survivor]', 'More info: **'+prefix[message.guild.id]+'help calculate**')
     .addField(prefix[message.guild.id]+'stats [Survivor or Killer] [Steam profile URL or Steam friend code]', 'More info: **'+prefix[message.guild.id]+'help stats**')
     .addField(prefix[message.guild.id]+'level [Current Level] [Level wanted]', 'More info: **'+prefix[message.guild.id]+'help level**')
     .addField(prefix[message.guild.id]+'lobby', 'More info: **'+prefix[message.guild.id]+'help lobby**')
     .addField(prefix[message.guild.id]+'random [Survivor or Killer]', 'More info: **'+prefix[message.guild.id]+'help random**')
     .addField(prefix[message.guild.id]+'shrine', 'It will show you the shrine of secrets that is current in the game.')
     .addField(prefix[message.guild.id]+'help admin', 'It will show you the commands that can only be use by **administrators** to customize the bot.')
     .setTimestamp()
     .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL);
     message.channel.send(embedd)
     return;
   }
   else if(texto == 'admin')
   {
     if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('This command is only availiable for administrator users.')
     const embedd = new Discord.RichEmbed()
     .setColor('#FF0000')
     .setTitle('🔰 Help - Admins 🔰')
     .setAuthor(message.member.user.tag, message.member.user.avatarURL)
     .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
     .setThumbnail(client.user.avatarURL)
     .addField(prefix[message.guild.id]+'Prefix [Option]', 'Replace **Option** with the prefix of your choice. Default: **/** | Options: **!**, **#**, **%**, **&**, **/**, **.** y **-**')
     .addField(prefix[message.guild.id]+'Channel #name', 'This only can be use by **ADMINISTRATOR** users. Just select a channel and the commands will only work there. Use'+prefix[message.guild.id]+'**canal borrar** and the commands will work in every channel.')
     .setTimestamp()
     .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL);
     message.member.send(embedd)
     return;
   } 
   else if(texto == 'discord')
   {
     const embedd = new Discord.RichEmbed()
     .setColor('#FF0000')
     .setTitle('🔰 '+prefix[message.guild.id]+'discord 🔰')
     .setAuthor(message.member.user.tag, message.member.user.avatarURL)
     .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
     .setThumbnail(client.user.avatarURL)
     .addField('What is it for?', 'This command will send you a link to join the bot to any discord server and use it there.')
     .setTimestamp()
     .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL);
     message.member.send(embedd)
     return;
   } 
   else if(texto == 'calculate')
   {
     const embedd = new Discord.RichEmbed()
     .setColor('#FF0000')
     .setTitle('🔰 '+prefix[message.guild.id]+'calculate [Killer or Survivor] 🔰')
     .setAuthor(message.member.user.tag, message.member.user.avatarURL)
     .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
     .setThumbnail(client.user.avatarURL)
     .addField('What is it for?', 'This command will calculate the amount of __Bloodpoints__ that you need to buy all the perks from a caracter. It will ask you how many perks of each level you have and the bot will calculate counting those perks you dont have and giving you the aproximate cost in Bloodpoints. ')
     .addField('For example:', 'If i have Meg Thomas only with his 3 teacheable perk, each one of them level 1 and i wanna know how many bloodpoints it will cost to buy all the perks availeable at level 3, just using: **'+prefix[message.guild.id]+'calculate survivor** | Then the bot will ask the amaount of perks that i have with Meg and then it will tell me how much it will cost.')
     .setTimestamp()
     .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL);
     message.member.send(embedd)
     return;
   }
   else if(texto == 'stats')
   {
     const embedd = new Discord.RichEmbed()
     .setColor('#FF0000')
     .setTitle('🔰 '+prefix[message.guild.id]+'stats [Killer or Survivor] [Steam profile URL or Steam friend code] 🔰')
     .setAuthor(message.member.user.tag, message.member.user.avatarURL)
     .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
     .setThumbnail(client.user.avatarURL)
     .addField('What is it for?', 'It will tell you specific stats of a Dead by Daylight Steam player, remember that the steam profile privacy config must be all public.')
     .addField('For example:', ' If i wanna see my killer stats i use: **'+prefix[message.guild.id]+'stats killer steamcommunity.com/id/Creepzstah** | This link is from my steam profile.')
     .setTimestamp()
     .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL);
     message.member.send(embedd)
     return;
   }
   else if(texto == 'level')
   {
     const embedd = new Discord.RichEmbed()
     .setColor('#FF0000')
     .setTitle('🔰 '+prefix[message.guild.id]+'level [Current Level] [Level wanted] 🔰')
     .setAuthor(message.member.user.tag, message.member.user.avatarURL)
     .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
     .setThumbnail(client.user.avatarURL)
     .addField('What is it for?', 'It calculate the amaount of Bloodpoints to buy those levels of bloodweb you want.')
     .addField('For example:', 'You have Dwight level 5 and you wanna level it up to 20 just use: **'+prefix[message.guild.id]+'level 5 20** | The bot will tell you the amaunt of bloodpoints needed and how many levels you wanna buy.')
     .setTimestamp()
     .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL);
     message.member.send(embedd)
     return;
   }
   else if(texto == 'lobby')
   {
     const embedd = new Discord.RichEmbed()
     .setColor('#FF0000')
     .setTitle('🔰 '+prefix[message.guild.id]+'lobby 🔰')
     .setAuthor(message.member.user.tag, message.member.user.avatarURL)
     .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
     .setThumbnail(client.user.avatarURL)
     .addField('What is it for?', 'The lobby works like the commands, but using reactions for those users that doesnt like using commands.')
     .setTimestamp()
     .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL);
     message.member.send(embedd)
     return;
   }
   else if(texto == 'random')
   {
     const embedd = new Discord.RichEmbed()
     .setColor('#FF0000')
     .setTitle('🔰 '+prefix[message.guild.id]+'random [Survivor or Killer] 🔰')
     .setAuthor(message.member.user.tag, message.member.user.avatarURL)
     .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
     .setThumbnail(client.user.avatarURL)
     .addField('What is it for?', 'It will show you a random 4 perk build for a random killer or survivor.')
     .addField('For example:', 'If you want a random survivor 4 perk build just use: **'+prefix[message.guild.id]+'random survivor** | The bot will send a random survivor 4 perk build.')
     .setTimestamp()
     .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL);
     message.member.send(embedd)
     return;
   } else
   {
     const embedd = new Discord.RichEmbed()
     .setColor('#FF0000')
     .setTitle('🔰 Help - Commands 🔰')
     .setAuthor(message.member.user.tag, message.member.user.avatarURL)
     .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
     .setThumbnail(client.user.avatarURL)
     .addField(prefix[message.guild.id]+'discord', 'More info: **'+prefix[message.guild.id]+'help discord**')
     .addField('BTW:', 'Brackets **[]** should not be used, only use spacebar between words.')
     .addField(prefix[message.guild.id]+'calculate [Killer or Survivor]', 'More info: **'+prefix[message.guild.id]+'help calculate**')
     .addField(prefix[message.guild.id]+'stats [Survivor or Killer] [Steam profile URL or Steam friend code]', 'More info: **'+prefix[message.guild.id]+'help stats**')
     .addField(prefix[message.guild.id]+'level [Current Level] [Level wanted]', 'More info: **'+prefix[message.guild.id]+'help level**')
     .addField(prefix[message.guild.id]+'lobby', 'More info: **'+prefix[message.guild.id]+'help lobby**')
     .addField(prefix[message.guild.id]+'random [Survivor or Killer]', 'More info: **'+prefix[message.guild.id]+'help random**')
     .addField(prefix[message.guild.id]+'shrine', 'It will show you the shrine of secrets that is current in the game.')
     .addField(prefix[message.guild.id]+'help admin', 'It will show you the commands that can only be use by **administrators** to customize the bot.')
     .setTimestamp()
     .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL);
     message.channel.send(embedd)
     return;
   }
 }

 if(command == 'prefix')
 {
   if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('The command can only be used by a administrator user.')
   if(!texto) return message.channel.send('Use **'+prefix[message.guild.id]+'prefix [Option]** | Replace **Option** with the prefix of your choice. Default: **/** | Options: **!**, **#**, **%**, **&**, **/**, **.** and **-**')
   if(texto != '!' && texto != '#' && texto != '%' && texto != '&' && texto != '/' && texto != '.' && texto != '-') return message.channel.send('Use **/prefix [Option]** | Replace **Option** with the prefix of your choice. Default: **/** | Options: **!**, **#**, **%**, **&**, **/**, **.** and **-**')
   con.query(`SELECT * FROM Servidores WHERE ID = ${message.guild.id}`, (err, rows) =>{
     if(err) throw err;
     if(rows.length >= 1)
     {
       con.query(`UPDATE Servidores SET Prefix = '${texto}' WHERE ID = ${message.guild.id}`)
     } else
     {
       con.query(`INSERT INTO Servidores (ID, cid, Prefijo) VALUES ('${message.guild.id}', 'null', '${texto}')`)
     }
   })
   prefix[message.guild.id] = texto;
   message.channel.send(`You have changed the commands prefix to: **${texto}**`)
   return;    
 }

 if(command == 'discord')
 {
   message.channel.send('<:Entityicon:733814957111771146> Add the bot to your discord server here: **https://cutt.ly/entidadbot** ')
   return;
 }

 if(command == 'english') return message.channel.send('The bot is fully config in english')
 if(command == 'spanish')
 {
 if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('El comando sólo puede ser usado por personas con permisos de Administrador. || The command can only be used by administrator users.')
   lenguaje[message.guild.id] = 0;
   con.query(`SELECT * FROM Servidores WHERE ID = ${message.guild.id}`, (err, rows) => {
    if(err) throw err;
    if(rows.length >= 1)
    {
      con.query(`UPDATE Servidores SET lenguaje = 0 WHERE ID = ${message.guild.id}`)
    } else
    {
      con.query(`INSERT INTO Servidores (ID, lenguaje) VALUES ('${message.guild.id}', '0')`)
    }
  })
   message.channel.send('Bien, el bot está configurado en español. Si desea volver a inglés use **'+prefix[message.guild.id]+'english**. Para consultar los comandos use **'+prefix[message.guild.id]+'ayuda**.')
   return;
   }

  if (command == 'stats') {
    if(!texto) return message.channel.send('Use: **'+prefix[message.guild.id]+'stats [Survivor or Killer] [Steam profile URL or Steam friend code]**')
    if(args[0].toLowerCase() != 'killer' && args[0].toLowerCase() != 'survivor') return message.channel.send('Use: **/stats [Survivor or Killer] [Steam profile URL]**')
    if(!args[1]) return message.channel.send('Use: **'+prefix[message.guild.id]+'stats [Survivor or Killer] [Steam profile URL]**')
    let text = args[1];
    if(!text.includes('steamcommunity.com/id/') && !text.includes('steamcommunity.com/profiles/')) 
    {
     if(isNaN(args[1])) return message.channel.send('Steam profile URL or friend code is not correct, '+message.member.user)
     if(args[1].length < 8) return message.channel.send('Steam friend code is not correct, '+message.member.user)
     let sid_2 = args[1];
     con.query(`SELECT * FROM EntityUsers WHERE SID = '${sid_2}'`, (err, rows) =>
     {
           if(err) throw err;
         if(rows.length >= 1)
         {
         let k_rank = rows[0].killer_rank_1
         let update_att = rows[0].update_at;
         let st = rows[0].state
         let bloodp = rows[0].bloodpoints_1
         if(k_rank == 0 || k_rank == 20 && bloodp == 0)
         {
           if((parseInt(usa.getTime())-parseInt(update_att)) < 60000*60*6 && st == 1)
           {
             message.channel.send('Your steam profile was private last time. Try again in **'+tiempo(360-((((parseInt(usa.getTime())-parseInt(update_att))/1000)/60)))+'** aprox.')
             return;
           }
           else if((parseInt(usa.getTime())-parseInt(update_att)) < 1000*60*10 && st == 0)
           {
             message.channel.send('The steam account is in queue for adding. Try again in **'+(10-Math.round((((parseInt(usa.getTime())-parseInt(update_att))/1000)/60)))+'** minutes aprox.')
             return;
           }
           else
           {//not for translate(host,path,headers)
             var options = {
               host: 'dbd.onteh.net.au',
               path: '/api/playerstats?steamid='+sid_2,
               headers: { 'User-Agent': 'EntityBot/0.6.5' }
             };     
             var req1 = https.get(options, function (res) {
               var bodyChunks_ = [];
               res.on('data', function (chunk) {
                   bodyChunks_.push(chunk);
               }).on('end', function () {
               var body3 = Buffer.concat(bodyChunks_);
               if(VerificarPrivado(body3) == 1) 
               {
                 const embedd = new Discord.RichEmbed()
                 .setColor('#FF0000')
                 .setTitle('¡Ups! This is embarrassing...')
                 .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                 .setThumbnail(message.member.user.avatarURL)
                 .addField('Seems like your steam account is private.', 'Remember switching all privacy options to public.')
                 .addField('Already changed all the privacy confing and still doesnt work?', 'Usually when switching the privacy confing to public might take between 24 to 48 hours to refresh the data from the web (Not in our hands).')
                 .addField('If your profile always has been public and still doesnt work:', 'Check this image and make sure you have everything in order')
                 .setTimestamp()
                 .setImage('https://cdn.discordapp.com/attachments/738848207328772237/739269462510796800/unknown.png')
                 .setFooter('Entity', client.user.avatarURL);
                 message.channel.send(embedd)
                 con.query(`UPDATE EntityUsers SET state = 1, update_at = ${usa.getTime()} WHERE SID = '${sid_2}'`)
                 return;
               }
               if(isEmptyObject(body3))
               {
                 message.channel.send('The steam account is in queue to be added, try again en **10** minutes and remember it might take up to 1 hour.')
                 con.query(`UPDATE EntityUsers SET update_at = ${usa.getTime()}, state = 0 WHERE SID = '${sid_2}'`)
                 return;
               } else
               {
                         if(args[0].toLowerCase() == 'survivor') 
                         {
                          obtenervalorsurv_ING(body3, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                         }
                         if(args[0].toLowerCase() == 'killer') 
                         {
                           obtenervalorkill_ING(body3, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                         }
               }
               })
               })
             }
           return;
           }
           else
         {
           if((parseInt(usa.getTime())-parseInt(update_att)) < 60000*60*3)
           {
             if(args[0].toLowerCase() == 'killer') 
             {
               let bloodpoints = rows[0].bloodpoints_1
               let killer_rank = rows[0].killer_rank_1
               let killer_perfectgames = rows[0].killer_perfectgames_1
               let killed = rows[0].killed_1
               let killed_sacrificed_afterlastgen = rows[0].killed_sacrificed_afterlastgen_1
               let sacrificed = rows[0].sacrificed_1
               let chainsawhits = rows[0].chainsawhits_1
               let beartrapcatches = rows[0].beartrapcatches_1
               let hatchetsthrown = rows[0].hatchetsthrown_1
               let survivorsgrabbedrepairinggen = rows[0].survivorsgrabbedrepairinggen_1
               let survivorshitwhilecarrying = rows[0].survivorshitwhilecarrying_1
               let hatchesclosed = rows[0].hatchesclosed_1
               let survivorsinterruptedcleansingtotem = rows[0].survivorsinterruptedcleansingtotem_1
               let playtime = rows[0].playtime_1
               let name = rows[0].name_1     
               const embedd = new Discord.RichEmbed()
               .setColor('#FF0000')
               .setTitle('Killer stats from '+name)
               .setAuthor(message.member.user.tag, message.member.user.avatarURL)
               .setThumbnail('https://i.imgur.com/y4KRvLf.png')
               .addField('<:bp:724724401333076071> Bloodpoints:', Coma(bloodpoints), true)
               .addField('In-game hours:', Math.round(playtime/60), true)
               .addBlankField()
               .addField('Rank:', killer_rank, true)
               .addField('Perfect games:', killer_perfectgames,true)
               .addField('<:Icons_killer:739182105870991410> Mori kills:', killed, true)
               .addField('<:Icons_Bgen:739182106474709042> 4 kills on hook after last gen:', killed_sacrificed_afterlastgen,true)
               .addField('On hook sacrifices:', sacrificed,true)
               .addField('Chainsaw hits (HillBilly):', chainsawhits, true)
               .addField('<:Icons_tramp:739182105900351578> Beartrap catches (Trapper):', beartrapcatches, true)
               .addField('<:Icons_axe:739182102947299539> Hatches thrown:', hatchetsthrown, true)
               .addField('<:Icons_Gen:739182107095466014> Survivors grabbed repairing gens:', survivorsgrabbedrepairinggen, true)
               .addField('<:icons_upa:739182105853952120> Survivors hit while carrying another survivor:', survivorshitwhilecarrying, true)
               .addField('<:Icons_Hatch:739182106751664168> Hatches closed:', hatchesclosed, true)
               .addField('<:icons_totem:739182106282033272> Survivors interrupted cleasing totems:', survivorsinterruptedcleansingtotem, true)
               .setTimestamp()
               .setFooter('Entity', client.user.avatarURL);
               message.channel.send(embedd)
               return;
             } else if(args[0].toLowerCase() == 'survivor') 
             {
               let bloodpoints = rows[0].bloodpoints_1
               let survivor_rank = rows[0].survivor_rank_1
               let survivor_perfectgames = rows[0].survivor_perfectgames_1
               let equivgensrepaired = rows[0].equivgensrepaired_1
               let equivsurvivorshealed = rows[0].equivsurvivorshealed_1
               let equivsurvivorshealed_coop = rows[0].equivsurvivorshealed_coop_1
               let skillchecks = rows[0].skillchecks_1
               let escaped = rows[0].escaped_1
               let escaped_ko = rows[0].escaped_ko_1
               let escaped_hatch = rows[0].escaped_hatch_1
               let protectionhits = rows[0].protectionhits_1
               let exitgatesopened = rows[0].exitgatesopened_1
               let unhookedself = rows[0].unhookedself_1
               let mysteryboxesopened = rows[0].mysteryboxesopened_1
               let playtime = rows[0].playtime_1
               let name = rows[0].name_1
               const embedd = new Discord.RichEmbed()
               .setColor('#FF0000')
               .setTitle('Survivor stats from '+name)
               .setAuthor(message.member.user.tag, message.member.user.avatarURL)
               .setThumbnail('https://i.imgur.com/DG6fm1A.png')
               .addField('<:bp:724724401333076071> Bloodpoints:', Coma(bloodpoints), true)
               .addField('In-game hours:', Math.round(playtime/60), true)
               .addBlankField()
               .addField('Rank:', survivor_rank, true)
               .addField('<:icons_perfect:739182106139295915> Perfect games:', survivor_perfectgames,true)
               .addField('<:Icons_Gen:739182107095466014> Gens repaired:', equivgensrepaired, true)
               .addField('<:Icons_Aidkit:739182102427467817> Survivors healed:', equivsurvivorshealed+'/'+equivsurvivorshealed_coop+' (Coop <:Icons_coop:739182106319650966>)',true)
               .addField('<:icons_skillCheck:739182107259043860> SkillChecks:', skillchecks,true)
               .addField('Escaped:', escaped, true)
               .addField('Escapes in dying state:', escaped_ko, true)
               .addField('Hatch escapes:', escaped_hatch, true)
               .addField('Self unhook:', unhookedself, true)
               .addField('Protection hits:', protectionhits, true)
               .addField('Exit gates opened:', exitgatesopened, true)
               .addField('<:Icons_cofre:739182106651131957> Mystery boxes opened:', mysteryboxesopened, true)
               .setTimestamp()
               .setFooter('Entity', client.user.avatarURL)
               message.channel.send(embedd)
               return;
             }
           } else
           {
             var options = {
               host: 'dbd.onteh.net.au',
               path: '/api/playerstats?steamid='+sid_2,
               headers: { 'User-Agent': 'EntityBot/0.6.5' }
             };      
             var req1 = https.get(options, function (res) {
             var bodyChunks2 = [];
             res.on('data', function (chunk) {
                 bodyChunks2.push(chunk);
             }).on('end', function () {
                 var body4 = Buffer.concat(bodyChunks2);
                 if(VerificarPrivado(body4) == 1)
                 {
                   const embedd = new Discord.RichEmbed()
                     .setColor('#FF0000')
                     .setTitle('¡Ups! This is embarrassing...')
                     .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                     .setThumbnail(message.member.user.avatarURL)
                     .addField('Seems like your steam account is private.', 'Remember switching all privacy options to public.')
                     .addField('Already changed all the privacy confing and still doesnt work?', 'Usually when switching the privacy confing to public might take between 24 to 48 hours to refresh the data from the web (Not in our hands)')
                     .addField('If your profile always has been public and still doesnt work:', 'Check this image and make sure you have everything in order')
                     .addField('Your account hasnt been updated.', 'Recently has requested your stats correctly, next time you request your stats it will show the old ones until your profile privacy config went back to public.')
                     .setTimestamp()
                     .setImage('https://cdn.discordapp.com/attachments/738848207328772237/739269462510796800/unknown.png')
                     .setFooter('Entity', client.user.avatarURL);
                     message.channel.send(embedd)
                     con.query(`UPDATE EntityUsers SET state = 1, update_at = ${usa.getTime()} WHERE SID = ${sid_2}`)
                     return;
                 }                  
                 if(args[0].toLowerCase() == 'survivor') 
                 {
                  obtenervalorsurv_ING(body4, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                 }
                 if(args[0].toLowerCase() == 'killer') 
                 {
                   obtenervalorkill_ING(body4, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                 }
             })
           });
           return;
           }
         }
       } else
       {
           var options = {
             host: 'dbd.onteh.net.au',
             path: '/api/playerstats?steamid='+sid_2,
             headers: { 'User-Agent': 'EntityBot/0.6.5' }
           }     
           var req1 = https.get(options, function (res) {
           var bodyChunks3 = [];
           res.on('data', function (chunk) {
               bodyChunks3.push(chunk);
           }).on('end', function () {
               var body5 = Buffer.concat(bodyChunks3);
               if(VerificarPrivado(body5) == 1)
               {
                 const embedd = new Discord.RichEmbed()
                 .setColor('#FF0000')
                 .setTitle('¡Ups! This is embarrassing...')
                 .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                 .setThumbnail(message.member.user.avatarURL)
                 .addField('Seems like your steam account is private.', 'Remember switching all privacy options to public.')
                 .addField('Already changed all the privacy confing and still doesnt work?', 'Usually when switching the privacy confing to public might take between 24 to 48 hours to refresh the data from the web (Not in our hands)')
                 .addField('If your profile always has been public and still doesnt work:', 'Check this image and make sure you have everything in order')
                 .setTimestamp()
                 .setImage('https://cdn.discordapp.com/attachments/738848207328772237/739269462510796800/unknown.png')
                 .setFooter('Entity', client.user.avatarURL);
                 message.channel.send(embedd)
                 con.query(`INSERT INTO EntityUsers (SID, update_at, state) VALUES ('${sid_2}', '${usa.getTime()}', '1')`)
                 return;
               } 
               if(isEmptyObject(body5))
               {

                 var options2 = {
                   host: 'dbd.onteh.net.au',
                   path: '/api/playerstats?steamid='+sid_2,
                   method: 'POST',
                   headers: { 'User-Agent': 'EntityBot/0.6.5' }
               };    
                 options2.agent = new https.Agent(options2)
                 const reqq1 = https.request(options2, (res) => {
                   if(res.statusCode == 404)
                         {
                           const embedd = new Discord.RichEmbed()
                             .setColor('#FF0000')
                             .setTitle('Invalid account.')
                             .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                             .setThumbnail(client.user.avatarURL)
                             .addField('Incorrect steam friend code.', 'Youd enter an non-existent steam friend code which means that the stats doesnt exist. Try again with a diferent code.')
                             .setTimestamp()
                             .setFooter('Entity', client.user.avatarURL)
                             message.channel.send(embedd)
                             return;
                         }
                   if(res.statusCode != 201)
                   {   
                       console.log('statusCode:', res.statusCode);
                       console.log('headers:', res.headers);
                       const embedd = new Discord.RichEmbed()
                       .setColor('#FF0000')
                       .setTitle('We couldnt add your account...')
                       .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                       .setThumbnail(client.user.avatarURL)
                       .addField('We are having troubles with the web.', 'Right now the web doesnt allow us to add more acounts, beacuse the amount of requests. Please click the button bellow and paste your steam profile URL. Later on you will be able to see your stats here **'+prefix[message.guild.id]+'stats**')
                       .addField('Add account:', '[Click here](https://dbd.onteh.net.au)')
                       .setTimestamp()
                       .setFooter('Entity', client.user.avatarURL)
                       message.channel.send(embedd)
                       return;
                   }
                   message.channel.send('The steam account is in queue to be added beacause it was not registred, try again in **10** minutes and remember it might take up to 1 hour.')
                   con.query(`INSERT INTO EntityUsers (SID, update_at) VALUES ('${sid_2}', '${usa.getTime()}')`)
                   console.log('statusCode:', res.statusCode);
                   console.log('headers:', res.headers);
                 })
                 reqq1.on('error', (e) => {
                   console.error(e);
                 });
                 reqq1.end()
                 return;
               }
               if(args[0].toLowerCase() == 'survivor') 
               {
                obtenervalorsurv_ING(body5, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
               }
               if(args[0].toLowerCase() == 'killer') 
               {
                 obtenervalorkill_ING(body5, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
               }
           })
         });
       }
     })
     return;
    } else
    {
       var rid_1;
       var sid_1;
       var sid_2;
       let esprofile = 0;
       if(text.includes('id'))
       {
         rid_1 = text.slice(text.indexOf('id')+3, text.length)
         if(rid_1.includes('/')) 
         {
           rid_1 = rid_1.slice(0, rid_1.indexOf('/'))
         }
       } else
       {
         esprofile = 1;
         rid_1 = text.slice(text.indexOf('profiles')+9, text.length)
           if(rid_1.includes('/')) 
           {
             rid_1 = rid_1.slice(0, rid_1.indexOf('/'))
           }
         }

       let options = {
         host: 'api.steampowered.com',
         path: '/ISteamUser/ResolveVanityURL/v0001/?key=DF0A08E817CCE67F129D35FFFB14901A&vanityurl='+rid_1,
         headers: { 'User-Agent': 'EntityBot/0.6.5' }
         };
         const req = https.get(options, function (res) {
           var bodyChunks = [];
           res.on('data', function (chunk) {
               bodyChunks.push(chunk);
           }).on('end', function () {
               var body = Buffer.concat(bodyChunks);
               if(isEmptyObject(body) && esprofile == 0) return message.channel.send('The steam account is invalid, remember switching the privacy config to public.')
               if(esprofile == 0)
               {
                 sid_1 = body.slice(body.indexOf('steamid')+10)
                 sid_2 = sid_1.slice(0, sid_1.indexOf(',')-1)
               } else
               {
                 sid_2 = rid_1;
               }
               if(sid_2.includes('u')) return message.channel.send('The steam account is invalid, remember switching the privacy config to public.')
               con.query(`SELECT * FROM EntityUsers WHERE SID = '${sid_2}'`, (err, rows) =>
               {
                 if(err) throw err;
               if(rows.length >= 1)
               {
               let k_rank = rows[0].killer_rank_1
               let update_att = rows[0].update_at;
               let st = rows[0].state
               let bloodp = rows[0].bloodpoints_1
               if(k_rank == 0 || k_rank == 20 && bloodp == 0)
               {
                 if((parseInt(usa.getTime())-parseInt(update_att)) < 60000*60*6 && st == 1)
                 {
                   message.channel.send('Your steam account was private last time, try again in  **'+tiempo(360-((((parseInt(usa.getTime())-parseInt(update_att))/1000)/60)))+'** aprox.')
                   return;
                 }
                 else if((parseInt(usa.getTime())-parseInt(update_att)) < 1000*60*10 && st == 0)
                 {
                   message.channel.send('The steam account is in queue to be added. Try again in **'+(10-Math.round((((parseInt(usa.getTime())-parseInt(update_att))/1000)/60)))+'** minutes aprox.')
                   return;
                 }
                 else
                 {
                   var options = {
                     host: 'dbd.onteh.net.au',
                     path: '/api/playerstats?steamid='+sid_2,
                     headers: { 'User-Agent': 'EntityBot/0.6.5' }
                   };     
                   var req1 = https.get(options, function (res) {
                     var bodyChunks_ = [];
                     res.on('data', function (chunk) {
                         bodyChunks_.push(chunk);
                     }).on('end', function () {
                     var body3 = Buffer.concat(bodyChunks_);
                     if(VerificarPrivado(body3) == 1) 
                     {
                       const embedd = new Discord.RichEmbed()
                       .setColor('#FF0000')
                       .setTitle('¡Ups! This is embarrassing...')
                       .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                       .setThumbnail(message.member.user.avatarURL)
                       .addField('Seems like your steam account is private.', 'Remember switching all privacy options to public.')
                       .addField('Already changed all the privacy confing and still doesnt work?', 'Usually when switching the privacy confing to public might take between 24 to 48 hours to refresh the data from the web (Not in our hands).')
                       .addField('If your profile always has been public and still doesnt work:', 'Check this image and make sure you have everything in order')
                       .setTimestamp()
                       .setImage('https://cdn.discordapp.com/attachments/738848207328772237/739269462510796800/unknown.png')
                       .setFooter('Entity', client.user.avatarURL);
                       message.channel.send(embedd)
                       con.query(`UPDATE EntityUsers SET state = 1, update_at = ${usa.getTime()} WHERE SID = '${sid_2}'`)
                       return;
                     }
                     if(isEmptyObject(body3))
                     {
                       message.channel.send('The steam account is in queue to be added, Try again in **10** minutes and remember it might take up to 1 hour.')
                       con.query(`UPDATE EntityUsers SET update_at = ${usa.getTime()}, state = 0 WHERE SID = '${sid_2}'`)
                       return;
                     } else
                     {
                               if(args[0].toLowerCase() == 'survivor') 
                               {
                                obtenervalorsurv_ING(body3, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                               }
                               if(args[0].toLowerCase() == 'killer') 
                               {
                                 obtenervalorkill_ING(body3, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                               }
                     }
                     })
                     })
                   }
                 return;
                 }
                 else
               {
                 if((parseInt(usa.getTime())-parseInt(update_att)) < 60000*60*3)
                 {
                   if(args[0].toLowerCase() == 'killer') 
                   {
                     let bloodpoints = rows[0].bloodpoints_1
                     let killer_rank = rows[0].killer_rank_1
                     let killer_perfectgames = rows[0].killer_perfectgames_1
                     let killed = rows[0].killed_1
                     let killed_sacrificed_afterlastgen = rows[0].killed_sacrificed_afterlastgen_1
                     let sacrificed = rows[0].sacrificed_1
                     let chainsawhits = rows[0].chainsawhits_1
                     let beartrapcatches = rows[0].beartrapcatches_1
                     let hatchetsthrown = rows[0].hatchetsthrown_1
                     let survivorsgrabbedrepairinggen = rows[0].survivorsgrabbedrepairinggen_1
                     let survivorshitwhilecarrying = rows[0].survivorshitwhilecarrying_1
                     let hatchesclosed = rows[0].hatchesclosed_1
                     let survivorsinterruptedcleansingtotem = rows[0].survivorsinterruptedcleansingtotem_1
                     let playtime = rows[0].playtime_1
                     let name = rows[0].name_1     
                     const embedd = new Discord.RichEmbed()
                     .setColor('#FF0000')
                     .setTitle('Killer stats from '+name)
                     .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                     .setThumbnail('https://i.imgur.com/y4KRvLf.png')
                     .addField('<:bp:724724401333076071> Bloodpoints:', Coma(bloodpoints), true)
                     .addField('In-game hours:', Math.round(playtime/60), true)
                     .addBlankField()
                     .addField('Rank:', killer_rank, true)
                     .addField('Perfect games:', killer_perfectgames,true)
                     .addField('<:Icons_killer:739182105870991410> Mori kills:', killed, true)
                     .addField('<:Icons_Bgen:739182106474709042> 4 kills on hook after last gen:', killed_sacrificed_afterlastgen,true)
                     .addField('On hook sacrifices:', sacrificed,true)
                     .addField('Chainsaw hits (HillBilly):', chainsawhits, true)
                     .addField('<:Icons_tramp:739182105900351578> Beartrap catches (Trapper):', beartrapcatches, true)
                     .addField('<:Icons_axe:739182102947299539> Hatches thrown:', hatchetsthrown, true)
                     .addField('<:Icons_Gen:739182107095466014> Survivors grabbed repairing gens:', survivorsgrabbedrepairinggen, true)
                     .addField('<:icons_upa:739182105853952120> Survivors hit while carrying another survivor:', survivorshitwhilecarrying, true)
                     .addField('<:Icons_Hatch:739182106751664168> Hatches closed:', hatchesclosed, true)
                     .addField('<:icons_totem:739182106282033272> Survivors interrupted cleasing totems:', survivorsinterruptedcleansingtotem, true)
                     .setTimestamp()
                     .setFooter('Entity', client.user.avatarURL);
                     message.channel.send(embedd)
                     return;
                   } else if(args[0].toLowerCase() == 'survivor') 
                   {
                     let bloodpoints = rows[0].bloodpoints_1
                     let survivor_rank = rows[0].survivor_rank_1
                     let survivor_perfectgames = rows[0].survivor_perfectgames_1
                     let equivgensrepaired = rows[0].equivgensrepaired_1
                     let equivsurvivorshealed = rows[0].equivsurvivorshealed_1
                     let equivsurvivorshealed_coop = rows[0].equivsurvivorshealed_coop_1
                     let skillchecks = rows[0].skillchecks_1
                     let escaped = rows[0].escaped_1
                     let escaped_ko = rows[0].escaped_ko_1
                     let escaped_hatch = rows[0].escaped_hatch_1
                     let protectionhits = rows[0].protectionhits_1
                     let exitgatesopened = rows[0].exitgatesopened_1
                     let unhookedself = rows[0].unhookedself_1
                     let mysteryboxesopened = rows[0].mysteryboxesopened_1
                     let playtime = rows[0].playtime_1
                     let name = rows[0].name_1
                     const embedd = new Discord.RichEmbed()
                     .setColor('#FF0000')
                     .setTitle('Survivor stats from '+name)
                     .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                     .setThumbnail('https://i.imgur.com/DG6fm1A.png')
                     .addField('<:bp:724724401333076071> Bloodpoints:', Coma(bloodpoints), true)
                     .addField('In-game hours:', Math.round(playtime/60), true)
                     .addBlankField()
                     .addField('Rank:', survivor_rank, true)
                     .addField('<:icons_perfect:739182106139295915> Perfect games:', survivor_perfectgames,true)
                     .addField('<:Icons_Gen:739182107095466014> Gens repaired:', equivgensrepaired, true)
                     .addField('<:Icons_Aidkit:739182102427467817> Survivors healed:', equivsurvivorshealed+'/'+equivsurvivorshealed_coop+' (Coop <:Icons_coop:739182106319650966>)',true)
                     .addField('<:icons_skillCheck:739182107259043860> SkillChecks:', skillchecks,true)
                     .addField('Escaped:', escaped, true)
                     .addField('Escapes in dying state:', escaped_ko, true)
                     .addField('Hatch escapes:', escaped_hatch, true)
                     .addField('Self unhook:', unhookedself, true)
                     .addField('Protection hits:', protectionhits, true)
                     .addField('Exit gates opened:', exitgatesopened, true)
                     .addField('<:Icons_cofre:739182106651131957> Mystery boxes opened:', mysteryboxesopened, true)
                     .setTimestamp()
                     .setFooter('Entity', client.user.avatarURL)
                     message.channel.send(embedd)
                     return;
                   }
                 } else
                 {
                   var options = {
                     host: 'dbd.onteh.net.au',
                     path: '/api/playerstats?steamid='+sid_2,
                     headers: { 'User-Agent': 'EntityBot/0.6.5' }
                   };      
                   var req1 = https.get(options, function (res) {
                   var bodyChunks2 = [];
                   res.on('data', function (chunk) {
                       bodyChunks2.push(chunk);
                   }).on('end', function () {
                       var body4 = Buffer.concat(bodyChunks2);
                       if(VerificarPrivado(body4) == 1)
                       {
                         const embedd = new Discord.RichEmbed()
                           .setColor('#FF0000')
                           .setTitle('¡Ups! This is embarrassing...')
                           .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                           .setThumbnail(message.member.user.avatarURL)
                           .addField('Seems like your steam account is private.', 'Remember switching all privacy options to public.')
                           .addField('Already changed all the privacy confing and still doesnt work?', 'Usually when switching the privacy confing to public might take between 24 to 48 hours to refresh the data from the web (Not in our hands).')
                           .addField('If your profile always has been public and still doesnt work:', 'Check this image and make sure you have everything in order')
                           .addField('Your account hasnt been updated.', 'Recently has requested your stats correctly, next time you request your stats it will show the old ones until your profile privacy config went back to public.')
                           .setTimestamp()
                           .setImage('https://cdn.discordapp.com/attachments/738848207328772237/739269462510796800/unknown.png')
                           .setFooter('Entity', client.user.avatarURL);
                           message.channel.send(embedd)
                           con.query(`UPDATE EntityUsers SET state = 1, update_at = ${usa.getTime()} WHERE SID = ${sid_2}`)
                           return;
                       }                  
                       if(args[0].toLowerCase() == 'survivor') 
                       {
                         obtenervalorsurv_ING(body4, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                       }
                       if(args[0].toLowerCase() == 'killer') 
                       {
                         obtenervalorkill_ING(body4, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                       }
                   })
                 });
                 return;
                 }
               }
             } else
             {
                 var options = {
                   host: 'dbd.onteh.net.au',
                   path: '/api/playerstats?steamid='+sid_2,
                   headers: { 'User-Agent': 'EntityBot/0.6.5' }
                 }     
                 var req1 = https.get(options, function (res) {
                 var bodyChunks3 = [];
                 res.on('data', function (chunk) {
                     bodyChunks3.push(chunk);
                 }).on('end', function () {
                     var body5 = Buffer.concat(bodyChunks3);
                     if(VerificarPrivado(body5) == 1)
                     {
                       const embedd = new Discord.RichEmbed()
                       .setColor('#FF0000')
                       .setTitle('¡Ups! This is embarrassing...')
                       .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                       .setThumbnail(message.member.user.avatarURL)
                       .addField('Seems like your steam account is private.', 'Remember switching all privacy options to public.')
                       .addField('Already changed all the privacy confing and still doesnt work?', 'Usually when switching the privacy confing to public might take between 24 to 48 hours to refresh the data from the web (Not in our hands).')
                       .addField('If your profile always has been public and still doesnt work:', 'Check this image and make sure you have everything in order')
                       .setTimestamp()
                       .setImage('https://cdn.discordapp.com/attachments/738848207328772237/739269462510796800/unknown.png')
                       .setFooter('Entity', client.user.avatarURL);
                       message.channel.send(embedd)
                       con.query(`INSERT INTO EntityUsers (SID, update_at, state) VALUES ('${sid_2}', '${usa.getTime()}', '1')`)
                       return;
                     } 
                     if(isEmptyObject(body5))
                     {

                       var options2 = {
                         host: 'dbd.onteh.net.au',
                         path: '/api/playerstats?steamid='+sid_2,
                         method: 'POST',
                         headers: { 'User-Agent': 'EntityBot/0.6.5' }
                     };    
                       options2.agent = new https.Agent(options2)
                       const reqq1 = https.request(options2, (res) => {
                         if(res.statusCode == 404)
                         {
                           const embedd = new Discord.RichEmbed()
                             .setColor('#FF0000')
                             .setTitle('Invalid account.')
                             .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                             .setThumbnail(client.user.avatarURL)
                             .addField('Invalid steam URL.', 'Youd enter an non-existent steam profile URL which means that the stats doesnt exist. Try again with a diferent URL.')
                             .setTimestamp()
                             .setFooter('Entity', client.user.avatarURL)
                             message.channel.send(embedd)
                             return;
                         }
                         if(res.statusCode != 201)
                         {   
                             console.log('statusCode:', res.statusCode);
                             console.log('headers:', res.headers);
                             const embedd = new Discord.RichEmbed()
                             .setColor('#FF0000')
                             .setTitle('We couldnt add your account...')
                             .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                             .setThumbnail(client.user.avatarURL)
                             .addField('We are having troubles with the web.', 'Right now the web doesnt allow us to add more acounts, beacuse the amount of requests. Please click the button bellow and paste your steam profile URL. Later on you will be able to see your stats here **'+prefix[message.guild.id]+'stats**')
                             .addField('Add account:', '[Click here](https://dbd.onteh.net.au)')
                             .setTimestamp()
                             .setFooter('Entity', client.user.avatarURL)
                             message.channel.send(embedd)
                             return;
                         }
                         message.channel.send('The steam account is in queue to be added, Try again in **10** minutes and remember it might take up to 1 hour.')
                         con.query(`INSERT INTO EntityUsers (SID, update_at) VALUES ('${sid_2}', '${usa.getTime()}')`)
                         console.log('statusCode:', res.statusCode);
                         console.log('headers:', res.headers);
                       })
                       reqq1.on('error', (e) => {
                         console.error(e);
                       });
                       reqq1.end()
                       return;
                     }
                     if(args[0].toLowerCase() == 'survivor') 
                     {
                      obtenervalorsurv_ING(body5, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                     }
                     if(args[0].toLowerCase() == 'killer') 
                     {
                       obtenervalorkill_ING(body5, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                     }
                 })
               });
             }
           })
         })
       })
     }
     return;
   }
if(command == 'level')
{
 if(!texto) return message.member.send('Enter: **'+prefix[message.guild.id]+'level [Current Level] [Level wanted]** | It will tell you the amount of bloodpoints needed to reach that level.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
 if(parseInt(args[0]) >= parseInt(args[1])) return message.member.send('The wanted level can not be higher that the current level.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
 if(parseInt(args[1]) > 50 || parseInt(args[0])  < 1 || parseInt(args[0]) > 50) return message.member.send('The current level must be between 1 and 49 and the wanted level must be between 1 and 50.').catch(function(err) { message.channel.send(message.member.user+'  Activate your private messagges so the bot can inform you.') } );
 if(parseInt(args[1])  % 1 != '0' || parseInt(args[0]) % 1 != '0') return message.member.send('Level can not contain commas').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so the bot can inform you.') } );
 LC[message.author.id] = 0;
 let sangre = ObtenerValor(parseInt(args[0]),parseInt(args[1]), message.author.id)
 const embed = new Discord.RichEmbed()
     .setThumbnail(message.member.user.avatarURL)
     .setAuthor(message.member.displayName+'#'+message.member.user.discriminator, message.member.user.avatarURL)
     .setTitle('| Level Up |')
     .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
     .addField('Bloodpoints <:bp:724724401333076071>', '**'+Coma(sangre)+'**', true)
     .addField('Levels bought', '**'+LC[message.author.id]+'**', true)
     .addField('ㅤ', 'ㅤ')
     .addField('Start Level', '**'+args[0]+'**', true)
     .addField('Final Level', '**'+args[1]+'**',true)
     .setColor(0xFF0000)
   message.channel.send({ embed });
   return;
}
  
  if (command == 'channel') {
      if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('The command is only availiable for administrator users.')
      if (!texto) return message.member.send('Use: **'+prefix[message.guild.id]+'channel #Name** | To set the channel where the commands can be used. If u wanna take back the channel selected use'+prefix[message.guild.id]+'channel delete')
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
      let canal = client.channels.get(channel_id)
      message.channel.send('From now on the commans will work in: '+canal)
      return;
  }

  if (command == 'lobby') {
      if (lobby_set.has(message.author.id)) return message.channel.send(message.member.user+', You used the lobby less than 20 seconds ago.')
      lobby_set.add(message.author.id)
      const lembed = new Discord.RichEmbed()
          .setColor('#FF0000')
          .setTitle('🔰 Lobby 🔰')
          .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
          .setAuthor('Entity', client.user.avatarURL)
          .setDescription('Select the reaction emoji to activate a function:')
          .setThumbnail(client.user.avatarURL)
          .addBlankField()
          .addField('1⃣ Calculate bloodpoints from a certain level to another.', 'Select the current level you have with a certain character and the level wanted, then it will show you the amount of bloodpoints needed.')
          .addField('2⃣ Random survivor 4 perk build.', 'It will show you a random survivor with 4 random perks.')
          .addField('3⃣ Random killer 4 perk build.', 'It will show you a random killer with 4 random perks.')
          .addField('4⃣ It will calculate the amount of Bloodpoints that you need to buy all the perks from a caracter.', 'It will ask you how many perks of each level you have and the bot will calculate counting those perks you dont have.')
          .addField('5⃣ Bot official discord invitation.', 'Here you will recieve the link to join the bot to a discord server or if you need support.')
          
          .setTimestamp()
          .setFooter('Entity - V' + version_bot + ' - Public Beta', client.user.avatarURL);
          message.channel.send(lembed).then(function (message) {
              message.react("1⃣")
              setTimeout(() => {
                  message.react('2⃣')
                  setTimeout(() => {
                      message.react('3⃣')
                      setTimeout(() => {
                          message.react('4⃣')
                          setTimeout(() => {
                           message.react('5⃣')
                       }, 50);
                      }, 100);
                  }, 300);
              }, 400);
          })
      setTimeout(() => {
          lobby_set.delete(message.author.id)
      }, 120000);
          return;
  }


if(command == 'random')
{
 if(!texto) return message.member.send('Use **'+prefix[message.guild.id]+'random [Survivor or Killer]** || It will give you a random 4 perk build for a survivor or killer.')
 if(texto.toLowerCase() == 'survivor')
 {
 let numero = Math.floor(Math.random() * 24);
 let numero_perk_1 = Math.floor(Math.random() * PerkSurv);
 let numero_perk_2 = Math.floor(Math.random() * PerkSurv);
 if(numero_perk_2 == numero_perk_1)
 {
   while(numero_perk_2 == numero_perk_1)
   {
    console.log('Loop Linea 3022')
     numero_perk_2 = Math.floor(Math.random() * PerkSurv);
   }
 }
 let numero_perk_3 = Math.floor(Math.random() * PerkSurv);
 if(numero_perk_3 == numero_perk_1 || numero_perk_3 == numero_perk_2)
 {
   while(numero_perk_3 == numero_perk_1)
   {
    console.log('Loop Linea 3031')
     numero_perk_3 = Math.floor(Math.random() * PerkSurv);
   }
   while(numero_perk_3 == numero_perk_2)
   {
    console.log('Loop Linea 3036')
     numero_perk_3 = Math.floor(Math.random() * PerkSurv);
   }
 }
 let numero_perk_4 = Math.floor(Math.random() * PerkSurv);
 if(numero_perk_4 == numero_perk_1 || numero_perk_4 == numero_perk_2 || numero_perk_4 == numero_perk_3)
 {
   while(numero_perk_4 == numero_perk_1)
   {
    console.log('Loop Linea 3045')
     numero_perk_4 = Math.floor(Math.random() * PerkSurv);
   }
   while(numero_perk_4 == numero_perk_2)
   {
    console.log('Loop Linea 3050')
     numero_perk_4 = Math.floor(Math.random() * PerkSurv);
   }
   while(numero_perk_4 == numero_perk_3)
   {
    console.log('Loop Linea 3055')
     numero_perk_4 = Math.floor(Math.random() * PerkSurv);
   }
 }
 SurvivorRandom(numero);
 const embed = new Discord.RichEmbed()
     .setThumbnail(ImagenPersonaje)
     .setAuthor('| '+NombrePersonaje+' |', ImagenPersonaje)
     .setTitle('Perks:')
     .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
     .addField('ㅤ', '**► '+ObtenerPerkSurv_ING(numero_perk_1)+'**\n**► '+ObtenerPerkSurv_ING(numero_perk_2)+'**\n**► '+ObtenerPerkSurv_ING(numero_perk_3)+'**\n**► '+ObtenerPerkSurv_ING(numero_perk_4)+'**', true)
     .setColor(0xFF0000)
     message.channel.send(embed).then(function(message) { message.channel.send(ObtenerIconPerk(numero_perk_1, 1)+' '+ObtenerIconPerk(numero_perk_2, 1)+' '+ObtenerIconPerk(numero_perk_3, 1)+' '+ObtenerIconPerk(numero_perk_4, 1)) })
 return;
 }
 else if(texto.toLowerCase() == 'killer')
 {
   let numero = Math.floor(Math.random() * 22);
   KillerRandom(numero);
   let numero_perk_1 = Math.floor(Math.random() * PerkKill);
   let numero_perk_2 = Math.floor(Math.random() * PerkKill);
   if(numero_perk_2 == numero_perk_1)
   {
     while(numero_perk_2 == numero_perk_1)
     {
      console.log('Loop Linea 3080')
       numero_perk_2 = Math.floor(Math.random() * PerkKill);
     }
   }
   let numero_perk_3 = Math.floor(Math.random() * PerkKill);
   if(numero_perk_3 == numero_perk_1 || numero_perk_3 == numero_perk_2)
   {
     while(numero_perk_3 == numero_perk_1)
     {
      console.log('Loop Linea 3089')
       numero_perk_3 = Math.floor(Math.random() * PerkKill);
     }
     while(numero_perk_3 == numero_perk_2)
     {
      console.log('Loop Linea 3094')
       numero_perk_3 = Math.floor(Math.random() * PerkKill);
     }
   }
   let numero_perk_4 = Math.floor(Math.random() * PerkKill);
   if(numero_perk_4 == numero_perk_1 || numero_perk_4 == numero_perk_2 || numero_perk_4 == numero_perk_3)
   {
     while(numero_perk_4 == numero_perk_1)
     {
      console.log('Loop Linea 3103')
       numero_perk_4 = Math.floor(Math.random() * PerkKill);
     }
     while(numero_perk_4 == numero_perk_2)
     {
      console.log('Loop Linea 3108')
       numero_perk_4 = Math.floor(Math.random() * PerkKill);
     }
     while(numero_perk_4 == numero_perk_3)
     {
      console.log('Loop Linea 3113')
       numero_perk_4 = Math.floor(Math.random() * PerkKill);
     }
   }
   const embed = new Discord.RichEmbed()
       .setThumbnail(ImagenPersonaje)
       .setAuthor('| '+NombrePersonaje+' |', ImagenPersonaje)
       .setTitle('Perks:')
       .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
       .addField('ㅤ', '**► '+ObtenerPerkKiller_ING(numero_perk_1)+'**\n**► '+ObtenerPerkKiller_ING(numero_perk_2)+'**\n**► '+ObtenerPerkKiller_ING(numero_perk_3)+'**\n**► '+ObtenerPerkKiller_ING(numero_perk_4)+'**', true)
       .setColor(0xFF0000)
   message.channel.send(embed).then(function(message) { message.channel.send(ObtenerIconPerk(numero_perk_1, 0)+' '+ObtenerIconPerk(numero_perk_2, 0)+' '+ObtenerIconPerk(numero_perk_3, 0)+' '+ObtenerIconPerk(numero_perk_4, 0)) } )
   return;
 } else
 {
   message.member.send('Use **'+prefix[message.guild.id]+'random [Survivor or Killer]** || It will give you a random 4 perk build for a survivor or killer.').catch(function(err) { message.channel.send(message.member.user+' Activate your private messagges so te bot can inform you.') } );
   return;
 }
}
  message.member.send('The command doesnt exists. Use **'+prefix[message.guild.id]+'help** to see all the funtions and commands')

 }
}

});

function ObtenerValor(nivel, Deseado, id)
{
  var total = 0;
  for(let x = nivel; x<=Deseado; x++)
  {
    console.log('Loop Line 3144')
    if(x == Deseado) break;
    LC[id] = LC[id]+1;
    if(x >= 1 && x <= 9) total = total+12000;
    if(x >= 10 && x <= 19) total = total+24000;
    if(x >= 20 && x <= 29) total = total+34000;
    if(x >= 30 && x <= 39) total = total+40000;
    if(x >= 40 && x <= 50) total = total+50000;
  }
  return total;
}

function ObtenerNP(nivel, id)
{
  let v = 0;
  var total = 0;
  let x = nivel;
  while(DBC[id] != 0)
  {
    console.log('Loop Linea 3163')
      LC[id] = LC[id]+1;
      if(x >= 1 && x <= 9)
      {
          total = total+12000;
          DBC[id] = DBC[id]-1;
          x = x+1;
          if(DBC[id] == 1) 
          {
            DBC[id] = DBC[id]-1;
            break;
          }
      }
      if(x >= 10 && x <= 19) 
      {
          total = total+24000;
          DBC[id] = DBC[id]-1;
          x = x+1;
          if(DBC[id] == 1) 
          {
            DBC[id] = DBC[id]-1;
            break;
          }
      }
        if(x >= 20 && x <= 29) 
        {
          total = total+34000;
          DBC[id] = DBC[id]-1;
          x = x+1;
          if(DBC[id] == 1) 
          {
            DBC[id] = DBC[id]-1;
            break;
          }
        }
        if(x >= 30 && x <= 39) 
        {
          total = total+40000;
          DBC[id] = DBC[id]-1;
          x = x+1;
          if(DBC[id] == 1) 
          {
            DBC[id] = DBC[id]-1;
            break;
          }
        }
        if(x >= 40 && x <= 50) 
        {
          if(x == 50) 
          {            
            x = x-1;
          }
          x = x+1;
          total = total+50000;
          if(DBC[id] == 1) 
          {
            DBC[id] = DBC[id]-1;
            break;
          }
          DBC[id] = DBC[id]-2;
        }
      }
  return total;
}

function KillerRandom(numero)
{
  switch(numero)
  {
    case 0: 
    {
      NombrePersonaje = 'The Trapper/El Trampero'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/2/20/AK_TR_charSelect_portrait.png'
      break;
    }
    case 1: 
    {
      NombrePersonaje = 'The Wraith/El Espectro'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/6/6e/AK_WR_charSelect_portrait.png'
      break;
    }
    case 2: 
    {
      NombrePersonaje = 'The Hillbilly/El Pueblerino'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/e/e5/AK_HI_charSelect_portrait.png'
      break;
    }
    case 3: 
    {
      NombrePersonaje = 'The Nurse/La Enfermera'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/0/01/BK_NU_charSelect_portrait.png'
      break;
    }
    case 4: 
    {
      NombrePersonaje = 'The Shape/La Forma'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/e/ec/CK_SH_charSelect_portrait.png'
      break;
    }
    case 5: 
    {
      NombrePersonaje = 'The Hag/La Bruja'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/f/f9/DK_HA_charSelect_portrait.png'
      break;
    }
    case 6: 
    {
      NombrePersonaje = 'The Doctor/El Doctor'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/1/1c/IK_DO_charSelect_portrait.png'
      break;
    }
    case 7: 
    {
      NombrePersonaje = 'The Huntress/La Cazadora'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/d/d1/JK_HU_charSelect_portrait.png'
      break;
    }
    case 8: 
    {
      NombrePersonaje = 'The Cannibal/El Canibal'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/a/ae/JK_CA_charSelect_portrait.png'
      break;
    }
    case 9: 
    {
      NombrePersonaje = 'The Nightmare/La Pesadilla'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/f/fe/EK_NI_charSelect_portrait.png'
      break;
    }
    case 10: 
    {
      NombrePersonaje = 'The Pig/La Cerda'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/0/00/FK_PI_charSelect_portrait.png'
      break;
    }
    case 11: 
    {
      NombrePersonaje = 'The Clown/El Payaso'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/1/1b/GK_CL_charSelect_portrait.png'
      break;
    }
    case 12: 
    {
      NombrePersonaje = 'The Spirit/La Espiritu'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/8/87/HK_SP_charSelect_portrait.png'
      break;
    }
    case 13: 
    {
      NombrePersonaje = 'The Legion/La Legion'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/3/37/KK_LE_charSelect_portrait.png'
      break;
    }
    case 14: 
    {
      NombrePersonaje = 'The Plague/La Plaga'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/5/5b/MK_PL_charSelect_portrait.png'
      break;
    }
    case 15: 
    {
      NombrePersonaje = 'The Ghost Face'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/3/38/OK_GH_charSelect_portrait.png'
      break;
    }
    case 16: 
    {
      NombrePersonaje = 'The Demogorgon'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/2/24/QK_DE_charSelect_portrait.png'
      break;
    }
    case 17: 
    {
      NombrePersonaje = 'The Oni'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/4/44/SK_ON_charSelect_portrait.png'
      break;
    }
    case 18: 
    {
      NombrePersonaje = 'The Deathslinger/El Arponero'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/2/2e/UK_DE_charSelect_portrait.png'
      break;
    }
    case 19: 
    {
      NombrePersonaje = 'The Executioner/El Verdugo'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/a/a1/WK_charSelect_portrait.png'
      break;
    }
    case 20: 
    {
      NombrePersonaje = 'The Blight/El Deterioro'
      ImagenPersonaje = 'https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/0/0b/K21_charSelect_portrait.png'
      break;
    }
    case 21: 
    {
      NombrePersonaje = 'The Twins/Los Mellizos'
      ImagenPersonaje = 'https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/0/03/K22_charSelect_portrait.png'
      break;
    }
  }
  return;
}


function ObtenerPerkSurv(numero)
{
  switch(numero)
  {
    case 0:
    {
      return NombrePerk = 'As en la manga'
    }
    case 1:
    {
      return NombrePerk = 'Adrenalina'
    }
    case 2:
    {
      return NombrePerk = 'Postratamiento'
    }
    case 3:
    {
      return NombrePerk = 'Alerta'
    }
    case 4:
    {
      return NombrePerk = 'Cueste lo que cueste'
    }
    case 5:
    {
      return NombrePerk = 'Autodidacta'
    }
    case 6:
    {
      return NombrePerk = 'Canguro'
    }
    case 7:
    {
      return NombrePerk = 'Caida equilibrada'
    }
    case 8:
    {
      return NombrePerk = 'Mejor juntos'
    }
    case 9:
    {
      return NombrePerk = 'Pacto de sangre'
    }
    case 10:
    {
      return NombrePerk = 'Arrebato'
    }
    case 11:
    {
      return NombrePerk = 'Vinculo'
    }
    case 12:
    {
      return NombrePerk = 'Tiempo prestado'
    }
    case 13:
    {
      return NombrePerk = 'Conocimientos de botanica'
    }
    case 14:
    {
      return NombrePerk = 'Ruptura'
    }
    case 15:
    {
      return NombrePerk = 'Fuga'
    }
    case 16:
    {
      return NombrePerk = 'Sujetate'
    }
    case 17:
    {
      return NombrePerk = 'Espiritu calmado'
    }
    case 18:
    {
      return NombrePerk = 'Camaraderia'
    }
    case 19:
    {
      return NombrePerk = 'Baila conmigo'
    }
    case 20:
    {
      return NombrePerk = 'Percepcion oscura'
    }
    case 21:
    {
      return NombrePerk = 'Fajador'
    }
    case 22:
    {
      return NombrePerk = 'Golpe decisivo'
      
    }
    case 23:
    {
      return NombrePerk = 'Déjà Vu'
      
    }
    case 24:
    {
      return NombrePerk = 'Liberacion'
      
    }
    case 25:
    {
      return NombrePerk = "Corazonada"
      
    }
    case 26:
    {
      return NombrePerk = 'Distorsion'
      
    }
    case 27:
    {
      return NombrePerk = 'Distraccion'
      
    }
    case 28:
    {
      return NombrePerk = 'Empatia'
      
    }
    case 29:
    {
      return NombrePerk = 'Fijacion'
      
    }
    case 30:
    {
      return NombrePerk = 'Hasta otra'
      
    }
    case 31:
    {
      return NombrePerk = 'Por los demas'
      
    }
    case 32:
    {
      return NombrePerk = 'De frente'
      
    }
    case 33:
    {
      return NombrePerk = 'Esperanza'
      
    }
    case 34:
    {
      return NombrePerk = 'Fuerza interior'
      
    }
    case 35:
    {
      return NombrePerk = 'Voluntad de hierro'
      
    }
    case 36:
    {
      return NombrePerk = 'Familia'
      
    }
    case 37:
    {
      return NombrePerk = 'Lider'
      
    }
    case 38:
    {
      return NombrePerk = 'Abandonado a tu suerte'
      
    }
    case 39:
    {
      return NombrePerk = 'De pies ligeros'
      
    }
    case 40:
    {
      return NombrePerk = 'Agilidad'
      
    }
    case 41:
    {
      return NombrePerk = 'Golpe de suerte'
      
    }
    case 42:
    {
      return NombrePerk = 'El temple del hombre'
      
    }
    case 43:
    {
      return NombrePerk = 'Me la pela'
      
    }
    case 44:
    {
      return NombrePerk = 'Nadie se queda atras'
      
    }
    case 45:
    {
      return NombrePerk = 'Objeto de obsesion'
      
    }
    case 46:
    {
      return NombrePerk = 'Extraoficial'
      
    }
    case 47:
    {
      return NombrePerk = 'A mano descubierta'
      
    }
    case 48:
    {
      return NombrePerk = 'Farmacia'
      
    }
    case 49:
    {
      return NombrePerk = 'Instinto de saqueador'
      
    }
    case 50:
    {
      return NombrePerk = 'Serenidad'
      
    }
    case 51:
    {
      return NombrePerk = 'Premonicion'
      
    }
    case 52:
    {
      return NombrePerk = 'Demuestra lo que vales'
      
    }
    case 53:
    {
      return NombrePerk = 'Velocidad silenciosa'
      
    }
    case 54:
    {
      return NombrePerk = 'Bulo'
      
    }
    case 55:
    {
      return NombrePerk = 'Supresion de alianza'
      
    }
    case 56:
    {
      return NombrePerk = 'Resiliencia'
      
    }
    case 57:
    {
      return NombrePerk = 'Sabotear'
      
    }
    case 58:
    {
      return NombrePerk = 'Segundo aliento'
      
    }
    case 59:
    {
      return NombrePerk = 'Autocuracion'
      
    }
    case 60:
    {
      return NombrePerk = 'Carne resbaladiza'
      
    }
    case 61:
    {
      return NombrePerk = 'Caza menor'
      
    }
    case 62:
    {
      return NombrePerk = 'Solo quedo yo'
      
    }
    case 63:
    {
      return NombrePerk = 'Solidaridad'
      
    }
    case 64:
    {
      return NombrePerk = 'Salvaguarda de alma'
      
    }
    case 65:
    {
      return NombrePerk = 'Escalofrios'
      
    }
    case 66:
    {
      return NombrePerk = 'Esprint'
      
    }
    case 67:
    {
      return NombrePerk = 'Bajo vigilancia'
      
    }
    case 68:
    {
      return NombrePerk = 'Con calle'
      
    }
    case 69:
    {
      return NombrePerk = 'Tenacidad'
      
    }
    case 70:
    {
      return NombrePerk = 'Pericia tecnica'
      
    }
    case 71:
    {
      return NombrePerk = 'Esto no puede estar pasando'
      
    }
    case 72:
    {
      return NombrePerk = 'Subir las apuestas'
      
    }
    case 73:
    {
      return NombrePerk = 'Inquebrantable'
      
    }
    case 74:
    {
      return NombrePerk = 'Evasion urbana'
      
    }
    case 75:
    {
      return NombrePerk = 'Vigilia'
      
    }
    case 76:
    {
      return NombrePerk = 'Despierta!'
      
    }
    case 77:
    {
      return NombrePerk = 'Lo conseguiremos'
      
    }
    case 78:
    {
      return NombrePerk = 'Vamos a vivir para siempre'
      
    }
    case 79:
    {
      return NombrePerk = 'Oportunidades'
    }
    case 80:
    {
      return NombrePerk = 'Medidas desesperadas'
    }
    case 81:
    {
      return NombrePerk = 'Visión del futuro'
    }
    case 82:
    {
      return NombrePerk = 'Construcción durarera'
    }
    case 83:
    {
      return NombrePerk = 'Evaluación'
    }
    case 84:
    {
      return NombrePerk = 'Engaño'
    }
    case 85:
    {
      return NombrePerk = 'Lucha Intensa'
    }
  }
}


function SurvivorRandom(numero)
{
  switch(numero)
  {
    case 0: 
    {
      NombrePersonaje = 'Dwight Fairfield'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/b/b0/AS_DF_charSelect_portrait.png'
      break;
    }
    case 1: 
    {
      NombrePersonaje = 'Meg Thomas'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/3/3d/AS_MT_charSelect_portrait.png'
      break;
    }
    case 2: 
    {
      NombrePersonaje = 'Claudette Morel'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/1/10/AS_CM_charSelect_portrait.png'
      break;
    }
    case 3: 
    {
      NombrePersonaje = 'Jake Park'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/e/e8/AS_JP_charSelect_portrait.png'
      break;
    }
    case 4: 
    {
      NombrePersonaje = 'Nea Karlsson'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/2/28/BS_NK_charSelect_portrait.png'
      break;
    }
    case 5: 
    {
      NombrePersonaje = 'Laurie Strode'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/1/12/CS_LS_charSelect_portrait.png'
      break;
    }
    case 6: 
    {
      NombrePersonaje = 'Ace Visconti'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/1/16/DS_AV_charSelect_portrait.png'
      break;
    }
    case 7: 
    {
      NombrePersonaje = 'William "Bill" Overbeck'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/6/6d/DS_BO_charSelect_portrait.png'
      break;
    }
    case 8: 
    {
      NombrePersonaje = 'Feng Min'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/a/a4/IS_FM_charSelect_portrait.png'
      break;
    }
    case 9: 
    {
      NombrePersonaje = 'David King'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/d/d5/JK_DK_charSelect_portrait.png'
      break;
    }
    case 10: 
    {
      NombrePersonaje = 'Quentin Smith'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/5/52/ES_QS_charSelect_portrait.png'
      break;
    }
    case 11: 
    {
      NombrePersonaje = 'David Tapp'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/f/f1/FS_DT_charSelect_portrait.png'
      break;
    }
    case 12: 
    {
      NombrePersonaje = 'Kate Denson'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/0/0d/GS_KD_charSelect_portrait.png'
      break;
    }
    case 13: 
    {
      NombrePersonaje = 'Adam Francis'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/f/f3/HS_AF_charSelect_portrait.png'
      break;
    }
    case 14: 
    {
      NombrePersonaje = 'Jeff Johansen'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/5/51/KS_JJ_charSelect_portrait.png'
      break;
    }
    case 15: 
    {
      NombrePersonaje = 'Jane Romero'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/0/01/MS_JR_charSelect_portrait.png'
      break;
    }
    case 16: 
    {
      NombrePersonaje = 'Ashley "Ash" Williams'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/6/65/MS_AW_charSelect_portrait.png'
      break;
    }
    case 17: 
    {
      NombrePersonaje = 'Nancy Wheeler'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/6/68/QS_NW_charSelect_portrait.png'
      break;
    }
    case 18: 
    {
      NombrePersonaje = 'Steve Harrington'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/f/f0/QS_SH_charSelect_portrait.png'
      break;
    }
    case 19: 
    {
      NombrePersonaje = 'Yui Kimura'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/c/c5/SS_YK_charSelect_portrait.png'
      break;
    }
    case 20: 
    {
      NombrePersonaje = 'Zarina Kassir'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/e/e2/US_ZK_charSelect_portrait.png'
      break;
    }
    case 21: 
    {
      NombrePersonaje = 'Cheryl Mason'
      ImagenPersonaje = 'https://gamepedia.cursecdn.com/deadbydaylight_gamepedia_en/5/5c/WS_charSelect_portrait.png'
      break;
    }
    case 22: 
    {
      NombrePersonaje = 'Felix Richter'
      ImagenPersonaje = 'https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/0/08/YS_FR_charSelect_portrait.png'
      break;
    }
    case 23: 
    {
      NombrePersonaje = 'Élodie Rakoto'
      ImagenPersonaje = 'https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/4/45/S24_charSelect_portrait.png'
      break;
    }


  }
  return;
}

function ObtenerIconPerk(numero, s2)
{
    if(s2 == 1)
    {
    var icon;
    switch(numero)
    {
      case 0: return icon = '<:iconPerks_aceInTheHole:741712915408748546>'
      case 1: return icon = '<:iconPerks_adrenaline:741712917484798073>'
      case 2: return icon = '<:iconPerks_aftercare:741712926507008114>'
      case 3: return icon = '<:iconPerks_alert:741712927823888414>'
      case 4: return icon = '<:iconPerks_anyMeansNecessary:741712927827951677>'
      case 5: return icon = '<:iconPerks_autodidact:741712926775181421>'
      case 6: return icon = '<:iconPerks_babySitter:741712928293519440>'
      case 7: return icon = '<:iconPerks_balancedLanding:741712924820766790>'
      case 8: return icon = '<:iconPerks_betterTogether:741712928646103081>'
      case 9: return icon = '<:iconPerks_bloodPact:741712927500927046>'
      case 10: return icon = '<:iconPerks_boilOver:741712924539617343>'
      case 11: return icon = '<:iconPerks_bond:741712926716461156>'
      case 12: return icon = '<:iconPerks_borrowedTime:741712926498488401>'
      case 13: return icon = '<:iconPerks_botanyKnowledge:741712925965680681>'
      case 14: return icon = '<:iconPerks_breakdown:741712927563710484>'
      case 15: return icon = '<:iconPerks_breakout:741712927748522115>'
      case 16: return icon = '<:iconPerks_buckleUp:741712928784384060>'
      case 17: return icon = '<:iconPerks_calmSpirit:741712928105037925>'
      case 18: return icon = '<:iconPerks_camaraderie:741712928377667786>'
      case 19: return icon = '<:iconPerks_danceWithMe:741712928545439784>'
      case 20: return icon = '<:iconPerks_darkSense:741712926418927628>'
      case 21: return icon = '<:iconPerks_DeadHard:741712927027101826>'
      case 22: return icon = '<:iconPerks_decisiveStrike:741712926234247199>'
      case 23: return icon = '<:iconPerks_dejaVu:741712927907774464>'
      case 24: return icon = '<:iconPerks_deliverance:741712928876527746>'
      case 25: return icon = '<:iconPerks_detectivesHunch:741712927706578945>'
      case 26: return icon = '<:iconPerks_distortion:741712926473191537>'
      case 27: return icon = '<:iconPerks_diversion:741712927597264986>'
      case 28: return icon = '<:iconPerks_empathy:741712927601721365>'
      case 29: return icon = '<:iconPerks_fixated:741713034870784040>'
      case 30: return icon = '<:iconPerks_flipFlop:741713038310113281>'
      case 31: return icon = '<:iconPerks_forThePeople:741713039434186855>'
      case 32: return icon = '<:iconPerks_headOn:741713041191600187>'
      case 33: return icon = '<:iconPerks_hope:741713038566096967>'
      case 34: return icon = '<:iconPerks_innerStrength:741713041288200352>'
      case 35: return icon = '<:iconPerks_ironWill:741713039501295728>'
      case 36: return icon = '<:iconPerks_kindred:741713039207956500>'
      case 37: return icon = '<:iconPerks_leader:741713037471252663>'
      case 38: return icon = '<:iconPerks_leftBehind:741713040944398346>'
      case 39: return icon = '<:iconPerks_lightweight:741713038419427409>'
      case 40: return icon = '<:iconPerks_lithe:741713039929245887>'
      case 41: return icon = '<:iconPerks_luckyBreak:741713039685845153>'
      case 42: return icon = '<:iconPerks_mettleOfMan:741713040474505366>'
      case 43: return icon = '<:iconPerks_NoMither:741713041233805393>'
      case 44: return icon = '<:iconPerks_noOneLeftBehind:741713039358820532>'
      case 45: return icon = '<:iconPerks_objectOfObsession:741713039077670922>'
      case 46: return icon = '<:iconPerks_offTheRecord:741713040235561114>'
      case 47: return icon = '<:iconPerks_openHanded:741713040130703382>'
      case 48: return icon = '<:iconPerks_pharmacy:741713040214589461>'
      case 49: return icon = '<:iconPerks_plunderersInstinct:741713040780558407>'
      case 50: return icon = '<:iconPerks_poised:741713157919211611>'
      case 51: return icon = '<:iconPerks_premonition:741713166320533664>'
      case 52: return icon = '<:iconPerks_proveThyself:741713165334872156>'
      case 53: return icon = '<:iconPerks_quickAndQuiet:741713164617384046>'
      case 54: return icon = '<:iconPerks_redHerring:741713165644988457>'
      case 55: return icon = '<:iconPerks_repressedAlliance:741713164718309398>'
      case 56: return icon = '<:iconPerks_resilience:741713165393461349>'
      case 57: return icon = '<:iconPerks_saboteur:741713165259243634>'
      case 58: return icon = '<:iconPerks_secondWind:741713166064550018>'
      case 59: return icon = '<:iconPerks_selfCare:741713166068613160>'
      case 60: return icon = '<:iconPerks_slipperyMeat:741713164407668818>'
      case 61: return icon = '<:iconPerks_smallGame:741713165569491066>'
      case 62: return icon = '<:iconPerks_soleSurvivor:741713167222046770>'
      case 63: return icon = '<:iconPerks_solidarity:741713166437974068>'
      case 64: return icon = '<:iconPerks_soulGuard:741713166454751242>'
      case 65: return icon = '<:iconPerks_spineChill:741713164734824550>'
      case 66: return icon = '<:iconPerks_sprintBurst:741713166865793184>'
      case 67: return icon = '<:iconPerks_stakeOut:741713168476405770>'
      case 68: return icon = '<:iconPerks_streetwise:741713166727381009>'
      case 69: return icon = '<:iconPerks_tenacity:741713167826157592>'
      case 70: return icon = '<:iconPerks_technician:741713167683682354>'
      case 71: return icon = '<:iconPerks_thisIsNotHappening:741713167058731098>'
      case 72: return icon = '<:iconPerks_upTheAnte:741713166878244945>'
      case 73: return icon = '<:iconPerks_unbreakable:741713167213658253>'
      case 74: return icon = '<:iconPerks_urbanEvasion:741713167167782922>'
      case 75: return icon = '<:iconPerks_vigil:741713040558522418>'
      case 76: return icon = '<:iconPerks_wakeUp:741713167339487412>'
      case 77: return icon = '<:iconPerks_wellMakeIt:741726257489641552>'
      case 78: return icon = '<:iconPerks_WereGonnaLiveForever:741726258613977108>'
      case 79: return icon = '<:iconPerks_windowsOfOpportunity:741726257968054315>'
      case 80: return icon = '<:iconPerks_desperateMeasures:753423002103840868>'
      case 81: return icon = '<:iconPerks_visionary:753423002586185910>'
      case 82: return icon = '<:iconPerks_builtToLast:753423000149164032>'
    }
  } else
  {
    switch(numero)
    {
      case 0: return icon = '<:iconPerks_aNursesCalling:741712926666260557>'
      case 1: return icon = '<:iconPerks_agitation:741712927350063224>'
      case 2: return icon = '<:iconPerks_bamboozle:741712928536789163>'
      case 3: return icon = '<:iconPerks_BBQAndChili:741712928327336018>'
      case 4: return icon = '<:iconPerks_BeastOfPrey:741712928000049215>'
      case 5: return icon = '<:iconPerks_bitterMurmur:741712925491724309>'
      case 6: return icon = '<:iconPerks_bloodEcho:741712928109232178>'
      case 7: return icon = '<:iconPerks_bloodWarden:741712928960544778>'
      case 8: return icon = '<:iconPerks_bloodhound:741712926028726302>'
      case 9: return icon = '<:iconPerks_brutalStrength:741712927417040926>'
      case 10: return icon = '<:iconPerks_corruptIntervention:741712928864207008>'
      case 11: return icon = '<:iconPerks_coulrophobia:741712928604028960>'
      case 12: return icon = '<:iconPerks_cruelConfinement:741712928759218216>'
      case 13: return icon = '<:iconPerks_darkDevotion:741712929015070830>'
      case 14: return icon = '<:iconPerks_deadManSwitch:741712928507428916>'
      case 15: return icon = '<:iconPerks_deathbound:741712928087998594>'
      case 16: return icon = '<:iconPerks_deerstalker:741712927328960562>'
      case 17: return icon = '<:iconPerks_discordance:741712927043878964>'
      case 18: return icon = '<:iconPerks_distressing:741712927999918181>'
      case 19: return icon = '<:iconPerks_dyingLight:741712927765037206>'
      case 20: return icon = '<:iconPerks_enduring:741713029728829484>'
      case 21: return icon = '<:iconPerks_fireUp:741713030827737089>'
      case 22: return icon = '<:iconPerks_forcedPenance:741713038561902653>'
      case 23: return icon = '<:iconPerks_franklinsLoss:741713038838595594>'
      case 24: return icon = '<:iconPerks_furtiveChase:741713041086742611>'
      case 25: return icon = '<:iconPerks_gearHead:741713037592887326>'
      case 26: return icon = '<:iconPerks_hangmansTrick:741713038054260736>'
      case 27: return icon = '<:iconPerks_devourHope:741712927639470220>'
      case 28: return icon = '<:iconPerks_hauntedGround:741713041334337577>'
      case 29: return icon = '<:iconPerks_HuntressLullaby:741713040831152160>'
      case 30: return icon = '<:iconPerks_noOneEscapesDeath:741713040508059749>'
      case 31: return icon = '<:iconPerks_hexRetribution:741713041212833884>'
      case 32: return icon = '<:iconPerks_ruin:741713167440150618>'
      case 33: return icon = '<:iconPerks_theThirdSeal:741713167763243098>'
      case 34: return icon = '<:iconPerks_thrillOfTheHunt:741713167826026506>'
      case 35: return icon = '<:iconPerks_imAllEars:741713041338531841>'
      case 36: return icon = '<:iconPerks_infectiousFright:741713040961175635>'
      case 37: return icon = '<:iconPerks_insidious:741713038914355280>'
      case 38: return icon = '<:iconPerks_ironGrasp:741713039241379930>'
      case 39: return icon = '<:iconPerks_ironMaiden:741713041242194001>'
      case 40: return icon = '<:iconPerks_knockOut:741713040474374145>'
      case 41: return icon = '<:iconPerks_lightborn:741713040290087064>'
      case 42: return icon = '<:iconPerks_madGrit:741713041472749739>'
      case 43: return icon = '<:iconPerks_makeYourChoice:741713040067657738>'
      case 44: return icon = '<:iconPerks_mindBreaker:741713041443520752>'
      case 45: return icon = '<:iconPerks_monitorAndAbuse:741713041326080072>'
      case 46: return icon = '<:iconPerks_monstrousShrine:741713039820324954>'
      case 47: return icon = '<:iconPerks_nemesis:741713041535795230>'
      case 48: return icon = '<:iconPerks_generatorOvercharge:741713040386424834>'
      case 49: return icon = '<:iconPerks_overwhelmingPresence:741713039929245879>'
      case 50: return icon = '<:iconPerks_playWithYourFood:741713041087004824>'
      case 51: return icon = '<:iconPerks_popGoesTheWeasel:741713158447693918>'
      case 52: return icon = '<:iconPerks_predator:741713162608443412>'
      case 53: return icon = '<:iconPerks_hatred:741713041632002098>'
      case 54: return icon = '<:iconPerks_rememberMe:741713166404157600>'
      case 55: return icon = '<:iconPerks_saveTheBestForLast:741713167276834847>'
      case 56: return icon = '<:iconPerks_shadowborn:741713166588969000>'
      case 57: return icon = '<:iconPerks_sloppyButcher:741713165166968843>'
      case 58: return icon = '<:iconPerks_spiesFromTheShadows:741713165120962591>'
      case 59: return icon = '<:iconPerks_spiritFury:741713167729688737>'
      case 60: return icon = '<:iconPerks_stridor:741713167654191165>'
      case 61: return icon = '<:iconPerks_surge:741713168111501473>'
      case 62: return icon = '<:iconPerks_surveillance:741713167821832192>'
      case 63: return icon = '<:iconPerks_TerritorialImperative:741713167113257000>'
      case 64: return icon = '<:iconPerks_tinkerer:741713166085652611>'
      case 65: return icon = '<:iconPerks_thatanophobia:741713167079571526>'
      case 66: return icon = '<:iconPerks_thrillingTremors:741713167838609541>'
      case 67: return icon = '<:iconPerks_trailOfTorment:741713167515910196>'
      case 68: return icon = '<:iconPerks_unnervingPresence:741713166878113947>'
      case 69: return icon = '<:iconPerks_unrelenting:741713167607922751>'
      case 70: return icon = '<:iconPerks_whispers:741726257615732828>'
      case 71: return icon = '<:iconPerks_zanshinTactics:741726259121225858>'
      case 72: return icon = '<:iconPerks_hexUndying:753423003500544031>'
      case 73: return icon = '<:iconPerks_dragonsGrip:753423004012118056>'
      case 74: return icon = '<:iconPerks_hexBloodFavor:753423003659927802>'
    }
  }
}

function ObtenerPerkKiller(numero)
{
  switch(numero)
  {
    case 0:
    {
      return NombrePerk = 'Vocacion de enfermera'
    }
    case 1:
    {
      return NombrePerk = 'Agitacion'
    }
    case 2:
    {
      return NombrePerk = 'Desconcierto'
    }
    case 3:
    {
      return NombrePerk = 'Barbacoa y chile'
    }
    case 4:
    {
      return NombrePerk = 'Bestia de presa'
    }
    case 5:
    {
      return NombrePerk = 'Murmullo amargo'
    }
    case 6:
    {
      return NombrePerk = 'Eco sangriento'
    }
    case 7:
    {
      return NombrePerk = 'Guardian de sangre'
    }
    case 8:
    {
      return NombrePerk = 'Sabueso de sangre'
    }
    case 9:
    {
      return NombrePerk = 'Fuerza brutal'
    }
    case 10:
    {
      return NombrePerk = 'Intervencion corrupta'
    }
    case 11:
    {
      return NombrePerk = 'Coulrophobia'
    }
    case 12:
    {
      return NombrePerk = 'Restriccion cruel'
    }
    case 13:
    {
      return NombrePerk = 'Devocion oscura'
    }
    case 14:
    {
      return NombrePerk = 'Interruptor del hombre muerto'
    }
    case 15:
    {
      return NombrePerk = 'Vinculo mortal'
    }
    case 16:
    {
      return NombrePerk = 'Acechador de ciervos'
    }
    case 17:
    {
      return NombrePerk = 'Discordancia'
    }
    case 18:
    {
      return NombrePerk = 'Desasociego'
    }
    case 19:
    {
      return NombrePerk = 'Luz que agoniza'
    }
    case 20:
    {
      return NombrePerk = 'Resistente'
    }
    case 21:
    {
      return NombrePerk = 'Enfurecimiento'
    }
    case 22:
    {
      return NombrePerk = 'Imposicion de penitencia'
    }
    case 23:
    {
      return NombrePerk = 'Muerte de franklin'
    }
    case 24:
    {
      return NombrePerk = 'Persecucion furtiva'
    }
    case 25:
    {
      return NombrePerk = 'Oido para la maquinaria'
    }
    case 26:
    {
      return NombrePerk = 'Truco del verdugo'
    }
    case 27:
    {
      return NombrePerk = 'Maleficio: Devoradora de esperanza'
    }
    case 28:
    {
      return NombrePerk = 'Maleficio: Tierra embrujada'
    }
    case 29:
    {
      return NombrePerk = 'Maleficio: Nana de cazadora'
    }
    case 30:
    {
      return NombrePerk = 'Maleficio: Nadie escapa de la muerte'
    }
    case 31:
    {
      return NombrePerk = 'Maleficio: Represalias'
    }
    case 32:
    {
      return NombrePerk = 'Maleficio: Ruina'
    }
    case 33:
    {
      return NombrePerk = 'Maleficio: El tercer sello'
    }
    case 34:
    {
      return NombrePerk = 'Maleficio: La emocion de la caza'
    }
    case 35:
    {
      return NombrePerk = 'Soy todo oidos'
    }
    case 36:
    {
      return NombrePerk = 'Terror contagioso'
    }
    case 37:
    {
      return NombrePerk = 'Insidia'
    }
    case 38:
    {
      return NombrePerk = 'Apreton de hierro'
    }
    case 39:
    {
      return NombrePerk = 'Doncella de hierro'
    }
    case 40:
    {
      return NombrePerk = 'Noqueo'
    }
    case 41:
    {
      return NombrePerk = 'Hijo de la luz'
    }
    case 42:
    {
      return NombrePerk = 'Furia ciega'
    }
    case 43:
    {
      return NombrePerk = 'Toma una decicion'
    }
    case 44:
    {
      return NombrePerk = 'Quebrantamentes'
    }
    case 45:
    {
      return NombrePerk = 'Monitorizacion y abuso'
    }
    case 46:
    {
      return NombrePerk = 'Santuario monstruoso'
    }
    case 47:
    {
      return NombrePerk = 'Nemesis'
    }
    case 48:
    {
      return NombrePerk = 'Sobrecarga'
    }
    case 49:
    {
      return NombrePerk = 'Presencia abrumadora'
    }
    case 50:
    {
      return NombrePerk = 'Jugar con la comida'
    }
    case 51:
    {
      return NombrePerk = 'Pim, Pam, Pum'
    }
    case 52:
    {
      return NombrePerk = 'Depredacion'
    }
    case 53:
    {
      return NombrePerk = 'Rencor'
    }
    case 54:
    {
      return NombrePerk = 'Recuerdame'
    }
    case 55:
    {
      return NombrePerk = 'Lo mejor para el final'
    }
    case 56:
    {
      return NombrePerk = 'Hijo de las sombras'
    }
    case 57:
    {
      return NombrePerk = 'Carnicero chapucero'
    }
    case 58:
    {
      return NombrePerk = 'Espias de las sombras'
    }
    case 59:
    {
      return NombrePerk = 'Furia espiritual'
    }
    case 60:
    {
      return NombrePerk = 'Aliento'
    }
    case 61:
    {
      return NombrePerk = 'Sobretension'
    }
    case 62:
    {
      return NombrePerk = 'Supervision'
    }
    case 63:
    {
      return NombrePerk = 'Instinto territorial'
    }
    case 64:
    {
      return NombrePerk = 'Manitas'
    }
    case 65:
    {
      return NombrePerk = 'Tanatofobia'
    }
    case 66:
    {
      return NombrePerk = 'Temblores trepidantes'
    }
    case 67:
    {
      return NombrePerk = 'Rastro de tormento'
    }
    case 68:
    {
      return NombrePerk = 'Presencia perturbadora'
    }
    case 69:
    {
      return NombrePerk = 'Implacable'
    }
    case 70:
    {
      return NombrePerk = 'Murmullos'
    }
    case 71:
    {
      return NombrePerk = 'Tacticas de Zanshin'
    }
    case 72:
    {
      return NombrePerk = 'Maleficio: Inmortal'
    }
    case 73:
    {
      return NombrePerk = 'Agarre del Dragón'
    }
    case 74:
    {
      return NombrePerk = 'Maleficio: Favor de Sangre'
    }
    case 75:
    {
      return NombrePerk = 'Acaparadora'
    }
    case 76:
    {
      return NombrePerk = 'Opresión'
    }
    case 77:
    {
      return NombrePerk = 'Golpe de Gracia'
    }
  }
}
function TraducirPerk(variable, id)
{
  k[id] = 0
  //perks de killer
  if(variable == "nursecalling") return ObtenerPerkKiller(0)
  if(variable == "agitation") return ObtenerPerkKiller(1)
  if(variable == "bamboozle") return ObtenerPerkKiller(2)
  if(variable == "bbqandchilli") return ObtenerPerkKiller(3)
  if(variable == "beastofprey") return ObtenerPerkKiller(4)
  if(variable == "bitter_murmur") return ObtenerPerkKiller(5)
  if(variable == "bloodecho") return ObtenerPerkKiller(6)
  if(variable == "bloodwarden") return ObtenerPerkKiller(7)
  if(variable == "bloodhound") return ObtenerPerkKiller(8)
  if(variable == "brutal_strength") return ObtenerPerkKiller(9)
  if(variable == "corruptintervention") return ObtenerPerkKiller(10)
  if(variable == "coulrophobia") return ObtenerPerkKiller(11)
  if(variable == "cruelconfinement") return ObtenerPerkKiller(12)
  if(variable == "darkdevotion") return ObtenerPerkKiller(13)
  if(variable == "deadmansswitch") return ObtenerPerkKiller(14)
  if(variable == "deathbound") return ObtenerPerkKiller(15)
  if(variable == "deerstalker") return ObtenerPerkKiller(16)
  if(variable == "discordance") return ObtenerPerkKiller(17)
  if(variable == "distressing") return ObtenerPerkKiller(18)
  if(variable == "dying_light") return ObtenerPerkKiller(19)
  if(variable == "enduring") return ObtenerPerkKiller(20)
  if(variable == "fireup") return ObtenerPerkKiller(21)
  if(variable == "forcedpenance") return ObtenerPerkKiller(22)
  if(variable == "franklinsloss") return ObtenerPerkKiller(23)
  if(variable == "furtive_chase") return ObtenerPerkKiller(24)
  if(variable == "gearhead") return ObtenerPerkKiller(25)
  if(variable == "hangmanstrick") return ObtenerPerkKiller(26)
  if(variable == "hex_devour_hope") return ObtenerPerkKiller(27)
  if(variable == "hex_hauntedground") return ObtenerPerkKiller(28)
  if(variable == "hex_huntresslullaby") return ObtenerPerkKiller(29)
  if(variable == "no_one_escapes_death") return ObtenerPerkKiller(30)
  if(variable == "hexretribution") return ObtenerPerkKiller(31)
  if(variable == "hex_ruin") return ObtenerPerkKiller(32)
  if(variable == "hex_the_third_seal") return ObtenerPerkKiller(33)
  if(variable == "hex_thrill_of_the_hunt") return ObtenerPerkKiller(34)
  if(variable == "imallears") return ObtenerPerkKiller(35)
  if(variable == "infectiousfright") return ObtenerPerkKiller(36)
  if(variable == "insidious") return ObtenerPerkKiller(37)
  if(variable == "iron_grasp") return ObtenerPerkKiller(38)
  if(variable == "ironmaiden") return ObtenerPerkKiller(39)
  if(variable == "knockout") return ObtenerPerkKiller(40)
  if(variable == "lightborn") return ObtenerPerkKiller(41)
  if(variable == "madgrit") return ObtenerPerkKiller(42)
  if(variable == "makeyourchoice") return ObtenerPerkKiller(43)
  if(variable == "mindbreaker") return ObtenerPerkKiller(44)
  if(variable == "monitorandabuse") return ObtenerPerkKiller(45)
  if(variable == "monstrous_shrine") return ObtenerPerkKiller(46)
  if(variable == "nemesis") return ObtenerPerkKiller(47)
  if(variable == "overcharge") return ObtenerPerkKiller(48)
  if(variable == "overwhelmingpresence") return ObtenerPerkKiller(49)
  if(variable == "play_with_your_food") return ObtenerPerkKiller(50)
  if(variable == "pop_goes_the_weasel") return ObtenerPerkKiller(51)
  if(variable == "predator") return ObtenerPerkKiller(52)
  if(variable == "rancor") return ObtenerPerkKiller(53)
  if(variable == "rememberme") return ObtenerPerkKiller(54)
  if(variable == "save_the_best_for_last") return ObtenerPerkKiller(55)
  if(variable == "shadowborn") return ObtenerPerkKiller(56)
  if(variable == "sloppy_butcher") return ObtenerPerkKiller(57)
  if(variable == "spies_from_the_shadows") return ObtenerPerkKiller(58)
  if(variable == "spiritfury") return ObtenerPerkKiller(59)
  if(variable == "stridor") return ObtenerPerkKiller(60)
  if(variable == "surge") return ObtenerPerkKiller(61)
  if(variable == "surveillance") return ObtenerPerkKiller(62)
  if(variable == "territorialimperative") return ObtenerPerkKiller(63)
  if(variable == "tinkerer") return ObtenerPerkKiller(64)
  if(variable == "thanatophobia") return ObtenerPerkKiller(65)
  if(variable == "thrillingtremors") return ObtenerPerkKiller(66)
  if(variable == "trailoftorment") return ObtenerPerkKiller(67)
  if(variable == "unnerving_presence") return ObtenerPerkKiller(68)
  if(variable == "unrelenting") return ObtenerPerkKiller(69)
  if(variable == "whispers") return ObtenerPerkKiller(70)
  if(variable == "zanshintactics") return ObtenerPerkKiller(71)
  if(variable == "hexundying") return ObtenerPerkKiller(72)
  if(variable == "dragonsgrip") return ObtenerPerkKiller(73)
  if(variable == "hexbloodfavor") return ObtenerPerkKiller(74)
  if(variable == 'k22p01') return ObtenerPerkKiller(75)
  if(variable == 'k22p02') return ObtenerPerkKiller(76)
  if(variable == 'K22p03') return ObtenerPerkKiller(77)
  //Perks de survivor
  k[id] = 1
  if(variable == "ace_in_the_hole") return ObtenerPerkSurv(0)
  if(variable == "adrenaline") return ObtenerPerkSurv(1)
  if(variable == "aftercare") return ObtenerPerkSurv(2)
  if(variable == "alert") return ObtenerPerkSurv(3)
  if(variable == "anymeansnecessary") return ObtenerPerkSurv(4)
  if(variable == "autodidact") return ObtenerPerkSurv(5)
  if(variable == "babysitter") return ObtenerPerkSurv(6)
  if(variable == "balanced_landing") return ObtenerPerkSurv(7)
  if(variable == "bettertogether") return ObtenerPerkSurv(8)
  if(variable == "bloodpact") return ObtenerPerkSurv(9)
  if(variable == "boilover") return ObtenerPerkSurv(10)
  if(variable == "bond") return ObtenerPerkSurv(11)
  if(variable == "borrowedtime") return ObtenerPerkSurv(12)
  if(variable == "botany_knowledge") return ObtenerPerkSurv(13)
  if(variable == "breakdown") return ObtenerPerkSurv(14)
  if(variable == "breakout") return ObtenerPerkSurv(15)
  if(variable == "buckleup") return ObtenerPerkSurv(16)
  if(variable == "calm_spirit") return ObtenerPerkSurv(17)
  if(variable == "camaraderie") return ObtenerPerkSurv(18)
  if(variable == "dance_with_me") return ObtenerPerkSurv(19)
  if(variable == "dark_sense") return ObtenerPerkSurv(20)
  if(variable == "deadhard") return ObtenerPerkSurv(21)
  if(variable == "decisivestrike") return ObtenerPerkSurv(22)
  if(variable == "deja_vu") return ObtenerPerkSurv(23)
  if(variable == "deliverance") return ObtenerPerkSurv(24)
  if(variable == "detectives_hunch") return ObtenerPerkSurv(25)
  if(variable == "distortion") return ObtenerPerkSurv(26)
  if(variable == "diversion") return ObtenerPerkSurv(27)
  if(variable == "empathy") return ObtenerPerkSurv(28)
  if(variable == "fixated") return ObtenerPerkSurv(29)
  if(variable == "flipflop") return ObtenerPerkSurv(30)
  if(variable == "forthepeople") return ObtenerPerkSurv(31)
  if(variable == "headon") return ObtenerPerkSurv(32)
  if(variable == "hope") return ObtenerPerkSurv(33)
  if(variable == "innerstrength") return ObtenerPerkSurv(34)
  if(variable == "iron_will") return ObtenerPerkSurv(35)
  if(variable == "kindred") return ObtenerPerkSurv(36)
  if(variable == "leader") return ObtenerPerkSurv(37)
  if(variable == "left_behind") return ObtenerPerkSurv(38)
  if(variable == "lightweight") return ObtenerPerkSurv(39)
  if(variable == "lithe") return ObtenerPerkSurv(40)
  if(variable == "luckybreak") return ObtenerPerkSurv(41)
  if(variable == "mettleofman") return ObtenerPerkSurv(42)
  if(variable == "nomither") return ObtenerPerkSurv(43)
  if(variable == "no_one_left_behind") return ObtenerPerkSurv(44)
  if(variable == "objectofobsession") return ObtenerPerkSurv(45)
  if(variable == "offtherecord") return ObtenerPerkSurv(46)
  if(variable == "open_handed") return ObtenerPerkSurv(47)
  if(variable == "pharmacy") return ObtenerPerkSurv(48)
  if(variable == "plunderers_instinct") return ObtenerPerkSurv(49)
  if(variable == "poised") return ObtenerPerkSurv(50)
  if(variable == "premonition") return ObtenerPerkSurv(51)
  if(variable == "prove_thyself") return ObtenerPerkSurv(52)
  if(variable == "quickquiet") return ObtenerPerkSurv(53)
  if(variable == "redherring") return ObtenerPerkSurv(54)
  if(variable == "repressedalliance") return ObtenerPerkSurv(55)
  if(variable == "resilience") return ObtenerPerkSurv(56)
  if(variable == "saboteur") return ObtenerPerkSurv(57)
  if(variable == "secondwind") return ObtenerPerkSurv(58)
  if(variable == "self_care") return ObtenerPerkSurv(59)
  if(variable == "slippery_meat") return ObtenerPerkSurv(60)
  if(variable == "small_game") return ObtenerPerkSurv(61)
  if(variable == "solesurvivor") return ObtenerPerkSurv(62)
  if(variable == "solidarity") return ObtenerPerkSurv(63)
  if(variable == "soulguard") return ObtenerPerkSurv(64)
  if(variable == "spine_chill") return ObtenerPerkSurv(65)
  if(variable == "sprint_burst") return ObtenerPerkSurv(66)
  if(variable == "stakeout") return ObtenerPerkSurv(67)
  if(variable == "streetwise") return ObtenerPerkSurv(68)
  if(variable == "tenacity") return ObtenerPerkSurv(69)
  if(variable == "technician") return ObtenerPerkSurv(70)
  if(variable == "this_is_not_happening") return ObtenerPerkSurv(71)
  if(variable == "up_the_ante") return ObtenerPerkSurv(72)
  if(variable == "unbreakable") return ObtenerPerkSurv(73)
  if(variable == "urban_evasion") return ObtenerPerkSurv(74)
  if(variable == "vigil") return ObtenerPerkSurv(75)
  if(variable == "wakeup") return ObtenerPerkSurv(76)
  if(variable == "wellmakeit") return ObtenerPerkSurv(77)
  if(variable == "weregonnaliveforever") return ObtenerPerkSurv(78)
  if(variable == "windowsofopportunity") return ObtenerPerkSurv(79)
  if(variable == "desperatemeasures") return ObtenerPerkSurv(80)
  if(variable == "visionary") return ObtenerPerkSurv(81)
  if(variable == "builttolast") return ObtenerPerkSurv(82)
  if(variable == "s24p01") return ObtenerPerkSurv(83)
  if(variable == "s24p02") return ObtenerPerkSurv(84)
  if(variable == "s24p03") return ObtenerPerkSurv(85)
  return;
}

function obtenervalorkill(variable, canal, usuario, server, sid, usa)
{
  var serverr = client.guilds.get(server)
  var user = serverr.members.get(usuario)
  var nombre_1 = variable.slice(variable.indexOf('persona')+10)
  var nombre_2 = nombre_1.slice(0, nombre_1.indexOf(',')-1)
  var playtime_1 = variable.slice(variable.indexOf('playtime')+11)
  var playtime_2 = playtime_1.slice(0, playtime_1.indexOf(',')-1)
  var bloodpoints_1 = variable.slice(variable.indexOf('bloodpoints')+14)
  var bloodpoints_2 = bloodpoints_1.slice(0, bloodpoints_1.indexOf(',')-1)
  //Rango de killer
  var killer_rank_1 = variable.slice(variable.indexOf('killer_rank')+11+3)
  var killer_rank_2 = killer_rank_1.slice(0, killer_rank_1.indexOf(',')-1)
  //Cantidad de partidas perfectas
  var killer_perfectgames_1 = variable.slice(variable.indexOf('killer_perfectgames')+19+3)
  var killer_perfectgames_2 = killer_perfectgames_1.slice(0, killer_perfectgames_1.indexOf(',')-1)
  //Survivors asesinados con tus propias manos
  var killed_1 = variable.slice(variable.indexOf('killed')+6+3)
  var killed_2 = killed_1.slice(0, killed_1.indexOf(',')-1)
  //Veces que sacrificaste a todos despues de que reparen el ultimo generador
  var killed_sacrificed_afterlastgen_1 = variable.slice(variable.indexOf('killed_sacrificed_afterlastgen')+30+3)
  var killed_sacrificed_afterlastgen_2 = killed_sacrificed_afterlastgen_1.slice(0, killed_sacrificed_afterlastgen_1.indexOf(',')-1)
  //Survivors sacrificados en ganchos
  var sacrificed_1 = variable.slice(variable.indexOf('sacrificed')+10+3)
  var sacrificed_2 = sacrificed_1.slice(0, sacrificed_1.indexOf(',')-1)
  //Ataques con motosierra de Hillbi
  var chainsawhits_1 = variable.slice(variable.indexOf('chainsawhits')+12+3)
  var chainsawhits_2 = chainsawhits_1.slice(0, chainsawhits_1.indexOf(',')-1)
  //Survivors atrapados con trampas del trampero
  var beartrapcatches_1 = variable.slice(variable.indexOf('beartrapcatches')+15+3)
  var beartrapcatches_2 = beartrapcatches_1.slice(0, beartrapcatches_1.indexOf(',')-1)
  //Hachas lanzadas
  var hatchetsthrown_1 = variable.slice(variable.indexOf('hatchetsthrown')+14+3)
  var hatchetsthrown_2 = hatchetsthrown_1.slice(0, hatchetsthrown_1.indexOf(',')-1)
  //Survivors interrumpidos mientras reparan generadores
  var survivorsgrabbedrepairinggen_1 = variable.slice(variable.indexOf('survivorsgrabbedrepairinggen')+28+3)
  var survivorsgrabbedrepairinggen_2 = survivorsgrabbedrepairinggen_1.slice(0, survivorsgrabbedrepairinggen_1.indexOf(',')-1)
  //Survivors golpeados mientras cargas a otro survivor
  var survivorshitwhilecarrying_1 = variable.slice(variable.indexOf('survivorshitwhilecarrying')+25+3)
  var survivorshitwhilecarrying_2 = survivorshitwhilecarrying_1.slice(0, survivorshitwhilecarrying_1.indexOf(',')-1)
  //Trampillas cerradas
  var hatchesclosed_1 = variable.slice(variable.indexOf('hatchesclosed')+13+3)
  var hatchesclosed_2 = hatchesclosed_1.slice(0, hatchesclosed_1.indexOf(',')-1)
  //Veces que interrumpiste a un survivor rompiendo un totem
  var survivorsinterruptedcleansingtotem_1 = variable.slice(variable.indexOf('survivorsinterruptedcleansingtotem')+34+3)
  var survivorsinterruptedcleansingtotem_2 = survivorsinterruptedcleansingtotem_1.slice(0, survivorsinterruptedcleansingtotem_1.indexOf(',')-1)
  var state_1 = variable.slice(variable.indexOf('"state"')+9)
  var state_2 = state_1.slice(0, state_1.indexOf(',')-1)
  if(killer_rank_2 == 20 && killed_2 == 0 && sacrificed_2 == 0 && bloodpoints_2 == 0 && state_2 == 0)
  {
    const embedd = new Discord.RichEmbed()
    .setColor('#FF0000')
    .setTitle('Cuenta en actualización...')
    .setAuthor(user.user.tag, user.user.avatarURL)
    .setThumbnail(user.user.avatarURL)
    .addField('¿Hay algún problema?', 'Parece ser que tu cuenta estuvo en privado anteriormente, aunque no tienes de qué preocuparte. ¡Ya está siendo actualizada! Prueba cada **10** minutos obtener tus estadísticas.')
    .setTimestamp()
    .setFooter('La entidad', client.user.avatarURL);
    client.channels.get(canal).send(embedd)
    con.query(`SELECT * FROM EntityUsers WHERE SID = ${sid}`, (err, rows) => {
      if(err) throw err;
      if(rows.length >= 1)
      {
        con.query(`UPDATE EntityUsers SET killer_rank_1 = 0, update_at = ${usa}, state = 0 WHERE SID = '${sid}'`)
      } else
      {
        con.query(`INSERT INTO EntityUsers (SID, update_at, state) VALUES ('${sid}', '${usa}', '0')`)
      }
    })
    return;
  } 
  const embedd = new Discord.RichEmbed()
	.setColor('#FF0000')
  .setTitle('Estadisticas de Asesino de '+nombre_2)
	.setAuthor(user.user.tag, user.user.avatarURL)
	.setThumbnail('https://i.imgur.com/y4KRvLf.png')
  .addField('<:bp:724724401333076071> Puntos de sangre totales:', Coma(bloodpoints_2), true)
  .addField('Horas de juego:', Math.round(playtime_2/60), true)
  .addBlankField()
	.addField('Rango:', killer_rank_2, true)
  .addField('Partidas perfectas:', killer_perfectgames_2,true)
  .addField('<:Icons_killer:739182105870991410> Asesinatos con Mori:', killed_2, true)
  .addField('<:Icons_Bgen:739182106474709042> Sacrificaste a todos después del último generador:', killed_sacrificed_afterlastgen_2,true)
  .addField('Sacrificios en ganchos:', sacrificed_2,true)
  .addField('Ataques con motosierra (HillBilly):', chainsawhits_2, true)
  .addField('<:Icons_tramp:739182105900351578> Atrapados en trampas (Trampero):', beartrapcatches_2, true)
  .addField('<:Icons_axe:739182102947299539> Hachas lanzadas:', hatchetsthrown_2, true)
  .addField('<:Icons_Gen:739182107095466014> Surpervivientes interrumpidos en gens:', survivorsgrabbedrepairinggen_2, true)
  .addField('<:icons_upa:739182105853952120> Supervivientes golpeados mientras cargas con otro:', survivorshitwhilecarrying_2, true)
  .addField('<:Icons_Hatch:739182106751664168> Trampillas cerradas:', hatchesclosed_2, true)
  .addField('<:icons_totem:739182106282033272> Supervivientes interrumpidos en totems:', survivorsinterruptedcleansingtotem_2, true)
	.setTimestamp()
  .setFooter('La entidad', client.user.avatarURL);
  client.channels.get(canal).send(embedd)
  var survivor_rank_1 = variable.slice(variable.indexOf('survivor_rank')+16)
  var survivor_rank_2 = survivor_rank_1.slice(0, survivor_rank_1.indexOf(',')-1)
  var survivor_perfectgames_1 = variable.slice(variable.indexOf('survivor_perfectgames')+21+3)
  var survivor_perfectgames_2 = survivor_perfectgames_1.slice(0, survivor_perfectgames_1.indexOf(',')-1)
  var equivgensrepaired_1 = variable.slice(variable.indexOf('gensrepaired')+12+3)
  var equivgensrepaired_2 = equivgensrepaired_1.slice(0, equivgensrepaired_1.indexOf(',')-1)
  var equivsurvivorshealed_1 = variable.slice(variable.indexOf('survivorshealed')+15+3)
  var equivsurvivorshealed_2 = equivsurvivorshealed_1.slice(0, equivsurvivorshealed_1.indexOf(',')-1)
  var equivsurvivorshealed_coop_1 = variable.slice(variable.indexOf('survivorshealed_coop')+20+3)
  var equivsurvivorshealed_coop_2 = equivsurvivorshealed_coop_1.slice(0, equivsurvivorshealed_coop_1.indexOf(',')-1)
  var skillchecks_1 = variable.slice(variable.indexOf('skillchecks')+11+3)
  var skillchecks_2 = skillchecks_1.slice(0, skillchecks_1.indexOf(',')-1)
  var escaped_1 = variable.slice(variable.indexOf('escaped')+7+3)
  var escaped_2 = escaped_1.slice(0, escaped_1.indexOf(',')-1)
  var escaped_ko_1 = variable.slice(variable.indexOf('escaped_ko')+10+3)
  var escaped_ko_2 = escaped_ko_1.slice(0, escaped_ko_1.indexOf(',')-1)
  var escaped_hatch_1 = variable.slice(variable.indexOf('escaped_hatch')+13+3)
  var escaped_hatch_2 = escaped_hatch_1.slice(0, escaped_hatch_1.indexOf(',')-1)
  var protectionhits_1 = variable.slice(variable.indexOf('protectionhits')+14+3)
  var protectionhits_2 = protectionhits_1.slice(0, protectionhits_1.indexOf(',')-1)
  var exitgatesopened_1 = variable.slice(variable.indexOf('exitgatesopened')+15+3)
  var exitgatesopened_2 = exitgatesopened_1.slice(0, exitgatesopened_1.indexOf(',')-1)
  var unhookedself_1 = variable.slice(variable.indexOf('unhookedself')+12+3)
  var unhookedself_2 = unhookedself_1.slice(0, unhookedself_1.indexOf(',')-1)
  var mysteryboxesopened_1 = variable.slice(variable.indexOf('mysteryboxesopened')+18+3)
  var mysteryboxesopened_2 = mysteryboxesopened_1.slice(0, mysteryboxesopened_1.indexOf(',')-1)
  con.query(`SELECT * FROM EntityUsers WHERE SID = '${sid}'`, (err, rows) => {
    if(err) throw err;
    if(rows.length >= 1)
    {
      con.query(`UPDATE EntityUsers SET name_1 = '${nombre_2}', playtime_1 = ${playtime_2}, bloodpoints_1 = ${bloodpoints_2}, survivor_rank_1 = ${survivor_rank_2}, survivor_perfectgames_1 = ${survivor_perfectgames_2}, equivgensrepaired_1 = ${equivgensrepaired_2}, equivsurvivorshealed_1 = ${equivsurvivorshealed_2}, equivsurvivorshealed_coop_1 = ${equivsurvivorshealed_coop_2}, skillchecks_1 = ${skillchecks_2}, escaped_1 = ${escaped_2}, escaped_ko_1 = ${escaped_ko_2}, escaped_hatch_1 = ${escaped_hatch_2}, protectionhits_1 = ${protectionhits_2}, exitgatesopened_1 = ${exitgatesopened_2}, unhookedself_1 = ${unhookedself_2}, mysteryboxesopened_1 = ${mysteryboxesopened_2}, killer_rank_1 = ${killer_rank_2}, killer_perfectgames_1 = ${killer_perfectgames_2}, killed_1 = ${killed_2}, killed_sacrificed_afterlastgen_1 = ${killed_sacrificed_afterlastgen_2}, sacrificed_1 = ${sacrificed_2}, chainsawhits_1 = ${chainsawhits_2}, beartrapcatches_1 = ${beartrapcatches_2}, hatchetsthrown_1 = ${hatchetsthrown_2}, survivorsgrabbedrepairinggen_1 = ${survivorsgrabbedrepairinggen_2}, survivorshitwhilecarrying_1 = ${survivorshitwhilecarrying_2}, hatchesclosed_1 = ${hatchesclosed_2}, survivorsinterruptedcleansingtotem_1 = ${survivorsinterruptedcleansingtotem_2}, update_at = ${usa} WHERE SID = '${sid}'`)
    } else
    {
      con.query(`INSERT INTO EntityUsers (SID, update_at, name_1, playtime_1, bloodpoints_1, survivor_rank_1, survivor_perfectgames_1, equivgensrepaired_1, equivsurvivorshealed_1, equivsurvivorshealed_coop_1, skillchecks_1, escaped_1, escaped_ko_1, escaped_hatch_1, protectionhits_1, exitgatesopened_1, unhookedself_1, mysteryboxesopened_1, killer_rank_1, killer_perfectgames_1, killed_1, killed_sacrificed_afterlastgen_1, sacrificed_1, chainsawhits_1, beartrapcatches_1, hatchetsthrown_1, survivorsgrabbedrepairinggen_1, survivorshitwhilecarrying_1, hatchesclosed_1, survivorsinterruptedcleansingtotem_1) VALUES ('${sid}', '${usa}', '${nombre_2}', '${playtime_2}', '${bloodpoints_2}', '${survivor_rank_2}', '${survivor_perfectgames_2}', '${equivgensrepaired_2}', '${equivsurvivorshealed_2}', '${equivsurvivorshealed_coop_2}', '${skillchecks_2}', '${escaped_2}', '${escaped_ko_2}', '${escaped_hatch_2}', '${protectionhits_2}', '${exitgatesopened_2}', '${unhookedself_2}', '${mysteryboxesopened_2}', '${killer_rank_2}', '${killer_perfectgames_2}', '${killed_2}', '${killed_sacrificed_afterlastgen_2}', '${sacrificed_2}', '${chainsawhits_2}', '${beartrapcatches_2}', '${hatchetsthrown_2}', '${survivorsgrabbedrepairinggen_2}', '${survivorshitwhilecarrying_2}', '${hatchesclosed_2}', '${survivorsinterruptedcleansingtotem_2}')`)
    }
  })
  return;
}

function obtenervalorsurv(variable, canal, usuario, server, sid, usa)
{
  var serverr = client.guilds.get(server)
  var user = serverr.members.get(usuario)
  var nombre_1 = variable.slice(variable.indexOf('persona')+10)
  var nombre_2 = nombre_1.slice(0, nombre_1.indexOf(',')-1)
  var playtime_1 = variable.slice(variable.indexOf('playtime')+11)
  var playtime_2 = playtime_1.slice(0, playtime_1.indexOf(',')-1)
  var bloodpoints_1 = variable.slice(variable.indexOf('bloodpoints')+14)
  var bloodpoints_2 = bloodpoints_1.slice(0, bloodpoints_1.indexOf(',')-1)
  var survivor_rank_1 = variable.slice(variable.indexOf('survivor_rank')+16)
  var survivor_rank_2 = survivor_rank_1.slice(0, survivor_rank_1.indexOf(',')-1)
  var survivor_perfectgames_1 = variable.slice(variable.indexOf('survivor_perfectgames')+21+3)
  var survivor_perfectgames_2 = survivor_perfectgames_1.slice(0, survivor_perfectgames_1.indexOf(',')-1)
  var equivgensrepaired_1 = variable.slice(variable.indexOf('gensrepaired')+12+3)
  var equivgensrepaired_2 = equivgensrepaired_1.slice(0, equivgensrepaired_1.indexOf(',')-1)
  var equivsurvivorshealed_1 = variable.slice(variable.indexOf('survivorshealed')+15+3)
  var equivsurvivorshealed_2 = equivsurvivorshealed_1.slice(0, equivsurvivorshealed_1.indexOf(',')-1)
  var equivsurvivorshealed_coop_1 = variable.slice(variable.indexOf('survivorshealed_coop')+20+3)
  var equivsurvivorshealed_coop_2 = equivsurvivorshealed_coop_1.slice(0, equivsurvivorshealed_coop_1.indexOf(',')-1)
  var skillchecks_1 = variable.slice(variable.indexOf('skillchecks')+11+3)
  var skillchecks_2 = skillchecks_1.slice(0, skillchecks_1.indexOf(',')-1)
  var escaped_1 = variable.slice(variable.indexOf('escaped')+7+3)
  var escaped_2 = escaped_1.slice(0, escaped_1.indexOf(',')-1)
  var escaped_ko_1 = variable.slice(variable.indexOf('escaped_ko')+10+3)
  var escaped_ko_2 = escaped_ko_1.slice(0, escaped_ko_1.indexOf(',')-1)
  var escaped_hatch_1 = variable.slice(variable.indexOf('escaped_hatch')+13+3)
  var escaped_hatch_2 = escaped_hatch_1.slice(0, escaped_hatch_1.indexOf(',')-1)
  var protectionhits_1 = variable.slice(variable.indexOf('protectionhits')+14+3)
  var protectionhits_2 = protectionhits_1.slice(0, protectionhits_1.indexOf(',')-1)
  var exitgatesopened_1 = variable.slice(variable.indexOf('exitgatesopened')+15+3)
  var exitgatesopened_2 = exitgatesopened_1.slice(0, exitgatesopened_1.indexOf(',')-1)
  var unhookedself_1 = variable.slice(variable.indexOf('unhookedself')+12+3)
  var unhookedself_2 = unhookedself_1.slice(0, unhookedself_1.indexOf(',')-1)
  var mysteryboxesopened_1 = variable.slice(variable.indexOf('mysteryboxesopened')+18+3)
  var mysteryboxesopened_2 = mysteryboxesopened_1.slice(0, mysteryboxesopened_1.indexOf(',')-1)
  var state_1 = variable.slice(variable.indexOf('state')+8)
  var state_2 = state_1.slice(0, state_1.indexOf(',')-1)
  if(survivor_rank_2 == 20 && equivgensrepaired_2 == 0 && escaped_2 == 0 && bloodpoints_2 == 0 && state_2 == 1)
  {
    const embedd = new Discord.RichEmbed()
    .setColor('#FF0000')
    .setTitle('Cuenta en actualización...')
    .setAuthor(user.user.tag, user.user.avatarURL)
    .setThumbnail(user.user.avatarURL)
    .addField('¿Hay algún problema?', 'Parece ser que tu cuenta estuvo en privado anteriormente, aunque no tienes de qué preocuparte. ¡Ya está siendo actualizada! Prueba cada **10** minutos obtener tus estadísticas.')
    .setTimestamp()
    .setFooter('La entidad', client.user.avatarURL);
    client.channels.get(canal).send(embedd)
    con.query(`SELECT * FROM EntityUsers WHERE SID = ${sid}`, (err, rows) => {
      if(err) throw err;
      if(rows.length >= 1)
      {
        con.query(`UPDATE EntityUsers SET killer_rank_1 = 0, update_at = ${usa}, state = 0 WHERE SID = '${sid}'`)
      } else
      {
        con.query(`INSERT INTO EntityUsers (SID, update_at, state) VALUES ('${sid}', '${usa}', '0')`)
      }
    })
    return;
  } 
  const embedd = new Discord.RichEmbed()
	.setColor('#FF0000')
  .setTitle('Estadisticas de Superviviente de '+nombre_2)
	.setAuthor(user.user.tag, user.user.avatarURL)
	.setThumbnail('https://i.imgur.com/DG6fm1A.png')
  .addField('<:bp:724724401333076071> Puntos de sangre totales:', Coma(bloodpoints_2), true)
  .addField('Horas de juego:', Math.round(playtime_2/60), true)
  .addBlankField()
	.addField('Rango:', survivor_rank_2, true)
  .addField('<:icons_perfect:739182106139295915> Partidas perfectas:', survivor_perfectgames_2,true)
  .addField('<:Icons_Gen:739182107095466014> Generadores reparados:', equivgensrepaired_2, true)
  .addField('<:Icons_Aidkit:739182102427467817> Jugadores curados:', equivsurvivorshealed_2+'/'+equivsurvivorshealed_coop_2+' (Coop <:Icons_coop:739182106319650966>)',true)
  .addField('<:icons_skillCheck:739182107259043860> SkillChecks:', skillchecks_2,true)
  .addField('Total de Escapes:', escaped_2, true)
  .addField('Escapes arrastrándose:', escaped_ko_2, true)
  .addField('Escapes por trampilla:', escaped_hatch_2, true)
  .addField('Zafarse del gancho:', unhookedself_2, true)
  .addField('Hits de protección:', protectionhits_2, true)
  .addField('Puertas abiertas:', exitgatesopened_2, true)
  .addField('<:Icons_cofre:739182106651131957> Cofres abiertos:', mysteryboxesopened_2, true)
	.setTimestamp()
  .setFooter('La entidad', client.user.avatarURL)
  client.channels.get(canal).send(embedd)
  //Rango de killer
  var killer_rank_1 = variable.slice(variable.indexOf('killer_rank')+11+3)
  var killer_rank_2 = killer_rank_1.slice(0, killer_rank_1.indexOf(',')-1)
  //Cantidad de partidas perfectas
  var killer_perfectgames_1 = variable.slice(variable.indexOf('killer_perfectgames')+19+3)
  var killer_perfectgames_2 = killer_perfectgames_1.slice(0, killer_perfectgames_1.indexOf(',')-1)
  //Survivors asesinados con tus propias manos
  var killed_1 = variable.slice(variable.indexOf('killed')+6+3)
  var killed_2 = killed_1.slice(0, killed_1.indexOf(',')-1)
  //Veces que sacrificaste a todos despues de que reparen el ultimo generador
  var killed_sacrificed_afterlastgen_1 = variable.slice(variable.indexOf('killed_sacrificed_afterlastgen')+30+3)
  var killed_sacrificed_afterlastgen_2 = killed_sacrificed_afterlastgen_1.slice(0, killed_sacrificed_afterlastgen_1.indexOf(',')-1)
  //Survivors sacrificados en ganchos
  var sacrificed_1 = variable.slice(variable.indexOf('sacrificed')+10+3)
  var sacrificed_2 = sacrificed_1.slice(0, sacrificed_1.indexOf(',')-1)
  //Ataques con motosierra de Hillbi
  var chainsawhits_1 = variable.slice(variable.indexOf('chainsawhits')+12+3)
  var chainsawhits_2 = chainsawhits_1.slice(0, chainsawhits_1.indexOf(',')-1)
  //Survivors atrapados con trampas del trampero
  var beartrapcatches_1 = variable.slice(variable.indexOf('beartrapcatches')+15+3)
  var beartrapcatches_2 = beartrapcatches_1.slice(0, beartrapcatches_1.indexOf(',')-1)
  //Hachas lanzadas
  var hatchetsthrown_1 = variable.slice(variable.indexOf('hatchetsthrown')+14+3)
  var hatchetsthrown_2 = hatchetsthrown_1.slice(0, hatchetsthrown_1.indexOf(',')-1)
  //Survivors interrumpidos mientras reparan generadores
  var survivorsgrabbedrepairinggen_1 = variable.slice(variable.indexOf('survivorsgrabbedrepairinggen')+28+3)
  var survivorsgrabbedrepairinggen_2 = survivorsgrabbedrepairinggen_1.slice(0, survivorsgrabbedrepairinggen_1.indexOf(',')-1)
  //Survivors golpeados mientras cargas a otro survivor
  var survivorshitwhilecarrying_1 = variable.slice(variable.indexOf('survivorshitwhilecarrying')+25+3)
  var survivorshitwhilecarrying_2 = survivorshitwhilecarrying_1.slice(0, survivorshitwhilecarrying_1.indexOf(',')-1)
  //Trampillas cerradas
  var hatchesclosed_1 = variable.slice(variable.indexOf('hatchesclosed')+13+3)
  var hatchesclosed_2 = hatchesclosed_1.slice(0, hatchesclosed_1.indexOf(',')-1)
  //Veces que interrumpiste a un survivor rompiendo un totem
  var survivorsinterruptedcleansingtotem_1 = variable.slice(variable.indexOf('survivorsinterruptedcleansingtotem')+34+3)
  var survivorsinterruptedcleansingtotem_2 = survivorsinterruptedcleansingtotem_1.slice(0, survivorsinterruptedcleansingtotem_1.indexOf(',')-1)
  con.query(`SELECT * FROM EntityUsers WHERE SID = '${sid}'`, (err, rows) => {
    if(err) throw err;
    if(rows.length >= 1)
    {
      con.query(`UPDATE EntityUsers SET name_1 = '${nombre_2}', playtime_1 = ${playtime_2}, bloodpoints_1 = ${bloodpoints_2}, survivor_rank_1 = ${survivor_rank_2}, survivor_perfectgames_1 = ${survivor_perfectgames_2}, equivgensrepaired_1 = ${equivgensrepaired_2}, equivsurvivorshealed_1 = ${equivsurvivorshealed_2}, equivsurvivorshealed_coop_1 = ${equivsurvivorshealed_coop_2}, skillchecks_1 = ${skillchecks_2}, escaped_1 = ${escaped_2}, escaped_ko_1 = ${escaped_ko_2}, escaped_hatch_1 = ${escaped_hatch_2}, protectionhits_1 = ${protectionhits_2}, exitgatesopened_1 = ${exitgatesopened_2}, unhookedself_1 = ${unhookedself_2}, mysteryboxesopened_1 = ${mysteryboxesopened_2}, killer_rank_1 = ${killer_rank_2}, killer_perfectgames_1 = ${killer_perfectgames_2}, killed_1 = ${killed_2}, killed_sacrificed_afterlastgen_1 = ${killed_sacrificed_afterlastgen_2}, sacrificed_1 = ${sacrificed_2}, chainsawhits_1 = ${chainsawhits_2}, beartrapcatches_1 = ${beartrapcatches_2}, hatchetsthrown_1 = ${hatchetsthrown_2}, survivorsgrabbedrepairinggen_1 = ${survivorsgrabbedrepairinggen_2}, survivorshitwhilecarrying_1 = ${survivorshitwhilecarrying_2}, hatchesclosed_1 = ${hatchesclosed_2}, survivorsinterruptedcleansingtotem_1 = ${survivorsinterruptedcleansingtotem_2}, update_at = ${usa} WHERE SID = '${sid}'`)
    } else
    {
      con.query(`INSERT INTO EntityUsers (SID, update_at, name_1, playtime_1, bloodpoints_1, survivor_rank_1, survivor_perfectgames_1, equivgensrepaired_1, equivsurvivorshealed_1, equivsurvivorshealed_coop_1, skillchecks_1, escaped_1, escaped_ko_1, escaped_hatch_1, protectionhits_1, exitgatesopened_1, unhookedself_1, mysteryboxesopened_1, killer_rank_1, killer_perfectgames_1, killed_1, killed_sacrificed_afterlastgen_1, sacrificed_1, chainsawhits_1, beartrapcatches_1, hatchetsthrown_1, survivorsgrabbedrepairinggen_1, survivorshitwhilecarrying_1, hatchesclosed_1, survivorsinterruptedcleansingtotem_1) VALUES ('${sid}', '${usa}', '${nombre_2}', '${playtime_2}', '${bloodpoints_2}', '${survivor_rank_2}', '${survivor_perfectgames_2}', '${equivgensrepaired_2}', '${equivsurvivorshealed_2}', '${equivsurvivorshealed_coop_2}', '${skillchecks_2}', '${escaped_2}', '${escaped_ko_2}', '${escaped_hatch_2}', '${protectionhits_2}', '${exitgatesopened_2}', '${unhookedself_2}', '${mysteryboxesopened_2}', '${killer_rank_2}', '${killer_perfectgames_2}', '${killed_2}', '${killed_sacrificed_afterlastgen_2}', '${sacrificed_2}', '${chainsawhits_2}', '${beartrapcatches_2}', '${hatchetsthrown_2}', '${survivorsgrabbedrepairinggen_2}', '${survivorshitwhilecarrying_2}', '${hatchesclosed_2}', '${survivorsinterruptedcleansingtotem_2}')`)
    }
  })
  return;
}

function handleDisconnect() {
    con = mysql.createConnection(db_config);

    con.connect(function (err) {
        if (err) {
            console.log('Error al conectar la base de datos (reconectado): ', err);
            setTimeout(handleDisconnect, 2000);
        } else {
            var servers;
            con.query('SELECT * FROM Servidores', (err, rows) => {
                if (err) throw err;
                if (rows.length >= 1) {
                    servers = rows.length;
                    for (var x = 0; x < servers; x++) {
                        console.log('Loop Line 6833')
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
                console.log('Base de datos conectada.')
            }
            setInterval(function () {
                con.query('SELECT * FROM Servidores')
                VerificarSantuario();
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


function VerificarSantuario()
{
  const time = new Date();
  if(time.toUTCString().toLowerCase().includes('wed') && time.getUTCHours() == '0' && time.getUTCMinutes() == '1' && actualizar == '1')
  {
        actualizar = 0;
        setTimeout(() => {
          actualizar = 1;
        }, 120000)
        let options = {
          host: 'dbd.onteh.net.au',
          path: '/api/shrine',
          agent: false
          };
          const req = https.get(options, function (res) {
            var bodyChunks2 = [];
            res.on('data', function (chunk) {
                bodyChunks2.push(chunk);
            }).on('end', function () {
              var body2 = Buffer.concat(bodyChunks2);
              var perk_1_a = body2.slice(body2.indexOf('"id"')+6)
              body2 = perk_1_a;
              var perk_1_b = perk_1_a.slice(0, perk_1_a.indexOf('"'))
              var perk_2_a = body2.slice(body2.indexOf('"id"')+6)
              body2 = perk_2_a;
              var perk_2_b = perk_2_a.slice(0, perk_2_a.indexOf('"'))
              var perk_3_a = body2.slice(body2.indexOf('"id"')+6)
              body2 = perk_3_a;
              var perk_3_b = perk_3_a.slice(0, perk_3_a.indexOf('"'))
              var perk_4_a = body2.slice(body2.indexOf('"id"')+6)
              var perk_4_b = perk_4_a.slice(0, perk_4_a.indexOf('"'))
              con.query(`DELETE FROM santuario`)
              con.query(`INSERT INTO santuario (perk_1, perk_2, perk_3, perk_4) VALUES ('${perk_1_b}', '${perk_2_b}', '${perk_3_b}', '${perk_4_b}')`)
            })
          })
          return;
      }
}

function Coma(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

function twoDigits(d) {
  if(0 <= d && d < 10) return "0" + d.toString();
  if(-10 < d && d < 0) return "-0" + (-1*d).toString();
  return d.toString();
}


function ObtenerNumeroPerk(variable)
{
  //perks de killer
  if(variable == "nursecalling") return 0 
  if(variable == "agitation") return 1
  if(variable == "bamboozle") return 2
  if(variable == "bbqandchilli") return 3
  if(variable == "beastofprey") return 4
  if(variable == "bitter_murmur") return 5
  if(variable == "bloodecho") return 6
  if(variable == "bloodwarden") return 7
  if(variable == "bloodhound") return 8
  if(variable == "brutal_strength") return 9
  if(variable == "corruptintervention") return 10
  if(variable == "coulrophobia") return 11
  if(variable == "cruelconfinement") return 12
  if(variable == "darkdevotion") return 13
  if(variable == "deadmansswitch") return 14
  if(variable == "deathbound") return 15
  if(variable == "deerstalker") return 16
  if(variable == "discordance") return 17
  if(variable == "distressing") return 18
  if(variable == "dying_light") return 19
  if(variable == "enduring") return 20
  if(variable == "fireup") return 21
  if(variable == "forcedpenance") return 22
  if(variable == "franklinsloss") return 23
  if(variable == "furtive_chase") return 24
  if(variable == "gearhead") return 25
  if(variable == "hangmanstrick") return 26
  if(variable == "hex_devour_hope") return 27
  if(variable == "hex_hauntedground") return 28
  if(variable == "hex_huntresslullaby") return 29
  if(variable == "no_one_escapes_death") return 30
  if(variable == "hexretribution") return 31
  if(variable == "hex_ruin") return 32
  if(variable == "hex_the_third_seal") return 33
  if(variable == "hex_thrill_of_the_hunt") return 34
  if(variable == "imallears") return 35
  if(variable == "infectiousfright") return 36
  if(variable == "insidious") return 37
  if(variable == "iron_grasp") return 38
  if(variable == "ironmaiden") return 39
  if(variable == "knockout") return 40
  if(variable == "lightborn") return 41
  if(variable == "madgrit") return 42
  if(variable == "makeyourchoice") return 43
  if(variable == "mindbreaker") return 44
  if(variable == "monitorandabuse") return 45
  if(variable == "monstrous_shrine") return 46
  if(variable == "nemesis") return 47
  if(variable == "overcharge") return 48
  if(variable == "overwhelmingpresence") return 49
  if(variable == "play_with_your_food") return 50
  if(variable == "pop_goes_the_weasel") return 51
  if(variable == "predator") return 52
  if(variable == "rancor") return 53
  if(variable == "rememberme") return 54
  if(variable == "save_the_best_for_last") return 55
  if(variable == "shadowborn") return 56
  if(variable == "sloppy_butcher") return 57
  if(variable == "spies_from_the_shadows") return 58
  if(variable == "spiritfury") return 59
  if(variable == "stridor") return 60
  if(variable == "surge") return 61
  if(variable == "surveillance") return 62
  if(variable == "territorialimperative") return 63
  if(variable == "tinkerer") return 64
  if(variable == "thanatophobia") return 65
  if(variable == "thrillingtremors") return 66
  if(variable == "trailoftorment") return 67
  if(variable == "unnerving_presence") return 68
  if(variable == "unrelenting") return 69
  if(variable == "whispers") return 70
  if(variable == "zanshintactics") return 71
  if(variable == "hexundying") return 72
  if(variable == "dragonsgrip") return 73
  if(variable == "hexbloodfavor") return 74
  if(variable == "k22p01") return 74
  if(variable == "k22p02") return 75
  if(variable == "k22p03") return 76

  //Perks de survivor
  if(variable == "ace_in_the_hole") return 0
  if(variable == "adrenaline") return 1
  if(variable == "aftercare") return 2
  if(variable == "alert") return 3
  if(variable == "anymeansnecessary") return 4
  if(variable == "autodidact") return 5
  if(variable == "babysitter") return 6
  if(variable == "balanced_landing") return 7
  if(variable == "bettertogether") return 8
  if(variable == "bloodpact") return 9
  if(variable == "boilover") return 10
  if(variable == "bond") return 11
  if(variable == "borrowedtime") return 12
  if(variable == "botany_knowledge") return 13
  if(variable == "breakdown") return 14
  if(variable == "breakout") return 15
  if(variable == "buckleup") return 16
  if(variable == "calm_spirit") return 17
  if(variable == "camaraderie") return 18
  if(variable == "dance_with_me") return 19
  if(variable == "dark_sense") return 20
  if(variable == "deadhard") return 21
  if(variable == "decisivestrike") return 22
  if(variable == "deja_vu") return 23
  if(variable == "deliverance") return 24
  if(variable == "detectives_hunch") return 25
  if(variable == "distortion") return 26
  if(variable == "diversion") return 27
  if(variable == "empathy") return 28
  if(variable == "fixated") return 29
  if(variable == "flipflop") return 30
  if(variable == "forthepeople") return 31
  if(variable == "headon") return 32
  if(variable == "hope") return 33
  if(variable == "innerstrength") return 34
  if(variable == "iron_will") return 35
  if(variable == "kindred") return 36
  if(variable == "leader") return 37
  if(variable == "left_behind") return 38
  if(variable == "lightweight") return 39
  if(variable == "lithe") return 40
  if(variable == "luckybreak") return 41
  if(variable == "mettleofman") return 42
  if(variable == "nomither") return 43
  if(variable == "no_one_left_behind") return 44
  if(variable == "objectofobsession") return 45
  if(variable == "offtherecord") return 46
  if(variable == "open_handed") return 47
  if(variable == "pharmacy") return 48
  if(variable == "plunderers_instinct") return 49
  if(variable == "poised") return 50
  if(variable == "premonition") return 51
  if(variable == "prove_thyself") return 52
  if(variable == "quickquiet") return 53
  if(variable == "redherring") return 54
  if(variable == "repressedalliance") return 55
  if(variable == "resilience") return 56
  if(variable == "saboteur") return 57
  if(variable == "secondwind") return 58
  if(variable == "self_care") return 59
  if(variable == "slippery_meat") return 60
  if(variable == "small_game") return 61
  if(variable == "solesurvivor") return 62
  if(variable == "solidarity") return 63
  if(variable == "soulguard") return 64
  if(variable == "spine_chill") return 65
  if(variable == "sprint_burst") return 66
  if(variable == "stakeout") return 67
  if(variable == "streetwise") return 68
  if(variable == "tenacity") return 69
  if(variable == "technician") return 70
  if(variable == "this_is_not_happening") return 71
  if(variable == "up_the_ante") return 72
  if(variable == "unbreakable") return 73
  if(variable == "urban_evasion") return 74
  if(variable == "vigil") return 75
  if(variable == "wakeup") return 76
  if(variable == "wellmakeit") return 77
  if(variable == "weregonnaliveforever") return 78
  if(variable == "windowsofopportunity") return 79
  if(variable == "desperatemeasures") return 80
  if(variable == "visionary") return 81
  if(variable == "builttolast") return 82
  if(variable == "s24p01") return 83
  if(variable == "s24p02") return 84
  if(variable == "s24p03") return 85
  return;
}

function ObtenerPerkSurv_ING(numero)
{
  switch(numero)
  {
    case 0:
    {
      return NombrePerk = 'Ace in the Hole'
    }
    case 1:
    {
      return NombrePerk = 'Adrenaline'
    }
    case 2:
    {
      return NombrePerk = 'Aftercare'
    }
    case 3:
    {
      return NombrePerk = 'Alert'
    }
    case 4:
    {
      return NombrePerk = 'Any Means Necessary'
    }
    case 5:
    {
      return NombrePerk = 'Autodidact'
    }
    case 6:
    {
      return NombrePerk = 'Babysitter'
    }
    case 7:
    {
      return NombrePerk = 'Balanced Landing'
    }
    case 8:
    {
      return NombrePerk = 'Better Together'
    }
    case 9:
    {
      return NombrePerk = 'Blood Pact'
    }
    case 10:
    {
      return NombrePerk = 'Boil Over'
    }
    case 11:
    {
      return NombrePerk = 'Bond'
    }
    case 12:
    {
      return NombrePerk = 'Borrowed Time'
    }
    case 13:
    {
      return NombrePerk = 'Botany Knowledge'
    }
    case 14:
    {
      return NombrePerk = 'Breakdown'
    }
    case 15:
    {
      return NombrePerk = 'Breakout'
    }
    case 16:
    {
      return NombrePerk = 'Buckle Up'
    }
    case 17:
    {
      return NombrePerk = 'Calm Spirit'
    }
    case 18:
    {
      return NombrePerk = 'Camaraderie'
    }
    case 19:
    {
      return NombrePerk = 'Dance With Me'
    }
    case 20:
    {
      return NombrePerk = 'Dark Sense'
    }
    case 21:
    {
      return NombrePerk = 'Dead Hard'
    }
    case 22:
    {
      return NombrePerk = 'Decisive Strike'
      
    }
    case 23:
    {
      return NombrePerk = 'Déjà Vu'
      
    }
    case 24:
    {
      return NombrePerk = 'Deliverance'
      
    }
    case 25:
    {
      return NombrePerk = "Detective's Hunch"
      
    }
    case 26:
    {
      return NombrePerk = 'Distortion'
      
    }
    case 27:
    {
      return NombrePerk = 'Diversion'
      
    }
    case 28:
    {
      return NombrePerk = 'Empathy'
      
    }
    case 29:
    {
      return NombrePerk = 'Fixated'
      
    }
    case 30:
    {
      return NombrePerk = 'Flip-Flop'
      
    }
    case 31:
    {
      return NombrePerk = 'For the People'
      
    }
    case 32:
    {
      return NombrePerk = 'Head On'
      
    }
    case 33:
    {
      return NombrePerk = 'Hope'
      
    }
    case 34:
    {
      return NombrePerk = 'Inner Strength'
      
    }
    case 35:
    {
      return NombrePerk = 'Iron Will'
      
    }
    case 36:
    {
      return NombrePerk = 'Kindred'
      
    }
    case 37:
    {
      return NombrePerk = 'Leader'
      
    }
    case 38:
    {
      return NombrePerk = 'Left Behind'
      
    }
    case 39:
    {
      return NombrePerk = 'Lightweight'
      
    }
    case 40:
    {
      return NombrePerk = 'Lithe'
      
    }
    case 41:
    {
      return NombrePerk = 'Lucky Break'
      
    }
    case 42:
    {
      return NombrePerk = 'Mettle of Man'
      
    }
    case 43:
    {
      return NombrePerk = 'No Mither'
      
    }
    case 44:
    {
      return NombrePerk = 'No One Left Behind'
      
    }
    case 45:
    {
      return NombrePerk = 'Object of Obsession'
      
    }
    case 46:
    {
      return NombrePerk = 'Off the Record'
      
    }
    case 47:
    {
      return NombrePerk = 'Open-Handed'
      
    }
    case 48:
    {
      return NombrePerk = 'Pharmacy'
      
    }
    case 49:
    {
      return NombrePerk = 'Plunderers Instinct'
      
    }
    case 50:
    {
      return NombrePerk = 'Poised'
      
    }
    case 51:
    {
      return NombrePerk = 'Premonition'
      
    }
    case 52:
    {
      return NombrePerk = 'Prove Thyself'
      
    }
    case 53:
    {
      return NombrePerk = 'Quick & Quiet'
      
    }
    case 54:
    {
      return NombrePerk = 'Red Herring'
      
    }
    case 55:
    {
      return NombrePerk = 'Repressed Alliance'
      
    }
    case 56:
    {
      return NombrePerk = 'Resilience'
      
    }
    case 57:
    {
      return NombrePerk = 'Saboteur'
      
    }
    case 58:
    {
      return NombrePerk = 'Second Wind'
      
    }
    case 59:
    {
      return NombrePerk = 'Self-Care'
      
    }
    case 60:
    {
      return NombrePerk = 'Slippery Meat'
      
    }
    case 61:
    {
      return NombrePerk = 'Small Game'
      
    }
    case 62:
    {
      return NombrePerk = 'Sole Survivor'
      
    }
    case 63:
    {
      return NombrePerk = 'Solidarity'
      
    }
    case 64:
    {
      return NombrePerk = 'Soul Guard'
      
    }
    case 65:
    {
      return NombrePerk = 'Spine Chill'
      
    }
    case 66:
    {
      return NombrePerk = 'Sprint Burst'
      
    }
    case 67:
    {
      return NombrePerk = 'Stake Out'
      
    }
    case 68:
    {
      return NombrePerk = 'Streetwise'
      
    }
    case 69:
    {
      return NombrePerk = 'Tenacity'
      
    }
    case 70:
    {
      return NombrePerk = 'Technician'
      
    }
    case 71:
    {
      return NombrePerk = 'This Is Not Happening'
      
    }
    case 72:
    {
      return NombrePerk = 'Up the Ante'
      
    }
    case 73:
    {
      return NombrePerk = 'Unbreakable'
      
    }
    case 74:
    {
      return NombrePerk = 'Urban Evasion'
      
    }
    case 75:
    {
      return NombrePerk = 'Vigil'
      
    }
    case 76:
    {
      return NombrePerk = 'Wake Up!'
      
    }
    case 77:
    {
      return NombrePerk = 'Well Make It'
      
    }
    case 78:
    {
      return NombrePerk = 'Were Gonna Live Forever'
      
    }
    case 79:
    {
      return NombrePerk = 'Windows of Opportunity'
    }
    case 80:
    {
      return NombrePerk = 'Desperate Measures'
    }
    case 81:
    {
      return NombrePerk = 'Visionary'
    }
    case 82:
    {
      return NombrePerk = 'Built to Last'
    }
    case 83:
    {
      return NombrePerk = 'Appraisal'
    }
    case 84:
    {
      return NombrePerk = 'Deception'
    }
    case 85:
    {
      return NombrePerk = 'Power Struggle'
    }
  }
}

function ObtenerPerkKiller_ING(numero)
{
  switch(numero)
  {
    case 0:
    {
      return NombrePerk = 'A Nurses Calling'
    }
    case 1:
    {
      return NombrePerk = 'Agitation'
    }
    case 2:
    {
      return NombrePerk = 'Bamboozle'
    }
    case 3:
    {
      return NombrePerk = 'Barbecue & Chilli'
    }
    case 4:
    {
      return NombrePerk = 'Beast of Prey'
    }
    case 5:
    {
      return NombrePerk = 'Bitter Murmur'
    }
    case 6:
    {
      return NombrePerk = 'Blood Echo'
    }
    case 7:
    {
      return NombrePerk = 'Blood Warden'
    }
    case 8:
    {
      return NombrePerk = 'Bloodhound'
    }
    case 9:
    {
      return NombrePerk = 'Brutal Strength'
    }
    case 10:
    {
      return NombrePerk = 'Corrupt Intervention'
    }
    case 11:
    {
      return NombrePerk = 'Coulrophobia'
    }
    case 12:
    {
      return NombrePerk = 'Cruel Limits'
    }
    case 13:
    {
      return NombrePerk = 'Dark Devotion'
    }
    case 14:
    {
      return NombrePerk = 'Dead Mans Switch'
    }
    case 15:
    {
      return NombrePerk = 'Deathbound'
    }
    case 16:
    {
      return NombrePerk = 'Deerstalker'
    }
    case 17:
    {
      return NombrePerk = 'Discordance'
    }
    case 18:
    {
      return NombrePerk = 'Distressing'
    }
    case 19:
    {
      return NombrePerk = 'Dying Light'
    }
    case 20:
    {
      return NombrePerk = 'Enduring'
    }
    case 21:
    {
      return NombrePerk = 'Fire Up'
    }
    case 22:
    {
      return NombrePerk = 'Forced Penance'
    }
    case 23:
    {
      return NombrePerk = 'Franklins Demise'
    }
    case 24:
    {
      return NombrePerk = 'Furtive Chase'
    }
    case 25:
    {
      return NombrePerk = 'Gearhead'
    }
    case 26:
    {
      return NombrePerk = 'Hangmans Trick'
    }
    case 27:
    {
      return NombrePerk = 'Hex: Devour Hope'
    }
    case 28:
    {
      return NombrePerk = 'Hex: Haunted Ground'
    }
    case 29:
    {
      return NombrePerk = 'Hex: Huntress Lullaby'
    }
    case 30:
    {
      return NombrePerk = 'Hex: No One Escapes Death'
    }
    case 31:
    {
      return NombrePerk = 'Hex: Retribution'
    }
    case 32:
    {
      return NombrePerk = 'Hex: Ruin'
    }
    case 33:
    {
      return NombrePerk = 'Hex: The Third Seal'
    }
    case 34:
    {
      return NombrePerk = 'Hex: Thrill of the Hunt'
    }
    case 35:
    {
      return NombrePerk = 'Im All Ears'
    }
    case 36:
    {
      return NombrePerk = 'Infectious Fright'
    }
    case 37:
    {
      return NombrePerk = 'Insidious'
    }
    case 38:
    {
      return NombrePerk = 'Iron Grasp'
    }
    case 39:
    {
      return NombrePerk = 'Iron Maiden'
    }
    case 40:
    {
      return NombrePerk = 'Knock Out'
    }
    case 41:
    {
      return NombrePerk = 'Lightborn'
    }
    case 42:
    {
      return NombrePerk = 'Mad Grit'
    }
    case 43:
    {
      return NombrePerk = 'Make Your Choice'
    }
    case 44:
    {
      return NombrePerk = 'Mindbreaker'
    }
    case 45:
    {
      return NombrePerk = 'Monitor & Abuse'
    }
    case 46:
    {
      return NombrePerk = 'Monstrous Shrine'
    }
    case 47:
    {
      return NombrePerk = 'Nemesis'
    }
    case 48:
    {
      return NombrePerk = 'Overcharge'
    }
    case 49:
    {
      return NombrePerk = 'Overwhelming Presence'
    }
    case 50:
    {
      return NombrePerk = 'Play with Your Food'
    }
    case 51:
    {
      return NombrePerk = 'Pop Goes the Weasel'
    }
    case 52:
    {
      return NombrePerk = 'Predator'
    }
    case 53:
    {
      return NombrePerk = 'Rancor'
    }
    case 54:
    {
      return NombrePerk = 'Remember Me'
    }
    case 55:
    {
      return NombrePerk = 'Save the Best for Last'
    }
    case 56:
    {
      return NombrePerk = 'Shadowborn'
    }
    case 57:
    {
      return NombrePerk = 'Sloppy Butcher'
    }
    case 58:
    {
      return NombrePerk = 'Spies from the Shadows'
    }
    case 59:
    {
      return NombrePerk = 'Spirit Fury'
    }
    case 60:
    {
      return NombrePerk = 'Stridor'
    }
    case 61:
    {
      return NombrePerk = 'Surge'
    }
    case 62:
    {
      return NombrePerk = 'Surveillance'
    }
    case 63:
    {
      return NombrePerk = 'Territorial Imperative'
    }
    case 64:
    {
      return NombrePerk = 'Tinkerer'
    }
    case 65:
    {
      return NombrePerk = 'Thanatophobia'
    }
    case 66:
    {
      return NombrePerk = 'Thrilling Tremors'
    }
    case 67:
    {
      return NombrePerk = 'Trail of Torment'
    }
    case 68:
    {
      return NombrePerk = 'Unnerving Presence'
    }
    case 69:
    {
      return NombrePerk = 'Unrelenting'
    }
    case 70:
    {
      return NombrePerk = 'Whispers'
    }
    case 71:
    {
      return NombrePerk = 'Zanshin Tactics'
    }
    case 72:
    {
      return NombrePerk = 'Hex: Undying'
    }
    case 73:
    {
      return NombrePerk = `Dragon's Grip`
    }
    case 74:
    {
      return NombrePerk = 'Hex: Blood Favour'
    }
    case 75:
    {
      return NombrePerk = 'Hoarder'
    }
    case 76:
    {
      return NombrePerk = 'Oppression'
    }
    case 77:
    {
      return NombrePerk = 'Coup de Grâce'
    }
  }
}


function obtenervalorkill_ING(variable, canal, usuario, server, sid, usa)
{
  var serverr = client.guilds.get(server)
  var user = serverr.members.get(usuario)
  var nombre_1 = variable.slice(variable.indexOf('persona')+10)
  var nombre_2 = nombre_1.slice(0, nombre_1.indexOf(',')-1)
  var playtime_1 = variable.slice(variable.indexOf('playtime')+11)
  var playtime_2 = playtime_1.slice(0, playtime_1.indexOf(',')-1)
  var bloodpoints_1 = variable.slice(variable.indexOf('bloodpoints')+14)
  var bloodpoints_2 = bloodpoints_1.slice(0, bloodpoints_1.indexOf(',')-1)
  //Rango de killer
  var killer_rank_1 = variable.slice(variable.indexOf('killer_rank')+11+3)
  var killer_rank_2 = killer_rank_1.slice(0, killer_rank_1.indexOf(',')-1)
  //Cantidad de partidas perfectas
  var killer_perfectgames_1 = variable.slice(variable.indexOf('killer_perfectgames')+19+3)
  var killer_perfectgames_2 = killer_perfectgames_1.slice(0, killer_perfectgames_1.indexOf(',')-1)
  //Survivors asesinados con tus propias manos
  var killed_1 = variable.slice(variable.indexOf('killed')+6+3)
  var killed_2 = killed_1.slice(0, killed_1.indexOf(',')-1)
  //Veces que sacrificaste a todos despues de que reparen el ultimo generador
  var killed_sacrificed_afterlastgen_1 = variable.slice(variable.indexOf('killed_sacrificed_afterlastgen')+30+3)
  var killed_sacrificed_afterlastgen_2 = killed_sacrificed_afterlastgen_1.slice(0, killed_sacrificed_afterlastgen_1.indexOf(',')-1)
  //Survivors sacrificados en ganchos
  var sacrificed_1 = variable.slice(variable.indexOf('sacrificed')+10+3)
  var sacrificed_2 = sacrificed_1.slice(0, sacrificed_1.indexOf(',')-1)
  //Ataques con motosierra de Hillbi
  var chainsawhits_1 = variable.slice(variable.indexOf('chainsawhits')+12+3)
  var chainsawhits_2 = chainsawhits_1.slice(0, chainsawhits_1.indexOf(',')-1)
  //Survivors atrapados con trampas del trampero
  var beartrapcatches_1 = variable.slice(variable.indexOf('beartrapcatches')+15+3)
  var beartrapcatches_2 = beartrapcatches_1.slice(0, beartrapcatches_1.indexOf(',')-1)
  //Hachas lanzadas
  var hatchetsthrown_1 = variable.slice(variable.indexOf('hatchetsthrown')+14+3)
  var hatchetsthrown_2 = hatchetsthrown_1.slice(0, hatchetsthrown_1.indexOf(',')-1)
  //Survivors interrumpidos mientras reparan generadores
  var survivorsgrabbedrepairinggen_1 = variable.slice(variable.indexOf('survivorsgrabbedrepairinggen')+28+3)
  var survivorsgrabbedrepairinggen_2 = survivorsgrabbedrepairinggen_1.slice(0, survivorsgrabbedrepairinggen_1.indexOf(',')-1)
  //Survivors golpeados mientras cargas a otro survivor
  var survivorshitwhilecarrying_1 = variable.slice(variable.indexOf('survivorshitwhilecarrying')+25+3)
  var survivorshitwhilecarrying_2 = survivorshitwhilecarrying_1.slice(0, survivorshitwhilecarrying_1.indexOf(',')-1)
  //Trampillas cerradas
  var hatchesclosed_1 = variable.slice(variable.indexOf('hatchesclosed')+13+3)
  var hatchesclosed_2 = hatchesclosed_1.slice(0, hatchesclosed_1.indexOf(',')-1)
  //Veces que interrumpiste a un survivor rompiendo un totem
  var survivorsinterruptedcleansingtotem_1 = variable.slice(variable.indexOf('survivorsinterruptedcleansingtotem')+34+3)
  var survivorsinterruptedcleansingtotem_2 = survivorsinterruptedcleansingtotem_1.slice(0, survivorsinterruptedcleansingtotem_1.indexOf(',')-1)
  var state_1 = variable.slice(variable.indexOf('"state"')+9)
  var state_2 = state_1.slice(0, state_1.indexOf(',')-1)
  if(killer_rank_2 == 20 && killed_2 == 0 && sacrificed_2 == 0 && bloodpoints_2 == 0 && state_2 == 0)
  {
    const embedd = new Discord.RichEmbed()
    .setColor('#FF0000')
    .setTitle('Your account is being updated...')
    .setAuthor(user.user.tag, user.user.avatarURL)
    .setThumbnail(user.user.avatarURL)
    .addField('Is there any problem?', 'Seems like your account was private previously, but dont worry. Your account is being updated! Try again every **10** minutes to get your statistics.')
    .setTimestamp()
    .setFooter('Entity', client.user.avatarURL);
    client.channels.get(canal).send(embedd)
    con.query(`SELECT * FROM EntityUsers WHERE SID = ${sid}`, (err, rows) => {
      if(err) throw err;
      if(rows.length >= 1)
      {
        con.query(`UPDATE EntityUsers SET killer_rank_1 = 0, update_at = ${usa}, state = 0 WHERE SID = '${sid}'`)
      } else
      {
        con.query(`INSERT INTO EntityUsers (SID, update_at, state) VALUES ('${sid}', '${usa}', '0')`)
      }
    })
    return;
  } 
  const embedd = new Discord.RichEmbed()
	.setColor('#FF0000')
  .setTitle('Killer stats from '+nombre_2)
	.setAuthor(user.user.tag, user.user.avatarURL)
	.setThumbnail('https://i.imgur.com/y4KRvLf.png')
  .addField('<:bp:724724401333076071> Bloodpoints:', Coma(bloodpoints_2), true)
  .addField('In-game hours:', Math.round(playtime_2/60), true)
  .addBlankField()
	.addField('Rank:', killer_rank_2, true)
  .addField('Perfect games:', killer_perfectgames_2,true)
  .addField('<:Icons_killer:739182105870991410> Mori kills:', killed_2, true)
  .addField('<:Icons_Bgen:739182106474709042> 4 kills on hook after last gen:', killed_sacrificed_afterlastgen_2,true)
  .addField('On hook sacrifices:', sacrificed_2,true)
  .addField('Chainsaw hits (HillBilly):', chainsawhits_2, true)
  .addField('<:Icons_tramp:739182105900351578> Beartrap catches (Trapper):', beartrapcatches_2, true)
  .addField('<:Icons_axe:739182102947299539> Hatchets thrown:', hatchetsthrown_2, true)
  .addField('<:Icons_Gen:739182107095466014> Survivors grabbed repairing gens:', survivorsgrabbedrepairinggen_2, true)
  .addField('<:icons_upa:739182105853952120> Survivors hit while carrying another survivor:', survivorshitwhilecarrying_2, true)
  .addField('<:Icons_Hatch:739182106751664168> Hatches closed:', hatchesclosed_2, true)
  .addField('<:icons_totem:739182106282033272> Survivors interrupted cleasing totems:', survivorsinterruptedcleansingtotem_2, true)
	.setTimestamp()
  .setFooter('Entity', client.user.avatarURL);
  client.channels.get(canal).send(embedd)
  var survivor_rank_1 = variable.slice(variable.indexOf('survivor_rank')+16)
  var survivor_rank_2 = survivor_rank_1.slice(0, survivor_rank_1.indexOf(',')-1)
  var survivor_perfectgames_1 = variable.slice(variable.indexOf('survivor_perfectgames')+21+3)
  var survivor_perfectgames_2 = survivor_perfectgames_1.slice(0, survivor_perfectgames_1.indexOf(',')-1)
  var equivgensrepaired_1 = variable.slice(variable.indexOf('equivgensrepaired')+17+3)
  var equivgensrepaired_2 = equivgensrepaired_1.slice(0, equivgensrepaired_1.indexOf(',')-1)
  var equivsurvivorshealed_1 = variable.slice(variable.indexOf('equivsurvivorshealed')+20+3)
  var equivsurvivorshealed_2 = equivsurvivorshealed_1.slice(0, equivsurvivorshealed_1.indexOf(',')-1)
  var equivsurvivorshealed_coop_1 = variable.slice(variable.indexOf('equivsurvivorshealed_coop')+25+3)
  var equivsurvivorshealed_coop_2 = equivsurvivorshealed_coop_1.slice(0, equivsurvivorshealed_coop_1.indexOf(',')-1)
  var skillchecks_1 = variable.slice(variable.indexOf('skillchecks')+11+3)
  var skillchecks_2 = skillchecks_1.slice(0, skillchecks_1.indexOf(',')-1)
  var escaped_1 = variable.slice(variable.indexOf('escaped')+7+3)
  var escaped_2 = escaped_1.slice(0, escaped_1.indexOf(',')-1)
  var escaped_ko_1 = variable.slice(variable.indexOf('escaped_ko')+10+3)
  var escaped_ko_2 = escaped_ko_1.slice(0, escaped_ko_1.indexOf(',')-1)
  var escaped_hatch_1 = variable.slice(variable.indexOf('escaped_hatch')+13+3)
  var escaped_hatch_2 = escaped_hatch_1.slice(0, escaped_hatch_1.indexOf(',')-1)
  var protectionhits_1 = variable.slice(variable.indexOf('protectionhits')+14+3)
  var protectionhits_2 = protectionhits_1.slice(0, protectionhits_1.indexOf(',')-1)
  var exitgatesopened_1 = variable.slice(variable.indexOf('exitgatesopened')+15+3)
  var exitgatesopened_2 = exitgatesopened_1.slice(0, exitgatesopened_1.indexOf(',')-1)
  var unhookedself_1 = variable.slice(variable.indexOf('unhookedself')+12+3)
  var unhookedself_2 = unhookedself_1.slice(0, unhookedself_1.indexOf(',')-1)
  var mysteryboxesopened_1 = variable.slice(variable.indexOf('mysteryboxesopened')+18+3)
  var mysteryboxesopened_2 = mysteryboxesopened_1.slice(0, mysteryboxesopened_1.indexOf(',')-1)
  con.query(`SELECT * FROM EntityUsers WHERE SID = '${sid}'`, (err, rows) => {
    if(err) throw err;
    if(rows.length >= 1)
    {
      con.query(`UPDATE EntityUsers SET name_1 = '${nombre_2}', playtime_1 = ${playtime_2}, bloodpoints_1 = ${bloodpoints_2}, survivor_rank_1 = ${survivor_rank_2}, survivor_perfectgames_1 = ${survivor_perfectgames_2}, equivgensrepaired_1 = ${equivgensrepaired_2}, equivsurvivorshealed_1 = ${equivsurvivorshealed_2}, equivsurvivorshealed_coop_1 = ${equivsurvivorshealed_coop_2}, skillchecks_1 = ${skillchecks_2}, escaped_1 = ${escaped_2}, escaped_ko_1 = ${escaped_ko_2}, escaped_hatch_1 = ${escaped_hatch_2}, protectionhits_1 = ${protectionhits_2}, exitgatesopened_1 = ${exitgatesopened_2}, unhookedself_1 = ${unhookedself_2}, mysteryboxesopened_1 = ${mysteryboxesopened_2}, killer_rank_1 = ${killer_rank_2}, killer_perfectgames_1 = ${killer_perfectgames_2}, killed_1 = ${killed_2}, killed_sacrificed_afterlastgen_1 = ${killed_sacrificed_afterlastgen_2}, sacrificed_1 = ${sacrificed_2}, chainsawhits_1 = ${chainsawhits_2}, beartrapcatches_1 = ${beartrapcatches_2}, hatchetsthrown_1 = ${hatchetsthrown_2}, survivorsgrabbedrepairinggen_1 = ${survivorsgrabbedrepairinggen_2}, survivorshitwhilecarrying_1 = ${survivorshitwhilecarrying_2}, hatchesclosed_1 = ${hatchesclosed_2}, survivorsinterruptedcleansingtotem_1 = ${survivorsinterruptedcleansingtotem_2}, update_at = ${usa} WHERE SID = '${sid}'`)
    } else
    {
      con.query(`INSERT INTO EntityUsers (SID, update_at, name_1, playtime_1, bloodpoints_1, survivor_rank_1, survivor_perfectgames_1, equivgensrepaired_1, equivsurvivorshealed_1, equivsurvivorshealed_coop_1, skillchecks_1, escaped_1, escaped_ko_1, escaped_hatch_1, protectionhits_1, exitgatesopened_1, unhookedself_1, mysteryboxesopened_1, killer_rank_1, killer_perfectgames_1, killed_1, killed_sacrificed_afterlastgen_1, sacrificed_1, chainsawhits_1, beartrapcatches_1, hatchetsthrown_1, survivorsgrabbedrepairinggen_1, survivorshitwhilecarrying_1, hatchesclosed_1, survivorsinterruptedcleansingtotem_1) VALUES ('${sid}', '${usa}', '${nombre_2}', '${playtime_2}', '${bloodpoints_2}', '${survivor_rank_2}', '${survivor_perfectgames_2}', '${equivgensrepaired_2}', '${equivsurvivorshealed_2}', '${equivsurvivorshealed_coop_2}', '${skillchecks_2}', '${escaped_2}', '${escaped_ko_2}', '${escaped_hatch_2}', '${protectionhits_2}', '${exitgatesopened_2}', '${unhookedself_2}', '${mysteryboxesopened_2}', '${killer_rank_2}', '${killer_perfectgames_2}', '${killed_2}', '${killed_sacrificed_afterlastgen_2}', '${sacrificed_2}', '${chainsawhits_2}', '${beartrapcatches_2}', '${hatchetsthrown_2}', '${survivorsgrabbedrepairinggen_2}', '${survivorshitwhilecarrying_2}', '${hatchesclosed_2}', '${survivorsinterruptedcleansingtotem_2}')`)
    }
  })
  return;
}

function obtenervalorsurv_ING(variable, canal, usuario, server, sid, usa)
{
  var serverr = client.guilds.get(server)
  var user = serverr.members.get(usuario)
  var nombre_1 = variable.slice(variable.indexOf('persona')+10)
  var nombre_2 = nombre_1.slice(0, nombre_1.indexOf(',')-1)
  var playtime_1 = variable.slice(variable.indexOf('playtime')+11)
  var playtime_2 = playtime_1.slice(0, playtime_1.indexOf(',')-1)
  var bloodpoints_1 = variable.slice(variable.indexOf('bloodpoints')+14)
  var bloodpoints_2 = bloodpoints_1.slice(0, bloodpoints_1.indexOf(',')-1)
  var survivor_rank_1 = variable.slice(variable.indexOf('survivor_rank')+16)
  var survivor_rank_2 = survivor_rank_1.slice(0, survivor_rank_1.indexOf(',')-1)
  var survivor_perfectgames_1 = variable.slice(variable.indexOf('survivor_perfectgames')+21+3)
  var survivor_perfectgames_2 = survivor_perfectgames_1.slice(0, survivor_perfectgames_1.indexOf(',')-1)
  var equivgensrepaired_1 = variable.slice(variable.indexOf('gensrepaired')+12+3)
  var equivgensrepaired_2 = equivgensrepaired_1.slice(0, equivgensrepaired_1.indexOf(',')-1)
  var equivsurvivorshealed_1 = variable.slice(variable.indexOf('survivorshealed')+15+3)
  var equivsurvivorshealed_2 = equivsurvivorshealed_1.slice(0, equivsurvivorshealed_1.indexOf(',')-1)
  var equivsurvivorshealed_coop_1 = variable.slice(variable.indexOf('survivorshealed_coop')+20+3)
  var equivsurvivorshealed_coop_2 = equivsurvivorshealed_coop_1.slice(0, equivsurvivorshealed_coop_1.indexOf(',')-1)
  var skillchecks_1 = variable.slice(variable.indexOf('skillchecks')+11+3)
  var skillchecks_2 = skillchecks_1.slice(0, skillchecks_1.indexOf(',')-1)
  var escaped_1 = variable.slice(variable.indexOf('escaped')+7+3)
  var escaped_2 = escaped_1.slice(0, escaped_1.indexOf(',')-1)
  var escaped_ko_1 = variable.slice(variable.indexOf('escaped_ko')+10+3)
  var escaped_ko_2 = escaped_ko_1.slice(0, escaped_ko_1.indexOf(',')-1)
  var escaped_hatch_1 = variable.slice(variable.indexOf('escaped_hatch')+13+3)
  var escaped_hatch_2 = escaped_hatch_1.slice(0, escaped_hatch_1.indexOf(',')-1)
  var protectionhits_1 = variable.slice(variable.indexOf('protectionhits')+14+3)
  var protectionhits_2 = protectionhits_1.slice(0, protectionhits_1.indexOf(',')-1)
  var exitgatesopened_1 = variable.slice(variable.indexOf('exitgatesopened')+15+3)
  var exitgatesopened_2 = exitgatesopened_1.slice(0, exitgatesopened_1.indexOf(',')-1)
  var unhookedself_1 = variable.slice(variable.indexOf('unhookedself')+12+3)
  var unhookedself_2 = unhookedself_1.slice(0, unhookedself_1.indexOf(',')-1)
  var mysteryboxesopened_1 = variable.slice(variable.indexOf('mysteryboxesopened')+18+3)
  var mysteryboxesopened_2 = mysteryboxesopened_1.slice(0, mysteryboxesopened_1.indexOf(',')-1)
  var state_1 = variable.slice(variable.indexOf('state')+8)
  var state_2 = state_1.slice(0, state_1.indexOf(',')-1)
  if(survivor_rank_2 == 20 && equivgensrepaired_2 == 0 && escaped_2 == 0 && bloodpoints_2 == 0 && state_2 == 1)
  {
    const embedd = new Discord.RichEmbed()
    .setColor('#FF0000')
    .setTitle('Your account is being updated...')
    .setAuthor(user.user.tag, user.user.avatarURL)
    .setThumbnail(user.user.avatarURL)
    .addField('Is there any problem?', 'Seems like your account was private previously, but dont worry. Your account is being updated! Try again every **10** minutes to get your statistics.')
    .setTimestamp()
    .setFooter('Entity', client.user.avatarURL);
    client.channels.get(canal).send(embedd)
    con.query(`SELECT * FROM EntityUsers WHERE SID = ${sid}`, (err, rows) => {
      if(err) throw err;
      if(rows.length >= 1)
      {
        con.query(`UPDATE EntityUsers SET killer_rank_1 = 0, update_at = ${usa}, state = 0 WHERE SID = '${sid}'`)
      } else
      {
        con.query(`INSERT INTO EntityUsers (SID, update_at, state) VALUES ('${sid}', '${usa}', '0')`)
      }
    })
    return;
  } 
  const embedd = new Discord.RichEmbed()
	.setColor('#FF0000')
  .setTitle('Survivor stats from '+nombre_2)
	.setAuthor(user.user.tag, user.user.avatarURL)
	.setThumbnail('https://i.imgur.com/DG6fm1A.png')
  .addField('<:bp:724724401333076071> Bloodpoints:', Coma(bloodpoints_2), true)
  .addField('In-game hours:', Math.round(playtime_2/60), true)
  .addBlankField()
	.addField('Rank:', survivor_rank_2, true)
  .addField('<:icons_perfect:739182106139295915> Perfect games:', survivor_perfectgames_2,true)
  .addField('<:Icons_Gen:739182107095466014> Gens repaired:', equivgensrepaired_2, true)
  .addField('<:Icons_Aidkit:739182102427467817> Survivors healed:', equivsurvivorshealed_2+'/'+equivsurvivorshealed_coop_2+' (Coop <:Icons_coop:739182106319650966>)',true)
  .addField('<:icons_skillCheck:739182107259043860> SkillChecks:', skillchecks_2,true)
  .addField('Escaped:', escaped_2, true)
  .addField('Escapes in dying state:', escaped_ko_2, true)
  .addField('Hatch escapes:', escaped_hatch_2, true)
  .addField('Self unhook:', unhookedself_2, true)
  .addField('Protection hits:', protectionhits_2, true)
  .addField('Exit gates opened:', exitgatesopened_2, true)
  .addField('<:Icons_cofre:739182106651131957> Mystery boxes opened:', mysteryboxesopened_2, true)
	.setTimestamp()
  .setFooter('Entity', client.user.avatarURL)
  client.channels.get(canal).send(embedd)
  //Rango de killer
  var killer_rank_1 = variable.slice(variable.indexOf('killer_rank')+11+3)
  var killer_rank_2 = killer_rank_1.slice(0, killer_rank_1.indexOf(',')-1)
  //Cantidad de partidas perfectas
  var killer_perfectgames_1 = variable.slice(variable.indexOf('killer_perfectgames')+19+3)
  var killer_perfectgames_2 = killer_perfectgames_1.slice(0, killer_perfectgames_1.indexOf(',')-1)
  //Survivors asesinados con tus propias manos
  var killed_1 = variable.slice(variable.indexOf('killed')+6+3)
  var killed_2 = killed_1.slice(0, killed_1.indexOf(',')-1)
  //Veces que sacrificaste a todos despues de que reparen el ultimo generador
  var killed_sacrificed_afterlastgen_1 = variable.slice(variable.indexOf('killed_sacrificed_afterlastgen')+30+3)
  var killed_sacrificed_afterlastgen_2 = killed_sacrificed_afterlastgen_1.slice(0, killed_sacrificed_afterlastgen_1.indexOf(',')-1)
  //Survivors sacrificados en ganchos
  var sacrificed_1 = variable.slice(variable.indexOf('sacrificed')+10+3)
  var sacrificed_2 = sacrificed_1.slice(0, sacrificed_1.indexOf(',')-1)
  //Ataques con motosierra de Hillbi
  var chainsawhits_1 = variable.slice(variable.indexOf('chainsawhits')+12+3)
  var chainsawhits_2 = chainsawhits_1.slice(0, chainsawhits_1.indexOf(',')-1)
  //Survivors atrapados con trampas del trampero
  var beartrapcatches_1 = variable.slice(variable.indexOf('beartrapcatches')+15+3)
  var beartrapcatches_2 = beartrapcatches_1.slice(0, beartrapcatches_1.indexOf(',')-1)
  //Hachas lanzadas
  var hatchetsthrown_1 = variable.slice(variable.indexOf('hatchetsthrown')+14+3)
  var hatchetsthrown_2 = hatchetsthrown_1.slice(0, hatchetsthrown_1.indexOf(',')-1)
  //Survivors interrumpidos mientras reparan generadores
  var survivorsgrabbedrepairinggen_1 = variable.slice(variable.indexOf('survivorsgrabbedrepairinggen')+28+3)
  var survivorsgrabbedrepairinggen_2 = survivorsgrabbedrepairinggen_1.slice(0, survivorsgrabbedrepairinggen_1.indexOf(',')-1)
  //Survivors golpeados mientras cargas a otro survivor
  var survivorshitwhilecarrying_1 = variable.slice(variable.indexOf('survivorshitwhilecarrying')+25+3)
  var survivorshitwhilecarrying_2 = survivorshitwhilecarrying_1.slice(0, survivorshitwhilecarrying_1.indexOf(',')-1)
  //Trampillas cerradas
  var hatchesclosed_1 = variable.slice(variable.indexOf('hatchesclosed')+13+3)
  var hatchesclosed_2 = hatchesclosed_1.slice(0, hatchesclosed_1.indexOf(',')-1)
  //Veces que interrumpiste a un survivor rompiendo un totem
  var survivorsinterruptedcleansingtotem_1 = variable.slice(variable.indexOf('survivorsinterruptedcleansingtotem')+34+3)
  var survivorsinterruptedcleansingtotem_2 = survivorsinterruptedcleansingtotem_1.slice(0, survivorsinterruptedcleansingtotem_1.indexOf(',')-1)
  con.query(`SELECT * FROM EntityUsers WHERE SID = '${sid}'`, (err, rows) => {
    if(err) throw err;
    if(rows.length >= 1)
    {
      con.query(`UPDATE EntityUsers SET name_1 = '${nombre_2}', playtime_1 = ${playtime_2}, bloodpoints_1 = ${bloodpoints_2}, survivor_rank_1 = ${survivor_rank_2}, survivor_perfectgames_1 = ${survivor_perfectgames_2}, equivgensrepaired_1 = ${equivgensrepaired_2}, equivsurvivorshealed_1 = ${equivsurvivorshealed_2}, equivsurvivorshealed_coop_1 = ${equivsurvivorshealed_coop_2}, skillchecks_1 = ${skillchecks_2}, escaped_1 = ${escaped_2}, escaped_ko_1 = ${escaped_ko_2}, escaped_hatch_1 = ${escaped_hatch_2}, protectionhits_1 = ${protectionhits_2}, exitgatesopened_1 = ${exitgatesopened_2}, unhookedself_1 = ${unhookedself_2}, mysteryboxesopened_1 = ${mysteryboxesopened_2}, killer_rank_1 = ${killer_rank_2}, killer_perfectgames_1 = ${killer_perfectgames_2}, killed_1 = ${killed_2}, killed_sacrificed_afterlastgen_1 = ${killed_sacrificed_afterlastgen_2}, sacrificed_1 = ${sacrificed_2}, chainsawhits_1 = ${chainsawhits_2}, beartrapcatches_1 = ${beartrapcatches_2}, hatchetsthrown_1 = ${hatchetsthrown_2}, survivorsgrabbedrepairinggen_1 = ${survivorsgrabbedrepairinggen_2}, survivorshitwhilecarrying_1 = ${survivorshitwhilecarrying_2}, hatchesclosed_1 = ${hatchesclosed_2}, survivorsinterruptedcleansingtotem_1 = ${survivorsinterruptedcleansingtotem_2}, update_at = ${usa} WHERE SID = '${sid}'`)
    } else
    {
      con.query(`INSERT INTO EntityUsers (SID, update_at, name_1, playtime_1, bloodpoints_1, survivor_rank_1, survivor_perfectgames_1, equivgensrepaired_1, equivsurvivorshealed_1, equivsurvivorshealed_coop_1, skillchecks_1, escaped_1, escaped_ko_1, escaped_hatch_1, protectionhits_1, exitgatesopened_1, unhookedself_1, mysteryboxesopened_1, killer_rank_1, killer_perfectgames_1, killed_1, killed_sacrificed_afterlastgen_1, sacrificed_1, chainsawhits_1, beartrapcatches_1, hatchetsthrown_1, survivorsgrabbedrepairinggen_1, survivorshitwhilecarrying_1, hatchesclosed_1, survivorsinterruptedcleansingtotem_1) VALUES ('${sid}', '${usa}', '${nombre_2}', '${playtime_2}', '${bloodpoints_2}', '${survivor_rank_2}', '${survivor_perfectgames_2}', '${equivgensrepaired_2}', '${equivsurvivorshealed_2}', '${equivsurvivorshealed_coop_2}', '${skillchecks_2}', '${escaped_2}', '${escaped_ko_2}', '${escaped_hatch_2}', '${protectionhits_2}', '${exitgatesopened_2}', '${unhookedself_2}', '${mysteryboxesopened_2}', '${killer_rank_2}', '${killer_perfectgames_2}', '${killed_2}', '${killed_sacrificed_afterlastgen_2}', '${sacrificed_2}', '${chainsawhits_2}', '${beartrapcatches_2}', '${hatchetsthrown_2}', '${survivorsgrabbedrepairinggen_2}', '${survivorshitwhilecarrying_2}', '${hatchesclosed_2}', '${survivorsinterruptedcleansingtotem_2}')`)
    }
  })
  return;
}



function tiempo(n) {
  var num = n;
  var hours = (num / 60);
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  return rhours + " horas y " + rminutes + " minutos";
  }

Date.prototype.toMysqlFormat = function() {
  return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

function VerificarPrivado(buffer)
{
  var state_1 = buffer.slice(buffer.indexOf('"state"')+9)
  var state_2 = state_1.slice(0, state_1.indexOf(',')-1)
  var result = 0;
  if(state_2 == 1)
  {
  result = 1;
  }
  return result;
}

function RemplazarEspacio(texto)
{
  var str = texto
  while(str.includes('_'))
  {
  console.log('Loop Line 6087')
  str = str.replace('_', ' ')
  }
  return str;
}

client.login(process.env.token);
