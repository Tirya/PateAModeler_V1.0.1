const { MessageEmbed } = require("discord.js")
module.exports = {
    name: "game",
    writing : '$game [game]',
    description : 'Rajoute le rôle du jeu demander',
    categorie : 'membre',
    execute(message, args, client) {
        if(!args[0]){
            const NoArgs = new MessageEmbed()
            NoArgs
                .setTitle(this.name.toUpperCase())
                .setDescription("Un jeu est requis !")
                .setColor("#FFA500")
                .setFooter(message.author.username, message.author.avatarURL())
            for(const game of client.games)
            {
                NoArgs.addField(game[1].name, `\`\`$${this.name} ${game[1].name}\`\``)
            }

            message.channel.send(NoArgs)
            return
        }
        for(const arg of args)
        {
            const role = client.games.get(arg) || client.games.find(g => {
                if(g.name.toLowerCase().includes(arg.toLowerCase()))
                {
                    return g
                }
            })
            if(!role)
            {
                const NoSearch = {
                    "embed": {
                        "title" : this.name.toUpperCase(),
                        "description" : `Je n'ai pas trouvé le jeu : *${arg}* dans les jeux disponnibles !`,
                        "color": "#FFA500",
                        "footer": {
                            "icon_url": message.author.avatarURL(),
                            "text": message.author.username
                        }
                    }
                }
                message.channel.send(NoSearch)
                return
            }
            message.member.roles.add(role.role);
            const result = {
                "embed": {
                    "title" : this.name.toUpperCase(),
                    "description" : `Le rôle ${role.name} vous a été ajouté !`,
                    "color": "#008000",
                    "footer": {
                        "icon_url": message.author.avatarURL(),
                        "text": message.author.username
                    }
                }
            }
            message.channel.send(result)
        }
    }
}