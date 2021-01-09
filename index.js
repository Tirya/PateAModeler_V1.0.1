//#region Bibliotheque
const Discord = require('discord.js');
const fs = require('fs');
const https = require('https')

const Emoji = require('./emoji')
const config = require('./config.json');
const ExtFunction = require('./function');
//#endregion

//#region Client Collection
const client = new Discord.Client();

client.pool = new Discord.Collection();
client.commands = new Discord.Collection();
client.games = new Discord.Collection();
client.HelpEmbed = new Discord.Collection();
client.team = new Discord.Collection();
//#endregion


//#region Variable
var verif_code = ExtFunction.RandomCode()
//#endregion 

//#region Command
const typeCommandFile = fs.readdirSync(`./command/`)

for(const type of typeCommandFile){
    console.log('\x1b[30m','\x1b[47m', type, "\x1b[0m")
    try{
        const commandFiles = fs.readdirSync(`./command/${type}/`).filter(file => file.endsWith('.js'))

        const tmp = new Discord.MessageEmbed();
        tmp.setTitle(type)
        tmp.setColor((Math.random()*0xFFFFFF<<0).toString(16))

        for(const file of commandFiles){
            const command = require(`./command/${type}/${file}`)

            client.commands.set(command.name, command);
            tmp.addField(`\`\`${command.writing}\`\``, command.description);

            console.log("\x1b[32m", `=> Commande ${command.name} est chargé !`, "\x1b[0m");
        }
        client.HelpEmbed.set(type, {
            name : type,
            embed : tmp})
    }
    catch(e){
        console.log("\x1b[41m", "\x1b[37m", `${type} n'est pas un dossier !`, "\x1b[0m")
        console.error(e)
    }
}
//#endregion

//#region Game
const gamefiles = fs.readdirSync(`./game/`)
console.log('\x1b[30m', '\x1b[47m', `jeu`, "\x1b[0m")
for(const gamefile of gamefiles)
{
    const game = require(`./game/${gamefile}`)
    client.games.set(game.name, game);
    console.log("\x1b[32m", `=> Jeu ${game.name} est chargé !`, "\x1b[0m");
}
//#endregion

//#region Discord Events
client.once('ready', () => {
    console.log("\x1b[1m", "\x1b[36m" ,`${new Date}`, "\x1b[0m")
    console.log("\x1b[34m", `I'm ready !`, "\x1b[0m");

})

client.on('message', message => {
    if(message.author.bot) return;
    if(message.channel.id == config.channel.config.authentification)
    {
        message.channel.bulkDelete(5);
        ExtFunction.authentif(message, verif_code);
        verif_code = ExtFunction.RandomCode();
        var VerifEmbed = new Discord.MessageEmbed()
            .setTitle('AUTHENTIFICATION')
            .setDescription(`Si tu es là c'est parce que tu veux accéder aux autres salons. \nJe te rassure c'est tout simple... Enfin sauf si tu sais pas taper sur un clavier.\nBref...`)
            .addField(`Il te faut juste écrire dans ce salon le code : `, verif_code);
        client.channels.cache.get(config.channel.config.authentification).send(VerifEmbed);
        return;
    }
    if(!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).split(/ +/)
    const command = args.shift().toLowerCase()

    if(!client.commands.has(command)) {
        const NoCommand = {
            "embed": {
              "title": command.toUpperCase(),
              "description": "Commande inexistante",
              "color": (Math.random()*0xFFFFFF<<0).toString(16),
              "footer": {
                "icon_url": message.author.avatarURL(),
                "text": message.author.username
              }
            }
        }
        message.channel.send(NoCommand)
        return
    }

    try{
        client.commands.get(command).execute(message, args, client)
        console.warn(`La commande : '${command}' a été utilisé par ${message.author.username}\n avec les argument : "${args.slice(0).join(" ")}"`);
    }catch(error)
    {
        console.log("\x1b[41m", `ERREUR lors de l'execution de la commande : `, "\x1b[4m", command, "\x1b[0m");
        console.log("\x1b[45m", `Date : ${new Date}`, "\x1b[0m")
        console.error(error)
        const errEmbed = {
            "embed": {
              "title": "ERROR",
              "description": "Une erreur s'est produite pendant l'exécution de la commande !",
              "color": `#FF0000`,
              "author": {
                "name": `${client.user.username}`,
                "icon_url": `${client.user.avatarURL()}`
              },
            }
          }
        message.channel.send(errEmbed)
    }


})

