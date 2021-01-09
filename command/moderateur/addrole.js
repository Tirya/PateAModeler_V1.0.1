const { MessageEmbed} = require('discord.js')
module.exports = {
    name: "addrole",
    writing : '$addrole [mention member] [mention role]',
    description : 'Ajout un role à un utilisateur',
    categorie : 'moderateur',
    execute(message, args, client) {
        if(!message.member.hasPermission('MANAGE_ROLES')) 
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
        if(!message.mentions.users.size && !message.mentions.everyone)
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
        if(!message.mentions.roles.size)
        {
            const NoMention = {
                "embed": {
                    "title": this.name.toUpperCase(),
                    "description": "La mention d'un rôle est requise !",
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

        if(message.mentions.everyone)
        {
            for(const mbr of message.guild.members.cache)
            {
                console.log(mbr)
                if(!mbr.manageable)
                {
                    const ResultEmbed = new MessageEmbed()
                    ResultEmbed.setTitle(this.name.toUpperCase())
                        .setDescription(`**${mbr[1].user.username}** a reçu les rôles`)
                        .setColor("#008000")
                    for(const role of message.mentions.roles)
                    {
                        ResultEmbed.addField(message.guild.roles.cache.get(role[0]).name, `ID : ${role[0]}`)
                        mbr[1].roles.add(role[0])
                    }
                    message.channel.send(ResultEmbed)
                }
                else{
                    const errEmbed = {
                        "embed": {
                            "title": this.name.toUpperCase(),
                            "description": `Je n'ai pas les permissions pour modifier les roles de **${mbr[1].user.username}**`,
                            "color": "#FF0000",
                            "footer": {
                                "icon_url": message.author.avatarURL(),
                                "text": message.author.username
                            }
                        }
                    }
                    message.channel.send(errEmbed)
                }
            }
            return
        }
        for(const mbr of message.mentions.members)
        {
            const errEmbed = {
                "embed": {
                    "title": this.name.toUpperCase(),
                    "description": `Je n'ai pas les permissions pour modifier les roles de **${mbr[1].user.username}**`,
                    "color": "#FF0000",
                    "footer": {
                        "icon_url": message.author.avatarURL(),
                        "text": message.author.username
                    }
                }
            }
            if(!mbr.manageable)
            {
                const ResultEmbed = new MessageEmbed()
                ResultEmbed.setTitle(this.name.toUpperCase())
                    .setDescription(`**${mbr[1].user.username}** a reçu les rôles`)
                    .setColor("#008000")
                    .setFooter(message.author.username, message.author.avatarURL())
                
                try{
                    for(const role of message.mentions.roles)
                    {
                        ResultEmbed.addField(message.guild.roles.cache.get(role[0]).name, `ID : ${role[0]}`)
                        mbr[1].roles.add(role[0])
                    }
                    message.channel.send(ResultEmbed)
                }
                catch{
                    message.channel.send(errEmbed)
                }
            }
            else{
                message.channel.send(errEmbed)
            }
        }
    }
}