
module.exports = {
    name : 'tempban',
    writing : '$tempban [membre] [time] (option raison)',
    description : 'Ban temporairement un membre du serveur',
    categorie : 'moderateur',
    async execute(message, args, client) {
        if(!message.member.hasPermission('BAN_MEMBERS')) 
        {
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
        if(!message.mentions.users.size)
        {
            const NoMention = {
                "embed": {
                    "title": this.name.toUpperCase(),
                    "description": "La mention d'un membre est requise !",
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
            message.channel.send(NoMention)
            return
        }
        if(!Number.isInteger(args[1])) 
        {
            const NoTime = {
                "embed": {
                    "title": this.name.toUpperCase(),
                    "description": "Un temps de banissement est requis !",
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
            message.channel.send(NoTime)
            return
        }
        var target = message.mentions.members.first()
        if(!target.bannable){
            const NoBannable = {
                "embed": {
                    "title": this.name.toUpperCase(),
                    "description": "Je ne peux pas bannir ce membre !",
                    "color": `#FFA500`,
                    "footer": {
                        "text": message.author.username,
                        "icon_url":  message.author.avatarURL()
                    }
                }
            }
            message.channel.send(NoBannable)
            return
        }
        var time = args[1]
        var raison = "Inconnue"
        if(args[2]) 
        {
            raison = args.slice(2).join(" ")
        } 
        const Result = {
            "embed": {
                "title": this.name.toUpperCase(),
                "description": `***${target.displayName.toUpperCase()}*** a été banni !!`,
                "color": `#008000 `,
                "fields" : [
                    {
                        "name": "**Raison :**",
                        "value": `${raison}`
                    },
                    {
                        "name": "**Temps :**",
                        "value": `${time} jours !`
                    }
                ],
                "footer": {
                    "text": message.author.username,
                    "icon_url":  message.author.avatarURL()
                }
            }
        }
        try{
            const DM = {
                "embed": {
                    "title": `Tu as été banni du serveur ***${message.guild.name}***`,
                    "color": `#FF0000`,
                    "fields" : [
                        {
                            "name": "**Raison :**",
                            "value": `${raison}`
                        },
                        {
                            "name": "**Temps :**",
                            "value": `${time} jours !`
                        }
                    ],
                }
            }
            await target.send(DM);
        } catch(e) { 
            const NoDM = {
                "embed": {
                    "title": this.name.toUpperCase(),
                    "description": "Je n'ai pas réussi à DM cette utilisateur !",
                    "color": `#FFA500`,
                    "footer": {
                        "text": message.author.username,
                        "icon_url":  message.author.avatarURL()
                    }
                }
            }
            message.channel.send(NoDM);
        }


        await target.ban({
            day: time,
            reason: `${message.author.username} => ${raison}`
        })

        message.channel.send(Result)
    }
}