client.on('guildMemberAdd', member => {
    if(member.guild.id != config.guild) return ;
    console.log(`>>> ${member.displayName} est arrivé dans le serveur !`)
    member.roles.add(config.role.verif);
    const NewMember = {
        "embed": {
          "title": `Bienvenue ${member.displayName}!`,
          "description" : `Salut, bienvenue sur le serveur **${member.guild.name}** :tada::hugging: !\nJe vais aussi te donner une super info(c'est faux).... tu es le ${member.guild.memberCount} membres :joy:  !!`,
          "color": (Math.random()*0xFFFFFF<<0).toString(16),
          "footer": {
            "icon_url": member.user.avatarURL(),
            "text": member.displayName
          },
          "thumbnail": {
            "url": member.guild.iconURL()
          }
        }
      }
    client.channels.cache.get(config.channel.config.accueil).send(NewMember)
})

client.on('guildMemberRemove', member => {
  if(member.guild.id != config.guild) return ;
  console.log(`>>> ${member.displayName} a quitté le serveur !`)
})

client.on('emojiCreate', emot => {
  if(emot.guild.id != config.guild) return ;
  const EmojiDiscord = `https://cdn.discordapp.com/emojis/${emot.id}.png?`
  const NewEmot = {
    "content": "@everyone",
    "embed": {
      "title": "NOUVELLE EMOT !",
      "description": "Une nouvelle emot est disponnible dans le serveur !",
      "url": EmojiDiscord,
      "color": (Math.random()*0xFFFFFF<<0).toString(16),
      "thumbnail": {
        "url": EmojiDiscord
      },
      "author": {
        "name": emot.guild.name,
        "icon_url": emot.guild.iconURL()
      },
      "footer": {
        "text": emot.name,
        "icon_url": EmojiDiscord
      }
    }
  }
  emot.guild.channels.cache.get(config.channel.annonce.default).send(NewEmot)
})

client.on('guildCreate', async guild => {
  if(!config.AgreeInvite) return console.log(`Nouveau serveur autoriser : ${guild.name}`);
  const channel = await guild.channels.create(`ERROR ${guild.me.displayName}`)
  const invite = await channel.createInvite()
  const ErrorInvite = {
    "content": "@everyone",
    "embed": {
      "title": "INVITATION",
      "description": "Tu n'as pas le droit de m'inviter dans un serveur privé !",
      "color": (Math.random()*0xFFFFFF<<0).toString(16),
      "footer": {
        "icon_url": client.users.cache.get('624900890469466132').avatarURL(),
        "text": client.users.cache.get('624900890469466132').username
      },
      "thumbnail": {
        "url": guild.me.user.avatarURL()
      },
      "author": {
        "name": guild.me.nickname,
        "url": "https://discord.gg/9rqZbwC",
        "icon_url": guild.me.user.avatarURL()
      },
      "fields": [
        {
          "name": "INFO",
          "value": "Une invitation a été envoyé au modérateur !"
        }
      ]
    }
  }
  const ModoMsg = {
    "embed": {
      "title": "INVITATION",
      "description": `Le serveur ${guild.name} m'a invité !`,
      "color": 14326586,
      "footer": {
        "icon_url": client.user.avatarURL(),
        "text": client.user.username
      },
      "thumbnail": {
        "url": guild.iconURL()
      },
      "author": {
        "name": guild.name,
        "icon_url": guild.iconURL()
      },
      "fields" : [
        {
          "name" : "Invitation",
          "value": invite.url
        }
      ]
    }
  }
  await client.users.cache.get('624900890469466132').send(ModoMsg)
  await channel.send(ErrorInvite)
  guild.leave();
})


//#endregion

//#region Discord Login
client.login(process.env.TOKEN);
//#endregion


