const grec = require('../../grec')
const config = require('../../config.json')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "addgamechannel",
    writing : '$addGameChannel [nombre de channel] [game]',
    description : 'Rajoute un salon pour le jeu specifié',
    categorie : 'moderateur',
    async execute(message, args, client) {
        if(!message.member.hasPermission('MANAGE_CHANNELS')) {
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
        if(!args[0] || !args[1]){
            const NoArgs = new MessageEmbed()
            NoArgs
                .setTitle(this.name.toUpperCase())
                .setDescription("Des argument me sont requis")
                .setColor("#FFA500")
                .setFooter(message.author.username, message.author.avatarURL())
            for(const game of client.games)
            {
                NoArgs.addField(game[1].name, `\`\`$${this.name} ${game[1].name}\`\``)
            }

            message.channel.send(NoArgs)
            return
        }

        const role = client.games.get(args[1]) || client.games.find(g => {
            if(g.name.toLowerCase().includes(args[1].toLowerCase()))
            {
                return g
            }
        })
        if(!role)
        {
            const NoSearch = new MessageEmbed()
            NoSearch
                .setTitle(this.name.toUpperCase())
                .setDescription(`Je n'ai pas trouvé le jeu ${args[1]}`)
                .setColor("#FFA500")
                .setFooter(message.author.username, message.author.avatarURL())
            for(const game of client.games)
            {
                NoSearch.addField(game[1].name, `\`\`$${this.name} [nombre de channel] ${game[1].name}\`\``)
            }

            message.channel.send(NoSearch)
            return
        }
        if(Number.isInteger(args[0]))
        {
            const NoNbr = {
                "embed": {
                    "title" : this.name.toUpperCase(),
                    "description" : `Un nombre entier m'est requis !`,
                    "color": "#FFA500",
                    "footer": {
                        "icon_url": message.author.avatarURL(),
                        "text": message.author.username
                    },
                    "fields" : [
                        {
                            "name": "Ecriture",
                            "value": `\`\`${this.writing}\`\``
                        }
                    ],
                }
            }
            message.channel.send(NoNbr)
            return
        }
        var idx = 0
        var lastChan = null
        for(chan of message.guild.channels.cache)
        {
            if(chan[1].type == 'voice' && chan[1].name.includes(role.name))
            {
                if(lastChan == null) lastChan = chan[1]
                if(chan[1].position > lastChan.position) lastChan = chan[1]
                idx++
            }
        }
        if(lastChan == null)
        {
            lastChan = {"position": -1}
        }
        for(var i = 1; i <= parseInt(args[0]) ; i++ )
        {
            const NewChannel = await message.guild.channels.create(`${role.name} • ${grec.get(i+idx)}`, {
                parent : config.categorie.game,
                type : 'voice',
                permissionOverwrites : [
                    {
                        id : role.role,
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
            await NewChannel.setPosition(lastChan.position + i)
            const EmbedCreate = {
                "embed": {
                    "title": this.name.toUpperCase(),
                    "description": `Salon __${NewChannel.name}__ créer`,
                    "color": '#008000' ,
                    "footer": {
                        "icon_url": message.author.avatarURL(),
                        "text": message.author.username
                     }
                }
            }
            await message.channel.send(EmbedCreate)
            console.log("\x1b[32m", `NEW channel => ${NewChannel.name}`,"\x1b[0m")
        }
    }
}