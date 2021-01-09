const fonction = require('../../function')
const config = require('../../config.json')
const { measureMemory } = require('vm')
const mode = ['solo', 'duo', 'trio', 'squad']
module.exports = {
    name: "tournoi",
    writing : '$tournoi [game] [mode(solo / duo / squad)]',
    description : 'Fais une annonce de tournoi',
    categorie : 'moderateur',
    async execute(message, args, client) {
        if(!message.member._roles.includes(config.role.MODOtournois))
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

        const game = client.games.get(args[0]) || client.games.find(g => {
            if(g.name.toLowerCase().includes(args[0].toLowerCase()))
            {
                return g
            }
        })
        if(!game)
        {
            const NoSearch = {
                "embed": {
                    "title" : this.name.toUpperCase(),
                    "description" : `Je n'ai pas trouvé le jeu : *${args[0]}* dans les jeux disponnibles !`,
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

        if(!args[1]) args[1] = 'solo'
        if(!mode.includes(args[1].toLowerCase()))
        {
            const NoGame = {
                "embed": {
                  "title": this.name.toUpperCase(),
                  "description": `Le mode ***${args[1]}*** n'est pas disponible`,
                  "color": "#FFA500",
                  "footer": {
                    "icon_url": message.author.avatarURL(),
                    "text": message.author.username
                  },
                  "fields": {
                      "name" : "Modes",
                      "value" : `*${mode.slice(0).join(', ')}*`
                  }
                }
            }
            message.channel.send(NoGame)
            return
        }

        let msgInscr
        if(args[1].toLowerCase() == mode[0])
        {
            msgInscr = "```Pseudo : [pseudo]```"
        }
        else if(args[1].toLowerCase() == mode[1])
        {
            msgInscr = "```Team : [nom team]\nJoueur 1 : [Pseudo joueur 1]\nJoueur 2 : [Pseudo joueur 2]```"
        }
        else if(args[1].toLowerCase() == mode[2])
        {
            msgInscr = "```Team : [nom team]\nJoueur 1 : [Pseudo joueur 1]\nJoueur 2 : [Pseudo joueur 2]\nJoueur 3 : [Pseudo joueur 3]```"
        }
        else if(args[1].toLowerCase() == mode[3])
        {
            msgInscr = "```Team : [nom team]\nJoueur 1 : [Pseudo joueur 1]\nJoueur 2 : [Pseudo joueur 2]\nJoueur 3 : [Pseudo joueur 3]\nJoueur 4 : [Pseudo joueur 4]```"
        }
        



        let date = fonction.NextFriday();
        let tmp = new Date(fonction.NextFriday());
        date.setHours(18, 0, 0)

        
        const Annonce = {
            "content": "@everyone",
            "embed": {
              "title": "TournoiRomega",
              "url": "http://google.com",
              "description": "Nouveau tournoi ce ***VENDREDI***\n**----------------------------------------------------------**",
              "color": (Math.random()*0xFFFFFF<<0).toString(16),
              "timestamp": tmp,
              "thumbnail": {
                "url": message.guild.iconURL()
              },
              "footer" :
              {
                  "text": 'Date du tournoi '
              },
              "fields": [
                {
                  "name": "Jeu",
                  "value": game.name,
                  "inline": true
                },
                {
                  "name": "Mode",
                  "value": args[1],
                  "inline": true
                },
                {
                  "name": "Heure",
                  "value": "18h",
                  "inline": true
                },
                {
                  "name": "----------------------------------------------------------\n*Inscription*",
                  "value": `Envoyez un message dans ce channel avec ${msgInscr}`
                },
                {
                  "name": "----------------------------------------------------------\n__Info__",
                  "value": "Nous préférons que vous vous inscriviez 10 min avant les tournois et que vous soyez là, plutôt que vous vous inscrivez à l'avance et que vous ne soyez pas disponible!!",
                  "inline": true
                }
              ]
            }
        }

        const EmbedValidation = {
            "embed": {
              "title": this.name.toUpperCase(),
              "description": "J'envoie le sondage ?",
              "color": (Math.random()*0xFFFFFF<<0).toString(16),
              "footer": {
                "icon_url": message.author.avatarURL(),
                "text": message.author.username
              },
              "fields": [
                {
                  "name": "✅",
                  "value": `Envoyer dans le salon ${message.guild.channels.cache.get(config.channel.annonce.default)}`,
                  "inline": true
                },
                {
                  "name": "❌",
                  "value": "Annuler",
                  "inline": true
                },
                {
                  "name": "TEMPS",
                  "value": "20sec"
                }
              ]
            }
        }
        await message.channel.send(Annonce)
        const msgValidation = await message.channel.send(EmbedValidation)
        msgValidation.react('✅')
        msgValidation.react('❌')

        message.channel.startTyping()

        const filter = (reaction, user) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id
        
        msgValidation.awaitReactions(filter, {max : 1, time: 20000})
            .then(collected  => {
                const react = collected.first()
                switch(react.emoji.name) {
                    case '✅':
                        const embedEnvoyer = {
                            "embed": {
                                "title": this.name.toUpperCase(),
                                "description": "Annonce envoyer !",
                                "color": "#00FF00",
                                "footer": {
                                    "icon_url": message.author.avatarURL(),
                                    "text": message.author.username
                                }
                            }
                        }
                        message.guild.channels.cache.get(config.channel.annonce.default).send(Annonce)
                        message.channel.send(embedEnvoyer)
                        message.channel.stopTyping()
                    break
                    case '❌':
                        const embedAnnulation = {
                            "embed": {
                                "title": this.name.toUpperCase(),
                                "description": "Annulation du tournoi !",
                                "color": "#FF0000",
                                "footer": {
                                    "icon_url": message.author.avatarURL(),
                                    "text": message.author.username
                                }
                            }
                        }
                        message.channel.send(embedAnnulation)
                        message.channel.stopTyping()
                    break
                }
            })
            .catch(collected => {
                const embedAnnulation = {
                    "embed": {
                    "title": this.name.toUpperCase(),
                    "description": "Annulation du tournoi !",
                    "color": "#FF0000",
                    "footer": {
                        "icon_url": message.author.avatarURL(),
                        "text": message.author.username
                    }
                    }
                }
                message.channel.send(embedAnnulation)
                message.channel.stopTyping()
                return
                })


        

    }
}