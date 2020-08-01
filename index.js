const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
var https = require('https');
var http = require('http');
var useragent = require('express-useragent')
const mysql = require("mysql");
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
const r1_1 = new Set();
const r2 = new Set();
const r3 = new Set();
const r4 = new Set();
const r5 = new Set();
const n1 = {}
const n2 = new Set();


var db_config = {
    host: '185.201.10.94',
    user: 'u642668726_sh',
    password: 'y`SBzagH',
    database: 'u642668726_shsv'
}
var con;

var srv = http.createServer(function (req, res) {
  var source = req.headers['user-agent'],
  ua = useragent.parse(source);
  res.writeHead(200, {'EntityBot': 'Tools for Discord (Dead By Daylight)'});
  res.end(JSON.stringify(ua));
});

srv.listen(3000);

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


client.on("messageReactionAdd", (messageReaction, user) => {
                if (messageReaction.emoji == '1⃣' || messageReaction.emoji == '2⃣' || messageReaction.emoji == '3⃣' || messageReaction.emoji == '4⃣' || messageReaction.emoji == '5⃣') {
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
                  }
                }
                return;
              }
})

client.on("message", async (message) => {

 if(message.author.bot) return;
 if(message.webhookID) return;
 if(!message.member) return;

 if(r1.has(message.author.id))
 {
  if(message.content > 50 || message.content < 1 || message.content > 50) return message.member.send('El nivel debe ser entre 1 y 50.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
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
  if(message.content % 1 != '0') return message.member.send('El numero no puede tener comas.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(parseInt(message.content)*3 >= PerkKill*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  p1.delete(message.author.id)
  perks3[message.author.id] = message.content;
  p2.add(message.author.id)
  message.channel.send('Envía cuantas perks a nivel 2 tienes.')
  return;
 }

 if(p2.has(message.author.id))
 {
  if(message.content % 1 != '0') return message.member.send('El numero no puede tener comas.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(parseInt(message.content)*2 >= PerkKill*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(perks3[message.author.id]*3+parseInt(message.content)*2 >= PerkKill*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  p2.delete(message.author.id)
  perks2[message.author.id] = message.content;
  message.channel.send('Envía cuantas perks a nivel 1 tienes.')
  p3.add(message.author.id)
  return;
 }

 if(p3.has(message.author.id))
 {
  if(message.content % 1 != '0') return message.member.send('El numero no puede tener comas.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(parseInt(message.content) >= PerkKill*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(perks3[message.author.id]*3+perks2[message.author.id]*2+parseInt(message.content) >= PerkKill*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  p3.delete(message.author.id)
  perks1[message.author.id] = message.content;
  message.channel.send('Envía en que nivel estás con tu personaje.')
  p4.add(message.author.id)
  return;
 }

 if(p4.has(message.author.id))
 {
  if(message.content % 1 != '0') return message.member.send('El numero no puede tener comas.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(parseInt(message.content) > 50 || parseInt(message.content) < 1) return message.member.send('Nivel inválido.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  p4.delete(message.author.id)
  NivelPJ[message.author.id] = parseInt(message.content);
  let necesitaperks = PerkKill*Niveles-(3*perks3[message.author.id])-(2*perks2[message.author.id])-perks1[message.author.id];
  DBC[message.author.id] = necesitaperks;
  let NivelValor = ObtenerNP(NivelPJ[message.author.id], message.author.id)
  const embed = new Discord.RichEmbed()
        .setThumbnail(message.member.user.avatarURL)
        .setAuthor(message.member.displayName+'#'+message.member.user.discriminator, message.member.user.avatarURL)
        .setTitle('| Comprar todas las Perks |')
        .setURL('https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki')
        .addField('Puntos de Sangre necesarios <:bp:724724401333076071>', '**'+Coma(NivelValor)+'**', true)
        .addField('Niveles comprados', '**'+LC[message.author.id]+'**', true)
        .setColor(0xFF0000)
        message.channel.send({ embed });
  return;
 }

 if(ps1.has(message.author.id))
 {
  if(message.content % 1 != '0') return message.member.send('El numero no puede tener comas.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(parseInt(message.content)*3 >= PerkSurv*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  ps1.delete(message.author.id)
  perks3[message.author.id] = message.content;
  ps2.add(message.author.id)
  message.channel.send('Envía cuantas perks a nivel 2 tienes.')
  return;
 }

 if(ps2.has(message.author.id))
 {
  if(message.content % 1 != '0') return message.member.send('El numero no puede tener comas.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(parseInt(message.content)*2 >= PerkSurv*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(perks3[message.author.id]*3+parseInt(message.content)*2 >= PerkSurv*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  ps2.delete(message.author.id)
  perks2[message.author.id] = message.content;
  message.channel.send('Envía cuantas perks a nivel 1 tienes.')
  ps3.add(message.author.id)
  return;
 }

 if(ps3.has(message.author.id))
 {
  if(message.content % 1 != '0') return message.member.send('El numero no puede tener comas.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(parseInt(message.content) >= PerkSurv*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(parseInt(message.content) < 0) return message.member.send('No puedes tener menos de 0 perks.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(perks3[message.author.id]*3+perks2[message.author.id]*2+parseInt(message.content) >= PerkSurv*3) return message.member.send('No puedes tener todas o más perks de las existentes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  ps3.delete(message.author.id)
  perks1[message.author.id] = message.content;
  message.channel.send('Envía en que nivel estás con tu personaje.')
  ps4.add(message.author.id)
  return;
 }

 if(ps4.has(message.author.id))
 {
  if(message.content % 1 != '0') return message.member.send('El numero no puede tener comas.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  if(parseInt(message.content) > 50 || parseInt(message.content) < 1) return message.member.send('Nivel inválido.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
  ps4.delete(message.author.id)
  NivelPJ[message.author.id] = parseInt(message.content);
  let necesitaperks = PerkSurv*Niveles-(3*perks3[message.author.id])-(2*perks2[message.author.id])-perks1[message.author.id];
  DBC[message.author.id] = necesitaperks;
  let NivelValor = ObtenerNP(NivelPJ[message.author.id], message.author.id)
  const embed = new Discord.RichEmbed()
        .setThumbnail(message.member.user.avatarURL)
        .setAuthor(message.member.user.username+'#'+message.member.user.discriminator, message.member.user.avatarURL)
        .setTitle('| Comprar todas las perks de Survivor |')
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
      message.channel.send('Ingresa cuántas perks a nivel 3 tienes.')
      p1.add(message.author.id)
      return;
    }
    if(texto.toLowerCase() == 'survivor')
    {
      LC[message.author.id] = 0;
      message.channel.send('Ingresa cuántas perks a nivel 3 tienes.')
      ps1.add(message.author.id)
      return;
    }
    message.member.send('Usa: **/calcular [Opción]** | Opciones: Killer o Survivor | Comando para obtener puntos de sangre necesarios para comprar todas las perks desde el nivel que estés.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
    return;
     }

     if (command == 'stats') {
       if(!texto) return message.channel.send('Usa: **/stats [Survivor o Killer] [URL Perfil Steam]**')
       if(args[0].toLowerCase() != 'killer' && args[0].toLowerCase() != 'survivor') return message.channel.send('Usa: **/stats [Survivor o Killer] [URL Perfil Steam]**')
       if(!args[1]) return message.channel.send('Usa: **/stats [Survivor o Killer] [URL Perfil Steam]**')
       let text = args[1];
       if(!text.includes('steamcommunity.com/id/') && !text.includes('steamcommunity.com/profiles/')) return message.channel.send('El link del perfil de Steam debe ser válido.')
       var id_1;
       let cache = 0;
       if(text.includes('id'))
       {
       id_1 = text.slice(text.indexOf('id')+3, text.length)
       if(id_1.includes('/')) 
       {
         id_1 = id_1.slice(0, id_1.indexOf('/'))
       }
      } else
      {
        id_1 = text.slice(text.indexOf('profiles')+9, text.length)
       if(id_1.includes('/')) 
       {
         id_1 = id_1.slice(0, id_1.indexOf('/'))
       }
      }
       let options = {
        host: 'api.steampowered.com',
        path: '/ISteamUser/ResolveVanityURL/v0001/?key=DF0A08E817CCE67F129D35FFFB14901A&vanityurl='+id_1,
        agent: false
        };
        const req = https.get(options, function (res) {
          var bodyChunks2 = [];
          res.on('data', function (chunk) {
              bodyChunks2.push(chunk);
          }).on('end', function () {
              var body2 = Buffer.concat(bodyChunks2);
              if(isEmptyObject(body2)) return message.channel.send('La cuenta de Steam es inválida.')
              let sid_1 = body2.slice(body2.indexOf('steamid')+10)
              let sid_2 = sid_1.slice(0, sid_1.indexOf(',')-1)
              con.query(`SELECT * FROM EntityUsers WHERE SID = '${sid_2}'`, (err, rows) =>
              {
                console.log('Activado SELECT')
                if(err) throw err;
                if(rows.length >= 1)
                {
                  console.log('Activado ROWS')
                  let k_rank = rows[0].killer_rank_1
                  let update_att = rows[0].update_at;
                  if(k_rank == 0)
                  {
                    if(usa-update_att < 60000*60*1)
                    {
                      message.channel.send('La cuenta de Steam está en la cola para ser agregada. Recuerda que tarda hasta 1 hora.')
                      return;
                    }
                  } else
                  {
                    console.log('Activado CACHE: '+usa-update_att)
                    if(usa-update_att < 60000*60*3)
                    {
                      if(args[0].toLowerCase() == 'killer') 
                      {
                        cache = 1;
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
                        const embedd = new Discord.RichEmbed()
                        .setColor('#FF0000')
                        .setTitle('Estadisticas de Asesino de '+user.user.tag)
                        .setAuthor(user.user.tag, user.user.avatarURL)
                        .setThumbnail(user.user.avatarURL)
                        .addField('<:bp:724724401333076071> Puntos de sangre totales:', Coma(bloodpoints))
                        .addField('Rango:', killer_rank, true)
                        .addField('Partidas perfectas:', killer_perfectgames,true)
                        .addField('Asesinatos con Mori:', killed)
                        .addField('Sacrificiaste a todos después del último generador:', killed_sacrificed_afterlastgen,true)
                        .addField('Sacrificios en ganchos:', sacrificed,true)
                        .addField('Ataques con motosierra (HillBilly):', chainsawhits, true)
                        .addField('Atrapados en trampas (Trampero):', beartrapcatches, true)
                        .addField('Hachas lanzadas:', hatchetsthrown, true)
                        .addField('Surpervivientes interrumpidos en gens:', survivorsgrabbedrepairinggen, true)
                        .addField('Supervivientes golpeados mientras cargas con otro:', survivorshitwhilecarrying, true)
                        .addField('Trampillas cerradas:', hatchesclosed, true)
                        .addField('Supervivientes interrumpidos en totems:', survivorsinterruptedcleansingtotem, true)
                        .setTimestamp()
                        .setFooter('La entidad', client.user.avatarURL);
                        message.channel.send(embedd)
                      } else if(args[0].toLowerCase() == 'survivor') 
                      {
                        console.log('Activado survivor')
                        cache = 1;
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
                        const embedd = new Discord.RichEmbed()
                        .setColor('#FF0000')
                        .setTitle('Estadisticas de Superviviente de '+user.user.tag)
                        .setAuthor(user.user.tag, user.user.avatarURL)
                        .setThumbnail(user.user.avatarURL)
                        .addField('<:bp:724724401333076071> Puntos de sangre totales:', Coma(bloodpoints))
                        .addField('Rango:', survivor_rank, true)
                        .addField('Partidas perfectas:', survivor_perfectgames,true)
                        .addField('Generadores reparados:', equivgensrepaired)
                        .addField('Jugadores curados:', equivsurvivorshealed+'/'+equivsurvivorshealed_coop+' (Coop)',true)
                        .addField('SkillChecks:', skillchecks,true)
                        .addField('Total de Escapes:', escaped, true)
                        .addField('Escapes arrastrándose:', escaped_ko, true)
                        .addField('Escapes por trampilla:', escaped_hatch, true)
                        .addField('Zafarse del gancho:', unhookedself, true)
                        .addField('Hits de protección:', protectionhits, true)
                        .addField('Puertas abiertas:', exitgatesopened, true)
                        .addField('Cofres abiertos:', mysteryboxesopened, true)
                        .setTimestamp()
                        .setFooter('La entidad', client.user.avatarURL)
                        message.channel.send(embedd)
                      }
                    }
                  }
                }
              })
              if(cache == 1)
              {
                console.log('RETURN CACHE')
                return;
              } else
              {
              var options = {
                host: 'dbd.onteh.net.au',
                path: '/api/playerstats?steamid='+sid_2
            };      
            var req1 = https.get(options, function (res) {
                var bodyChunks = [];
                res.on('data', function (chunk) {
                    bodyChunks.push(chunk);
                }).on('end', function () {
                    var body = Buffer.concat(bodyChunks);
                    if(isEmptyObject(body))
                    {
                      var options2 = {
                        host: 'dbd.onteh.net.au',
                        path: '/api/playerstats?steamid='+sid_2,
                        method: 'POST'
                    };    
                      options2.agent = new https.Agent(options2)
                      const reqq = https.request(options2, (res) => {
                        message.channel.send('La cuenta ingresada no estaba registrada, fue agregada automáticamente y en las próximas horas deberían estar sus estadísticas disponibles.')
                        con.query(`SELECT * FROM EntityUsers WHERE SID = '${sid_2}'`, (err, rows) => {
                          if(err) throw err;
                          if(rows.length >= 1)
                          {
                            con.query(`UPDATE EntityUsers SET update_at = ${usa} WHERE SID = '${sid_2}'`)
                          } else{
                            con.query(`INSERT INTO EntityUsers (SID, update_at) VALUES ('${sid_2}', '${usa}')`)
                          }
                        })
                        console.log('statusCode:', res.statusCode);
                        console.log('headers:', res.headers);
                      })
                      reqq.on('error', (e) => {
                        console.error(e);
                      });
                      reqq.end();
                      return;
                    }
                    if(args[0].toLowerCase() == 'survivor') 
                    {
                      obtenervalorsurv(body, message.channel.id, message.author.id, message.guild.id, sid_2, usa)
                    }
                    if(args[0].toLowerCase() == 'killer') 
                    {
                      obtenervalorkill(body, message.channel.id, message.author.id, message.guild.id, sid_2, usa)
                    }
                })
              });
            }
            })
          })
      return;
     }

  if(command == 'nivel')
  {
    if(!texto) return message.member.send('Ingresa: **/nivel [Nivel Actual] [Nivel Deseado]** | Te dirá la cantidad de puntos de sangre necesaria para llegar a ese nivel.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
    if(parseInt(args[0]) >= parseInt(args[1])) return message.member.send('El nivel deseado no puede ser mayor o igual al que tenes.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
    if(parseInt(args[1]) >= 50 || parseInt(args[0])  < 1 || parseInt(args[0]) > 50) return message.member.send('El nivel iniciado debe ser entre 1 y 49, y el nivel deseado entre 1 y 50.').catch(function(err) { message.channel.send(message.member.user+' Activa tus mensajes privados para que el bot pueda informarte.') } );
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
             .addField('5⃣ Estadísticas.', 'Podrás ver las estadísticas que tengas en Dead By Daylight. (Sólo STEAM)')
             .setTimestamp()
             .setFooter('V0.5 - Beta Cerrada', client.user.avatarURL);
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
         }, 20000);
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

function obtenervalorkill(variable, canal, usuario, server, sid, usa)
{
  var serverr = client.guilds.get(server)
  var user = serverr.members.get(usuario)
  var bloodpoints_1 = variable.slice(variable.indexOf('bloodpoints')+14)
  var bloodpoints_2 = bloodpoints_1.slice(0, bloodpoints_1.indexOf(',')-1)
  if(bloodpoints_2.length < 1) return client.channels.get(canal).send('No estas registrado.')
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
  const embedd = new Discord.RichEmbed()
	.setColor('#FF0000')
  .setTitle('Estadisticas de Asesino de '+user.user.tag)
	.setAuthor(user.user.tag, user.user.avatarURL)
	.setThumbnail(user.user.avatarURL)
  .addField('<:bp:724724401333076071> Puntos de sangre totales:', Coma(bloodpoints_2))
	.addField('Rango:', killer_rank_2, true)
  .addField('Partidas perfectas:', killer_perfectgames_2,true)
  .addField('Asesinatos con Mori:', killed_2)
  .addField('Sacrificiaste a todos después del último generador:', killed_sacrificed_afterlastgen_2,true)
  .addField('Sacrificios en ganchos:', sacrificed_2,true)
  .addField('Ataques con motosierra (HillBilly):', chainsawhits_2, true)
  .addField('Atrapados en trampas (Trampero):', beartrapcatches_2, true)
  .addField('Hachas lanzadas:', hatchetsthrown_2, true)
  .addField('Surpervivientes interrumpidos en gens:', survivorsgrabbedrepairinggen_2, true)
  .addField('Supervivientes golpeados mientras cargas con otro:', survivorshitwhilecarrying_2, true)
  .addField('Trampillas cerradas:', hatchesclosed_2, true)
  .addField('Supervivientes interrumpidos en totems:', survivorsinterruptedcleansingtotem_2, true)
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
      con.query(`UPDATE EntityUsers SET bloodpoints_1 = ${bloodpoints_2}, survivor_rank_1 = ${survivor_rank_2}, survivor_perfectgames_1 = ${survivor_perfectgames_2}, equivgensrepaired_1 = ${equivgensrepaired_2}, equivsurvivorshealed_1 = ${equivsurvivorshealed_2}, equivsurvivorshealed_coop_1 = ${equivsurvivorshealed_coop_2}, skillchecks_1 = ${skillchecks_2}, escaped_1 = ${escaped_2}, escaped_ko_1 = ${escaped_ko_2}, escaped_hatch_1 = ${escaped_hatch_2}, protectionhits_1 = ${protectionhits_2}, exitgatesopened_1 = ${exitgatesopened_2}, unhookedself_1 = ${unhookedself_2}, mysteryboxesopened_1 = ${mysteryboxesopened_2}, killer_rank_1 = ${killer_rank_2}, killer_perfectgames_1 = ${killer_perfectgames_2}, killed_1 = ${killed_2}, killed_sacrificed_afterlastgen_1 = ${killed_sacrificed_afterlastgen_2}, sacrificed_1 = ${sacrificed_2}, chainsawhits_1 = ${chainsawhits_2}, beartrapcatches_1 = ${beartrapcatches_2}, hatchetsthrown_1 = ${hatchetsthrown_2}, survivorsgrabbedrepairinggen_1 = ${survivorsgrabbedrepairinggen_2}, survivorshitwhilecarrying_1 = ${survivorshitwhilecarrying_2}, hatchesclosed_1 = ${hatchesclosed_2}, survivorsinterruptedcleansingtotem_1 = ${survivorsinterruptedcleansingtotem_2}, update_at = ${usa} WHERE SID = '${sid}'`)
    } else
    {
      con.query(`INSERT INTO EntityUsers (SID, update_at, bloodpoints_1, survivor_rank_1, survivor_perfectgames_1, equivgensrepaired_1, equivsurvivorshealed_1, equivsurvivorshealed_coop_1, skillchecks_1, escaped_1, escaped_ko_1, escaped_hatch_1, protectionhits_1, exitgatesopened_1, unhookedself_1, mysteryboxesopened_1, killer_rank_1, killer_perfectgames_1, killed_1, killed_sacrificed_afterlastgen_1, sacrificed_1, chainsawhits_1, beartrapcatches_1, hatchetsthrown_1, survivorsgrabbedrepairinggen_1, survivorshitwhilecarrying_1, hatchesclosed_1, survivorsinterruptedcleansingtotem_1) VALUES ('${sid}', '${usa}', '${bloodpoints_2}', '${survivor_rank_2}', '${survivor_perfectgames_2}', '${equivgensrepaired_2}', '${equivsurvivorshealed_2}', '${equivsurvivorshealed_coop_2}', '${skillchecks_2}', '${escaped_2}', '${escaped_ko_2}', '${escaped_hatch_2}', '${protectionhits_2}', '${exitgatesopened_2}', '${unhookedself_2}', '${mysteryboxesopened_2}', '${killer_rank_2}', '${killer_perfectgames_2}', '${killed_2}', '${killed_sacrificed_afterlastgen_2}', '${sacrificed_2}', '${chainsawhits_2}', '${beartrapcatches_2}', '${hatchetsthrown_2}', '${survivorsgrabbedrepairinggen_2}', '${survivorshitwhilecarrying_2}', '${hatchesclosed_2}', '${survivorsinterruptedcleansingtotem_2}')`)
    }
  })
  return;
}

function obtenervalorsurv(variable, canal, usuario, server, sid, usa)
{
  console.log('activado')
  var serverr = client.guilds.get(server)
  var user = serverr.members.get(usuario)
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
  const embedd = new Discord.RichEmbed()
	.setColor('#FF0000')
  .setTitle('Estadisticas de Superviviente de '+user.user.tag)
	.setAuthor(user.user.tag, user.user.avatarURL)
	.setThumbnail(user.user.avatarURL)
  .addField('<:bp:724724401333076071> Puntos de sangre totales:', Coma(bloodpoints_2))
	.addField('Rango:', survivor_rank_2, true)
  .addField('Partidas perfectas:', survivor_perfectgames_2,true)
  .addField('Generadores reparados:', equivgensrepaired_2)
  .addField('Jugadores curados:', equivsurvivorshealed_2+'/'+equivsurvivorshealed_coop_2+' (Coop)',true)
  .addField('SkillChecks:', skillchecks_2,true)
  .addField('Total de Escapes:', escaped_2, true)
  .addField('Escapes arrastrándose:', escaped_ko_2, true)
  .addField('Escapes por trampilla:', escaped_hatch_2, true)
  .addField('Zafarse del gancho:', unhookedself_2, true)
  .addField('Hits de protección:', protectionhits_2, true)
  .addField('Puertas abiertas:', exitgatesopened_2, true)
  .addField('Cofres abiertos:', mysteryboxesopened_2, true)
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
      con.query(`UPDATE EntityUsers SET bloodpoints_1 = ${bloodpoints_2}, survivor_rank_1 = ${survivor_rank_2}, survivor_perfectgames_1 = ${survivor_perfectgames_2}, equivgensrepaired_1 = ${equivgensrepaired_2}, equivsurvivorshealed_1 = ${equivsurvivorshealed_2}, equivsurvivorshealed_coop_1 = ${equivsurvivorshealed_coop_2}, skillchecks_1 = ${skillchecks_2}, escaped_1 = ${escaped_2}, escaped_ko_1 = ${escaped_ko_2}, escaped_hatch_1 = ${escaped_hatch_2}, protectionhits_1 = ${protectionhits_2}, exitgatesopened_1 = ${exitgatesopened_2}, unhookedself_1 = ${unhookedself_2}, mysteryboxesopened_1 = ${mysteryboxesopened_2}, killer_rank_1 = ${killer_rank_2}, killer_perfectgames_1 = ${killer_perfectgames_2}, killed_1 = ${killed_2}, killed_sacrificed_afterlastgen_1 = ${killed_sacrificed_afterlastgen_2}, sacrificed_1 = ${sacrificed_2}, chainsawhits_1 = ${chainsawhits_2}, beartrapcatches_1 = ${beartrapcatches_2}, hatchetsthrown_1 = ${hatchetsthrown_2}, survivorsgrabbedrepairinggen_1 = ${survivorsgrabbedrepairinggen_2}, survivorshitwhilecarrying_1 = ${survivorshitwhilecarrying_2}, hatchesclosed_1 = ${hatchesclosed_2}, survivorsinterruptedcleansingtotem_1 = ${survivorsinterruptedcleansingtotem_2}, update_at = ${usa} WHERE SID = '${sid}'`)
    } else
    {
      con.query(`INSERT INTO EntityUsers (SID, update_at, bloodpoints_1, survivor_rank_1, survivor_perfectgames_1, equivgensrepaired_1, equivsurvivorshealed_1, equivsurvivorshealed_coop_1, skillchecks_1, escaped_1, escaped_ko_1, escaped_hatch_1, protectionhits_1, exitgatesopened_1, unhookedself_1, mysteryboxesopened_1, killer_rank_1, killer_perfectgames_1, killed_1, killed_sacrificed_afterlastgen_1, sacrificed_1, chainsawhits_1, beartrapcatches_1, hatchetsthrown_1, survivorsgrabbedrepairinggen_1, survivorshitwhilecarrying_1, hatchesclosed_1, survivorsinterruptedcleansingtotem_1) VALUES ('${sid}', '${usa}', '${bloodpoints_2}', '${survivor_rank_2}', '${survivor_perfectgames_2}', '${equivgensrepaired_2}', '${equivsurvivorshealed_2}', '${equivsurvivorshealed_coop_2}', '${skillchecks_2}', '${escaped_2}', '${escaped_ko_2}', '${escaped_hatch_2}', '${protectionhits_2}', '${exitgatesopened_2}', '${unhookedself_2}', '${mysteryboxesopened_2}', '${killer_rank_2}', '${killer_perfectgames_2}', '${killed_2}', '${killed_sacrificed_afterlastgen_2}', '${sacrificed_2}', '${chainsawhits_2}', '${beartrapcatches_2}', '${hatchetsthrown_2}', '${survivorsgrabbedrepairinggen_2}', '${survivorshitwhilecarrying_2}', '${hatchesclosed_2}', '${survivorsinterruptedcleansingtotem_2}')`)
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


function Coma(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

client.login('NzI0NzAyNzYwMzU1NzU4MjM1.XvECWQ.XhJKHaD9n2pXN2gFeR25PezJkps');
