const discord = require('discord.js')
const config = require('../../config.json')
const fs = require('fs')
const { newgame } = require('../../function')
module.exports = {
    name: "addgame",
    writing : '$addGame [jeu]',
    description : 'Rajoute un jeu dans le serveur !',
    categorie : 'moderateur',
    async execute(message, args, client) {
        if(!message.member.hasPermission('ADMINISTRATOR')) {
            const NoPerms = {
                "embed": {
                    "title": this.name.toUpperCase(),
                    "description": "Tu n'as pas les permissions d'exécuter cette commande !",
                    "color": `#FFA500`,
                    "footer": {
                        "text": message.author.username,
                        "icon_url":  message.author.avatarURL()
                    }
                }
            }
            message.channel.send(NoPerms)
            return
        }
        if(!args[0]) {
            const NoGame = {
                "embed": {
                    "title": this.name.toUpperCase(),
                    "description": "Un nom de jeu",
                    "color": `#FFA500`,
                    "fields" : [
                        {
                            "name": "Ecriture",
                            "value": `\`\`${this.writing}\`\``
                        }
                    ],
                    "footer": {
                        "text": message.author.username,
                        "icon_url":  message.author.avatarURL()
                    }
                }
            }
            message.channel.send(NoGame)
            return
        }
        const jeu = args.slice(0).join(" ")

        const jeu_Role = await message.guild.roles.create({
            data : {
                name : jeu,
            }
        })
        const jeu_TextChannel = await message.guild.channels.create(jeu, {
            parent : config.categorie.game,
            type : 'text',
            permissionOverwrites : [
                {
                    id : jeu_Role.id,
                    allow : ['VIEW_CHANNEL', 'CONNECT', 'SPEAK',]
                },
                {
                    id : config.role.modo,
                    allow : ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES', 'MENTION_EVERYONE']
                },
                {
                    id: config.role.everyone,
                    deny : ['VIEW_CHANNEL']
                }
            ]
        })
        const jeu_VoiceChannel1 = await message.guild.channels.create(`${jeu} • α`, {
            parent : config.categorie.game,
            type : 'voice',
            permissionOverwrites : [
                {
                    id : jeu_Role.id,
                    allow : ['VIEW_CHANNEL','SEND_MESSAGES']
                },
                {
                    id : config.role.modo,
                    allow : ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES', 'MENTION_EVERYONE']
                },
                {
                    id: config.role.everyone,
                    deny : ['VIEW_CHANNEL']
                }
            ]
        })
        const jeu_VoiceChannel2 = await message.guild.channels.create(`${jeu} • β`, {
            parent : config.categorie.game,
            type : 'voice',
            permissionOverwrites : [
                {
                    id : jeu_Role.id,
                    allow : ['VIEW_CHANNEL','SEND_MESSAGES']
                },
                {
                    id : config.role.modo,
                    allow : ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES', 'MENTION_EVERYONE']
                },
                {
                    id: config.role.everyone,
                    deny : ['VIEW_CHANNEL']
                }
            ]
        })

        let Jeu_File = {
            name : args.slice(0).join("-"),
            path : `./game/${args.slice(0).join("-")}.js`,

            content : `module.exports = {
                name: "${jeu}",
                role: "${jeu_Role.id}"
            }`,
            roleId : jeu_Role.id
        }
        
        const boolGame = newgame(Jeu_File, client)

        if(!boolGame)
        { 
            const ErrorEmbed =  {
                "embed": {
                    "title": this.name.toUpperCase(),
                    "description": `Le jeu *${jeu}* existe déjà !`,
                    "color": `#FF0000`,
                    "footer": {
                        "text": message.author.username,
                        "icon_url":  message.author.avatarURL()
                    }
                }
            
            }
            await jeu_Role.delete()
            await jeu_TextChannel.delete()
            await jeu_VoiceChannel1.delete()
            await jeu_VoiceChannel2.delete()

            message.channel.send(ErrorEmbed)

        }
        else {
            const resultEmbed =  {
                "embed": {
                    "title": this.name.toUpperCase(),
                    "description": `Les salons et les roles du jeu *${jeu}* ont été créé`,
                    "color": `#008000`,
                    "fields": [
                        {
                            "name" : `Role`,
                            "value" : jeu_Role
                        },
                        {
                            "name" : `Salon textuel`,
                            "value" : jeu_TextChannel
                        },
                        {
                            "name" : `Salon vocal **α**`,
                            "value" : jeu_VoiceChannel1
                        },
                        {
                            "name" : `Salon vocal **β**`,
                            "value" : jeu_VoiceChannel2
                        }
                    ],
                    "footer": {
                        "text": message.author.username,
                        "icon_url":  message.author.avatarURL()
                    }
                }
            }

            message.channel.send(resultEmbed)
        }
    }
}