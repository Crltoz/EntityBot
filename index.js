const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
var https = require('https');
var http = require('http');
var useragent = require('express-useragent')
const mysql = require("mysql");
const { parse } = require("path");
const PerkSurv = 80;
const PerkKill = 72;
const Niveles = 3;
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
const lobby_set = new Set();
const r1 = new Set();
const r2 = new Set();
const n1 = {}
const n2 = new Set();
var actualizar = 1;

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
  defaultChannel.send("**Gracias por añadirme!** :white_check_mark:\n**-** Mi prefijo es `/`\n**-** Puedes ver mis comandos con `/ayuda` o `/lobby`\n**-** Cualquier consulta, sugerencia o reporte de bug. Hazla en nuestro discord: https://discord.gg/T6rEERg")
  client.channels.get('739997803094343721').send('| Nuevo servidor | Nombre: '+guild.name+' | Usuarios: '+guild.memberCount)
})



client.on("messageReactionAdd", (messageReaction, user) => {
                if (messageReaction.emoji == '1⃣' || messageReaction.emoji == '2⃣' || messageReaction.emoji == '3⃣' || messageReaction.emoji == '4⃣') {
                if(lobby_set.has(user.id))
                {
                  lobby_set.delete(user.id)
                  if(messageReaction.emoji == '1⃣')
                  {
                    r1.add(user.id)
                    messageReaction.message.channel.send('Envía por aquí el nivel inicial de la red de sangre en el que estás, '+user.tag)
                  } else if(messageReaction.emoji == '2⃣')
                  {
                    let numero = Math.floor(Math.random() * 21);
                    let numero_perk_1 = Math.floor(Math.random() * 79);
                    let numero_perk_2 = Math.floor(Math.random() * 79);
                    if(numero_perk_2 == numero_perk_1)
                    {
                      while(numero_perk_2 == numero_perk_1)
                      {
                        numero_perk_2 = Math.floor(Math.random() * 79);
                      }
                    }
                    let numero_perk_3 = Math.floor(Math.random() * 79);
                    if(numero_perk_3 == numero_perk_1 || numero_perk_3 == numero_perk_2)
                    {
                      while(numero_perk_3 == numero_perk_1)
                      {
                        numero_perk_3 = Math.floor(Math.random() * 79);
                      }
                      while(numero_perk_3 == numero_perk_2)
                      {
                        numero_perk_3 = Math.floor(Math.random() * 79);
                      }
                    }
                    let numero_perk_4 = Math.floor(Math.random() * 79);
                    if(numero_perk_4 == numero_perk_1 || numero_perk_4 == numero_perk_2 || numero_perk_4 == numero_perk_3)
                    {
                      while(numero_perk_4 == numero_perk_1)
                      {
                        numero_perk_4 = Math.floor(Math.random() * 79);
                      }
                      while(numero_perk_4 == numero_perk_2)
                      {
                        numero_perk_4 = Math.floor(Math.random() * 79);
                      }
                      while(numero_perk_4 == numero_perk_3)
                      {
                        numero_perk_4 = Math.floor(Math.random() * 79);
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
                    messageReaction.message.channel.send(embed)
                    return;
                  } else if(messageReaction.emoji == '3⃣')
                  {
                    let numero = Math.floor(Math.random() * 19);
                    KillerRandom(numero);
                    let numero_perk_1 = Math.floor(Math.random() * 71);
                    let numero_perk_2 = Math.floor(Math.random() * 71);
                    if(numero_perk_2 == numero_perk_1)
                    {
                      while(numero_perk_2 == numero_perk_1)
                      {
                        numero_perk_2 = Math.floor(Math.random() * 71);
                      }
                    }
                    let numero_perk_3 = Math.floor(Math.random() * 71);
                    if(numero_perk_3 == numero_perk_1 || numero_perk_3 == numero_perk_2)
                    {
                      while(numero_perk_3 == numero_perk_1)
                      {
                        numero_perk_3 = Math.floor(Math.random() * 71);
                      }
                      while(numero_perk_3 == numero_perk_2)
                      {
                        numero_perk_3 = Math.floor(Math.random() * 71);
                      }
                    }
                    let numero_perk_4 = Math.floor(Math.random() * 71);
                    if(numero_perk_4 == numero_perk_1 || numero_perk_4 == numero_perk_2 || numero_perk_4 == numero_perk_3)
                    {
                      while(numero_perk_4 == numero_perk_1)
                      {
                        numero_perk_4 = Math.floor(Math.random() * 71);
                      }
                      while(numero_perk_4 == numero_perk_2)
                      {
                        numero_perk_4 = Math.floor(Math.random() * 71);
                      }
                      while(numero_perk_4 == numero_perk_3)
                      {
                        numero_perk_4 = Math.floor(Math.random() * 71);
                      }
                    }
                    const embed = new Discord.RichEmbed()
                        .setThumbnail(ImagenPersonaje)
                        .setAuthor('| '+NombrePersonaje+' |', ImagenPersonaje)
                        .setTitle('Build:')
                        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
                        .addField('ㅤ', '**► '+ObtenerPerkKiller(numero_perk_1)+'**\n**► '+ObtenerPerkKiller(numero_perk_2)+'**\n**► '+ObtenerPerkKiller(numero_perk_3)+'**\n**► '+ObtenerPerkKiller(numero_perk_4)+'**', true)
                        .setColor(0xFF0000)
                    messageReaction.message.channel.send(embed)
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
                return;
              }
})

client.on("message", async (message) => {

 if(message.author.bot) return;
 if(message.webhookID) return;
 if(!message.member) return;


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
  if(parseInt(message.content) > 50 || parseInt(message.content) < 1 || parseInt(message.content) >= 50) return message.member.send('El nivel debe ser entre 1 y 49.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(parseInt(message.content) % 1 != '0') return message.member.send('El nivel no puede tener comas.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(parseInt(message.content) < n1[message.author.id]) return message.member.send('El nivel deseado no puede ser menor al inicial.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  LC[message.author.id] = 0;
  n2.delete(message.author.id)
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

 const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
 var jejox = args.shift();
 const command = jejox.toLowerCase();
 let texto = args.join(" ");
 const usa = new Date();


 if(message.content.startsWith(config.prefix))
 {
     message.delete(1);
     if (cid[message.guild.id] != null && message.channel.id != cid[message.guild.id])
     {
    const disc = client.channels.get(cid[message.guild.id]);
    message.channel.send('Las utilidades del bot solo pueden ser usadas en el canal de: '+disc)
    return;
    }
  if(p1.has(message.author.id) || p2.has(message.author.id) || p3.has(message.author.id) || p4.has(message.author.id)) return message.member.send('Tienes un comando activo, termina de usarlo.')
  if(command == 'calcular')
  {
    if(!texto) return message.member.send('Usa: **/calcular [Opción]** | Opciones: Killer o Survivor | Comando para obtener puntos de sangre necesarios para comprar todas las perks desde el nivel que estés.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
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
    message.member.send('Usa: **/calcular [Opción]** | Opciones: Killer o Survivor | Comando para obtener puntos de sangre necesarios para comprar todas las perks desde el nivel que estés.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
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
            var perk_1_a = body2.slice(body2.indexOf('id')+5)
            body2 = perk_1_a;
            var perk_1_b = perk_1_a.slice(0, perk_1_a.indexOf('"'))
            var perk_2_a = body2.slice(body2.indexOf('id')+5)
            body2 = perk_2_a;
            var perk_2_b = perk_2_a.slice(0, perk_2_a.indexOf('"'))
            var perk_3_a = body2.slice(body2.indexOf('id')+5)
            body2 = perk_3_a;
            var perk_3_b = perk_3_a.slice(0, perk_3_a.indexOf('"'))
            var perk_4_a = body2.slice(body2.indexOf('id')+5)
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
        const embed = new Discord.RichEmbed()
      .setThumbnail(message.member.user.avatarURL)
      .setAuthor('| '+message.author.tag+' |', )
      .setTitle('🈴 Santuario de los secretos:')
      .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
      .addField('Habilidades:', '**► '+TraducirPerk(perkk_1.toLowerCase())+'** - <:frag_iri:739690491829813369>2000\n**► '+TraducirPerk(perkk_2.toLowerCase())+'** - <:frag_iri:739690491829813369>2000\n**► '+TraducirPerk(perkk_3.toLowerCase())+'** - <:frag_iri:739690491829813369>2000\n**► '+TraducirPerk(perkk_4.toLowerCase())+'** - <:frag_iri:739690491829813369>2000', true)
      .setColor(0xFF0000)
      message.channel.send(embed)
      })
      return;
     }

     if(command == 'ayuda')
     {
      const embedd = new Discord.RichEmbed()
      .setColor('#FF0000')
      .setTitle('🔰 Ayuda - Comandos 🔰')
      .setAuthor(message.member.user.tag, message.member.user.avatarURL)
      .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
      .setThumbnail(client.user.avatarURL)
      .addField('NOTA:', 'Los paréntesis: **[]** no deben ser usados en los comandos, es simplemente para resaltar cómo se usa el comando.')
      .addField('/calcular [Killer o Survivor]', 'Podrás calcular cuánto cuesta tener todas las perks de tu superviviente o asesino, el bot luego te preguntará la cantidad de perks que tengas para hacer el cálculo.')
      .addField('/stats [Survivor o Killer] [URL Perfil Steam o Código de amigo]', 'Obtendrás las estadísticas de un jugador poniendo su Perfil de Steam y seleccionando si quieres ver las de Killer o Survivor.')
      .addField('/nivel [Nivel Inicial] [Nivel Final]', 'Este comando calcula los puntos de sangre necesarios para comprar los niveles en la red de sangre que desees.')
      .addField('/canal #nombre', 'Sólo puede ser usado por **ADMINISTRADORES**, puedes selecccionar un canal para que los comandos sólo funcionen allí. Usa **/canal borrar** para poder usarlos en cualquier canal nuevamente.')
      .addField('/lobby', 'Aquí hay funciones como los comandos de arriba, pero se utilizan a través de reacciones, más fácil para la gente que no le gusta usar los comandos.')
      .addField('/random [Survivor o Killer]', 'Generará y enviará por el canal una Build random de 4 perks, según lo que elijas, Killer o Survivor.')
      .addField('/santuario', 'Informará sobre el santuario de los secretos actual y el valor de fragmentos iridiscentes de cada perk.')
      .addField('/discord', 'Invitación del Discord Oficial del bot, aquí podrás obtener el link para unir el bot a tu Server de Discord o soporte del mismo.')
      .setTimestamp()
      .setFooter('La entidad - V0.6.5 - Beta Cerrada', client.user.avatarURL);
      message.channel.send(embedd)
      return;
    }

    if(command == 'discord')
    {
      message.channel.send('<:Entityicon:733814957111771146> En nuestro Discord podrás obtener el bot para tu servidor, y soporte. Link: https://discord.gg/6eBRcRK')
      return;
    }

    
     if (command == 'stats') {
       if(!texto) return message.channel.send('Usa: **/stats [Survivor o Killer] [URL Perfil Steam o Código de amigo]**')
       if(args[0].toLowerCase() != 'killer' && args[0].toLowerCase() != 'survivor') return message.channel.send('Usa: **/stats [Survivor o Killer] [URL Perfil Steam]**')
       if(!args[1]) return message.channel.send('Usa: **/stats [Survivor o Killer] [URL Perfil Steam]**')
       let text = args[1];
       //if(!text.includes('steamcommunity.com/id/') && !text.includes('steamcommunity.com/profiles/')) 
       //{
        /*if(isNaN(args[1])) return message.channel.send('El código de amigo o el URL de perfil de Steam es incorrecto, '+message.member.user)
        if(args[1].length < 8) return message.channel.send('El código de amigo es incorrecto, '+message.member.user)
        let sid_2 = args[1];
        con.query(`SELECT * FROM EntityUsers WHERE SID = '${sid_2}'`, (err, rows) =>
        {
          if(err) throw err;
          if(rows.length >= 1)
          {
            let k_rank = rows[0].killer_rank_1
            let update_att = rows[0].update_at;
            let bloodp = rows[0].bloodpoints_1
            let st = rows[0].state
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
                  var bodyChunks = [];
                  res.on('data', function (chunk) {
                      bodyChunks.push(chunk);
                  }).on('end', function () {
                  var body3 = Buffer.concat(bodyChunks);
                  var state_1 = body3.slice(body3.indexOf('state')+8)
                  var state_2 = state_1.slice(0, state_1.indexOf(',')-1)
                  if(state_2 == 1) 
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
                var bodyChunks = [];
                res.on('data', function (chunk) {
                    bodyChunks.push(chunk);
                }).on('end', function () {
                    var body = Buffer.concat(bodyChunks);
                    var state_1 = body3.slice(body3.indexOf('state')+8)
                    var state_2 = state_1.slice(0, state_1.indexOf(',')-1)
                    if(state_2 == 1)
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
                      obtenervalorsurv(body, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                    }
                    if(args[0].toLowerCase() == 'killer') 
                    {
                      obtenervalorkill(body, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
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
              var bodyChunks = [];
              res.on('data', function (chunk) {
                  bodyChunks.push(chunk);
              }).on('end', function () {
                  var body = Buffer.concat(bodyChunks);
                  var state_1 = body.slice(body.indexOf('state')+8)
                  var state_2 = state_1.slice(0, state_1.indexOf(',')-1)
                  if(state_2 == 1)
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
                  if(state_2 == 0) return message.channel.send('0')
                  if(isEmptyObject(body))
                  {

                    var options2 = {
                      host: 'dbd.onteh.net.au',
                      path: '/api/playerstats?steamid='+sid_2,
                      method: 'POST',
                      headers: { 'User-Agent': 'EntityBot/0.6.5' }
                  };    
                    options2.agent = new https.Agent(options2)
                    const reqq1 = https.request(options2, (res) => {
                      if(res.statusCode != 201)
                      {
                          const embedd = new Discord.RichEmbed()
                          .setColor('#FF0000')
                          .setTitle('No podemos agregar tu cuenta...')
                          .setAuthor(message.member.user.tag, message.member.user.avatarURL)
                          .setThumbnail(client.user.avatarURL)
                          .addField('Tenemos problemas con la web.', 'Actualmente, por muchas peticiones, la web no nos permite postear cuentas, por lo que deberás hacerlo apretando el botón de abajo y pegando tu link de perfil. Luego de ponerla ya podrás ver tus **//*stats** por aquí sin problema.')
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
                    obtenervalorsurv(body, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                  }
                  if(args[0].toLowerCase() == 'killer') 
                  {
                    obtenervalorkill(body, message.channel.id, message.author.id, message.guild.id, sid_2, usa.getTime())
                  }
              })
            });
          }
        })
        return;
       } else
       {*/
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
                      var state_1 = body3.slice(body3.indexOf('state')+8)
                      var state_2 = state_1.slice(0, state_1.indexOf(',')-1)
                      if(state_2 == 1) 
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
                        var state_1 = body4.slice(body4.indexOf('state')+8)
                        var state_2 = state_1.slice(0, state_1.indexOf(',')-1)
                        if(state_2 == 1)
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
                      if(VerificarPrivado(body5.toString()) == 1)
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
                          if(res.statusCode != 201)
                          {
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
        return;
      }


  if(command == 'nivel')
  {
    if(!texto) return message.member.send('Ingresa: **/nivel [Nivel Actual] [Nivel Deseado]** | Te dirá la cantidad de puntos de sangre necesaria para llegar a ese nivel.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
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
         if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('El comando sólo puede ser por personas con permisos de Administrador.')
         if (!texto) return message.member.send('Usa: **/canal #Nombre** | Para setear un canal donde puedan usarse los comandos. Si deseas quitar la restriccion de canales usa **/canal borrar**.')
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
             .setFooter('V0.6.5 - Beta Cerrada', client.user.avatarURL);
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
    if(!texto) return message.member.send('Usa **/random [Survivor o Killer]** || Te retornará un survivor o killer aleatorio con 4 perks.')
    if(texto.toLowerCase() == 'survivor')
    {
    let numero = Math.floor(Math.random() * 21);
    let numero_perk_1 = Math.floor(Math.random() * 79);
    let numero_perk_2 = Math.floor(Math.random() * 79);
    if(numero_perk_2 == numero_perk_1)
    {
      while(numero_perk_2 == numero_perk_1)
      {
        numero_perk_2 = Math.floor(Math.random() * 79);
      }
    }
    let numero_perk_3 = Math.floor(Math.random() * 79);
    if(numero_perk_3 == numero_perk_1 || numero_perk_3 == numero_perk_2)
    {
      while(numero_perk_3 == numero_perk_1)
      {
        numero_perk_3 = Math.floor(Math.random() * 79);
      }
      while(numero_perk_3 == numero_perk_2)
      {
        numero_perk_3 = Math.floor(Math.random() * 79);
      }
    }
    let numero_perk_4 = Math.floor(Math.random() * 79);
    if(numero_perk_4 == numero_perk_1 || numero_perk_4 == numero_perk_2 || numero_perk_4 == numero_perk_3)
    {
      while(numero_perk_4 == numero_perk_1)
      {
        numero_perk_4 = Math.floor(Math.random() * 79);
      }
      while(numero_perk_4 == numero_perk_2)
      {
        numero_perk_4 = Math.floor(Math.random() * 79);
      }
      while(numero_perk_4 == numero_perk_3)
      {
        numero_perk_4 = Math.floor(Math.random() * 79);
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
    message.channel.send(embed)
    return;
    }
    else if(texto.toLowerCase() == 'killer')
    {
      let numero = Math.floor(Math.random() * 19);
      KillerRandom(numero);
      let numero_perk_1 = Math.floor(Math.random() * 71);
      let numero_perk_2 = Math.floor(Math.random() * 71);
      if(numero_perk_2 == numero_perk_1)
      {
        while(numero_perk_2 == numero_perk_1)
        {
          numero_perk_2 = Math.floor(Math.random() * 71);
        }
      }
      let numero_perk_3 = Math.floor(Math.random() * 71);
      if(numero_perk_3 == numero_perk_1 || numero_perk_3 == numero_perk_2)
      {
        while(numero_perk_3 == numero_perk_1)
        {
          numero_perk_3 = Math.floor(Math.random() * 71);
        }
        while(numero_perk_3 == numero_perk_2)
        {
          numero_perk_3 = Math.floor(Math.random() * 71);
        }
      }
      let numero_perk_4 = Math.floor(Math.random() * 71);
      if(numero_perk_4 == numero_perk_1 || numero_perk_4 == numero_perk_2 || numero_perk_4 == numero_perk_3)
      {
        while(numero_perk_4 == numero_perk_1)
        {
          numero_perk_4 = Math.floor(Math.random() * 71);
        }
        while(numero_perk_4 == numero_perk_2)
        {
          numero_perk_4 = Math.floor(Math.random() * 71);
        }
        while(numero_perk_4 == numero_perk_3)
        {
          numero_perk_4 = Math.floor(Math.random() * 71);
        }
      }
      const embed = new Discord.RichEmbed()
          .setThumbnail(ImagenPersonaje)
          .setAuthor('| '+NombrePersonaje+' |', ImagenPersonaje)
          .setTitle('Perks:')
          .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
          .addField('ㅤ', '**► '+ObtenerPerkKiller(numero_perk_1)+'**\n**► '+ObtenerPerkKiller(numero_perk_2)+'**\n**► '+ObtenerPerkKiller(numero_perk_3)+'**\n**► '+ObtenerPerkKiller(numero_perk_4)+'**', true)
          .setColor(0xFF0000)
      message.channel.send(embed)
      return;
    } else
    {
      message.member.send('Usa **/random [Survivor o Killer]** || Te retornará un survivor o killer aleatorio con 4 perks.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
      return;
    }
  }
     message.member.send('El comando no existe. Usa **/ayuda** para ver todas las funciones y comandos.')
}

});

function ObtenerValor(nivel, Deseado, id)
{
  var total = 0;
  for(let x = nivel; x<=Deseado; x++)
  {
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
      return NombrePerk = 'Esto no puede estar pasando'
      
    }
    case 70:
    {
      return NombrePerk = 'Pericia tecnica'
      
    }
    case 71:
    {
      return NombrePerk = 'Tenacidad'
      
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
  }
  return;
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
      return NombrePerk = 'Sobretencion'
    }
    case 62:
    {
      return NombrePerk = 'Supervicion'
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
  }
}

function TraducirPerk(variable)
{
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
  //Perks de survivor
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
  if(variable == "technician") return ObtenerPerkSurv(69)
  if(variable == "tenacity") return ObtenerPerkSurv(70)
  if(variable == "this_is_not_happening") return ObtenerPerkSurv(71)
  if(variable == "up_the_ante") return ObtenerPerkSurv(72)
  if(variable == "unbreakable") return ObtenerPerkSurv(73)
  if(variable == "urban_evasion") return ObtenerPerkSurv(74)
  if(variable == "vigil") return ObtenerPerkSurv(75)
  if(variable == "wakeup") return ObtenerPerkSurv(76)
  if(variable == "wellmakeit") return ObtenerPerkSurv(77)
  if(variable == "weregonnaliveforever") return ObtenerPerkSurv(78)
  if(variable == "windowsofopportunity") return ObtenerPerkSurv(79)
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
  if(killer_rank_2 == 20 && killed_2 == 0 && sacrificed_2 == 0 && bloodpoints_2 == 0)
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
  var state_1 = variable.slice(variable.indexOf('state')+8)
  var state_2 = state_1.slice(0, state_1.indexOf(',')-1)
  if(state_2 == 1) return client.channels.get(canal).send('llego state_1 priv')
  if(survivor_rank_2 == 20 && equivgensrepaired_2 == 0 && escaped_2 == 0 && bloodpoints_2 == 0 && state_2 == 0)
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
                        let cidd = rows[x].cid;
                        let IDD = rows[x].ID;
                        cid[IDD] = cidd;
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
              var perk_1_a = body2.slice(body2.indexOf('id')+5)
              var perk_1_b = perk_1_a.slice(0, perk_1_a.indexOf('"'))
              var perk_2_a = perk_1_b.slice(perk_1_b.indexOf('id')+5)
              var perk_2_b = perk_2_a.slice(0, perk_2_a.indexOf('"'))
              var perk_3_a = perk_2_b.slice(perk_2_b.indexOf('id')+5)
              var perk_3_b = perk_3_a.slice(0, perk_3_a.indexOf('"'))
              var perk_4_a = perk_3_b.slice(perk_3_b.indexOf('id')+5)
              var perk_4_b = perk_4_a.slice(0, perk_4_a.indexOf('"'))
              con.query(`DELETE * FROM santuario`)
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
  console.log(state_1)
  var state_2 = state_1.slice(0, state_1.indexOf(',')-1)
  var result = 0;
  console.log(state_2)
  if(state_2 == '1')
  {
  console.log('1')
  result = 1;
  return result;
  }
  if(state_2 == '0')
  {
  console.log('0')
  result = 0;
  return result;
  }
  console.log('!= 1')
  return result;
}

client.login(process.env.token);
