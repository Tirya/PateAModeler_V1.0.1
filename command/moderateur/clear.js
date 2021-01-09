module.exports = {
    name : 'clear',
    writing : '$clear [nombre de message]',
    description : 'Supprime un nombre de messages du salon',
    categorie : 'moderateur',
    async execute(message, args, client) {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) {
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
        
        message.delete()
        var nbrmessage = 100
        if(Number.isInteger(args[0]) && args[0] <= 100 && args[0] > 0) nbrmessage = args[0]

        const msgToDelete = nbrmessage
            ? `**${nbrmessage} messages** créer dans les 14 derniers jours ont été supprimés.`
            : `**100 messages** créer dans les 14 derniers jours ont été supprimés (par default).`
        const result = {
            "embed": {
                "title": this.name.toUpperCase(),
                "description": msgToDelete,
                "color": `#FFA500`,
                "footer": {
                    "text": message.author.username,
                    "icon_url":  message.author.avatarURL()
                }
            }
        }
        message.channel.bulkDelete(nbrmessage)
            .then (function(){
                
                message.channel.send(result)
            })        
    }
}