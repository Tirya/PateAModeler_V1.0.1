const { testImage } = require("../../function")

module.exports = {
    name: "setavatar",
    writing : "$setavatar [lien d'image]",
    description : "Définie la PP du bot",
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
        if(!args[0]) {
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
            return message.channel.send(NoArgs)
        }
        const NoImg = {
            "embed": {
                "title": this.name.toUpperCase(),
                "description": "Un lien valide me sont requis !",
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
        if(!testImage(args[0]))
        {
            return message.channel.send(NoImg)
        } 
        try{
            await client.user.setAvatar(args[0])
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
        }catch
        {
            return message.channel.send(NoImg)
        }
    }
}