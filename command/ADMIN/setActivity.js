const { MessageEmbed } = require('discord.js')
const Types = [ 'PLAYING', 'STREAMING', 'LISTENING', 'WATCHING', 'CUSTOM_STATUS', 'COMPETING' ]
module.exports = {
    name: "setactivity",
    writing : '$setactivity [type] [game]',
    description : "Définie l'activité du bot",
    categorie : 'admin',
    async execute(message, args, client) {
        if(message.author.id != '624900890469466132'){
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
        if(!args[0] || !args[1]) {
            const NoArgs = {
                "embed": {
                    "title": this.name.toUpperCase(),
                    "description": "Des arguments me sont requis !",
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
            message.channel.send(NoArgs)
            return 
        }
        if(!Types.includes(args[0].toUpperCase())) {
            const NoType = new MessageEmbed()
            NoType
                .setTitle(this.name.toUpperCase())
                .setDescription("Des arguments valides me sont requis")
                .setColor("#FFA500")
                .setFooter(message.author.username, message.author.avatarURL())
            for(const type of Types)
            {
                NoType.addField(type, `\`\`$${this.name} ${type} [game]\`\``)
            }

            message.channel.send(NoType)
            return
        }
        const game = args.slice(1).join(" ")
        await client.user.setActivity(game, { type: args[0].toUpperCase() })
        const result = {
            "embed": {
                "title": this.name.toUpperCase(),
                "description": `Le status du bot a été mise à jour`,
                "color": '#008000' ,
                "fields":[
                    {
                        "name": "Type",
                        "value": `\`\`${args[0].toUpperCase()}\`\``,
                        "inline": true,
                    },
                    {
                        "name": "Activité",
                        "value": `\`\`${game}\`\``,
                        "inline": true,
                    }
                ],
                "footer": {
                    "icon_url": message.author.avatarURL(),
                    "text": message.author.username
                 }
            }
        }
        message.channel.send(result)
    }
}