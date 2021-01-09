module.exports = {
    name: "kick",
    writing : '$kick [membre] (option raison)',
    description : 'Kick un membre du serveur',
    categorie : 'moderateur',
    async execute(message, args, client) {
        if(!message.member.hasPermission('KICK_MEMBERS')) 
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
        var target = message.mentions.members.first()
        if(!target.kickable){
            const NoBannable = {
                "embed": {
                    "title": this.name.toUpperCase(),
                    "description": "Je ne peux pas kick ce membre !",
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
        var raison = "Inconnue"
        if(args[1]) 
        {
            raison = args.slice(1).join(" ")
        } 
        const Result = {
            "embed": {
                "title": this.name.toUpperCase(),
                "description": `***${target.displayName.toUpperCase()}*** a été kick !!`,
                "color": `#008000`,
                "fields" : [
                    {
                        "name": "**Raison :**",
                        "value": `${raison}`
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
                    "title": `Tu as été kick du serveur\`${message.guild.name}\``,
                    "description": `**Raison:** ${reason}`,
                    "color": `#FF0000`,
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
        await target.kick({
            reason: `${message.author.username} => ${raison}`
        })

        message.channel.send(Result)
    }
}