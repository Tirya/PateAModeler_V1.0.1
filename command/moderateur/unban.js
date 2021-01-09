module.exports = {
    name: "unban",
    writing : '$unban [membre]',
    description : "Retire le bannissement d'un membre",
    categorie : 'moderateur',
    async execute(message, args, bot) {
        if(!message.member.hasPermission('BAN_MEMBERS')) {
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
        let search = args[0];
        if(!search) {

            const NoMention = {
                "embed": {
                    "title": this.name.toUpperCase(),
                    "description": "Le nom d'un membre est requise !",
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

        try {
            let bans = await message.guild.fetchBans();
            let banned = bans.get(search) || bans.find(u => {
                if(u.user.username.toLowerCase().includes(search.toLowerCase()))
                {
                    return u
                }
            });

            if(!banned) {
                const NoSearch = {
                    "embed": {
                        "title": this.name.toUpperCase(),
                        "description": `Je n'ai pas trouvé l'utilisateur *${search}* dans les personnes bannies !`,
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
                message.channel.send(NoSearch)
                return
            }   

            const Result = {
                "embed": {
                    "title": this.name.toUpperCase(),
                    "description": `***${search.toUpperCase()}*** a été débanni !!`,
                    "color": `#008000 `,
                    "footer": {
                        "text": message.author.username,
                        "icon_url":  message.author.avatarURL()
                    }
                }
            }
            await message.guild.members.unban(banned.user.id);

            message.channel.send(Result)
        } catch(e) {
            throw e
        }
    }
}