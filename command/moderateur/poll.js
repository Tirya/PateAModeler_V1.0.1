const { MessageEmbed } = require('discord.js');
const { PassThrough } = require('stream');
const config = require('../../config.json');
const emoji = require('../../EmojiReaction');
module.exports = {
    name: "poll",
    writing : '$poll "[description]"[possibilité 1]"[possibilité 2]"[...(max 10)]',
    description : 'Fait un sondage dans le salon annonce !',
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
        const pollArgs = args.join(' ')
        const pollPos = pollArgs.split('"')
        const pollDescr = pollPos.shift()

        if(!pollDescr || !pollPos[1]) {
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
        message.channel.startTyping()


        if(pollPos.length < 2)
        {
            const min2 = {
                "embed": {
                  "title":  this.name.toUpperCase(),
                  "description": "Le nombre min de possibilité est de 2 !",
                  "color": `#FFA500`,
                  "fields" : [
                      {
                          "name": "Ecriture",
                          "value": `\`\`${this.writing}\`\``
                      },
                      {
                          "name": "Actuel",
                          "value": pollPos.length
                      }
                  ],
                  "footer": {
                    "text": message.author.username,
                    "icon_url":  message.author.avatarURL()
                  }
                }
              }
              message.channel.send(min2)
              return 
        }
        if(pollPos.length > 10)
        {
            const more10 = {
                "embed": {
                  "title":  this.name.toUpperCase(),
                  "description": "Le nombre max de possibilité est de 10 !",
                  "color": `#FFA500`,
                  "fields" : [
                      {
                          "name": "Ecriture",
                          "value": `\`\`${this.writing}\`\``
                      },
                      {
                          "name": "Actuel",
                          "value": pollPos.length
                      }
                  ],
                  "footer": {
                    "text": message.author.username,
                    "icon_url":  message.author.avatarURL()
                  }
                }
              }
              message.channel.send(more10)
              return 
        }

        var result = new MessageEmbed();
        result
            .setTitle('SONDAGE')
            .setDescription(pollDescr)
            .setColor((Math.random()*0xFFFFFF<<0).toString(16))
            .setThumbnail(message.guild.iconURL())
            .setAuthor(message.member.displayName, message.author.avatarURL())
        var idx = 1
        for(const possib of pollPos)
        {
            result.addField(emoji.get(idx), possib)
            idx++
        }
        const msgPolltmp = await message.channel.send(result)
        for(i = 1; i < idx; i++)
        {
            await msgPolltmp.react(emoji.get(i))
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
                  "value": `Envoyer dans le salon ${message.guild.channels.cache.get(config.channel.annonce.default)}\n en multi vote\t`,
                  "inline": true
                },
                {
                  "name": "✔",
                  "value": `Envoyer dans le salon ${message.guild.channels.cache.get(config.channel.annonce.default)}\n en unique vote\t`,
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
        const msgValidation = await message.channel.send(EmbedValidation)
        msgValidation.react('✅')
        msgValidation.react('✔')
        msgValidation.react('❌')

        const embedEnvoyer = {
            "embed": {
              "title": this.name.toUpperCase(),
              "description": "Sondage envoyer !",
              "color": (Math.random()*0xFFFFFF<<0).toString(16),
              "footer": {
                "icon_url": message.author.avatarURL(),
                "text": message.author.username
              }
            }
          }
        var multi = true
        const filter = (reaction, user) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌' || reaction.emoji.name === '✔') && user.id === message.author.id
        msgValidation.awaitReactions(filter, {max : 1, time: 20000})
            .then(collected  => {
                const react = collected.first()
                switch(react.emoji.name) {
                    case '✅':
                        multi = true
                        send()
                        message.channel.send(embedEnvoyer)
                    break
                    case '✔':
                        multi = false
                        send()
                        message.channel.send(embedEnvoyer)
                    break
                    case '❌':
                        const embedAnnulation = {
                            "embed": {
                              "title": this.name.toUpperCase(),
                              "description": "Annulation du sondage !",
                              "color": (Math.random()*0xFFFFFF<<0).toString(16),
                              "footer": {
                                "icon_url": message.author.avatarURL(),
                                "text": message.author.username
                              }
                            }
                          }
                        message.channel.send(embedAnnulation)
                        message.channel.stopTyping()
                        return
                    break
                }
            })
            .catch(collected => {
                const embedAnnulation = {
                    "embed": {
                      "title": this.name.toUpperCase(),
                      "description": "Annulation du sondage !",
                      "color": (Math.random()*0xFFFFFF<<0).toString(16),
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
        async function send()
        {
          const pollEmbed = {
              "content": "@everyone",
              "embed": result.toJSON()
          }
          const msgPoll = await message.guild.channels.cache.get(config.channel.annonce.default).send(pollEmbed)
          for(i = 1; i < idx; i++)
          {
              msgPoll.react(emoji.get(i))
          }
          message.channel.stopTyping()

          client.on('messageReactionAdd', (msg, user) => {
            if(msg.message.guild.me.id == user.id) return
            if(msg.message.id != msgPoll.id) return
            if(multi) return
            const userReactions = msg.message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
            try {
                for (const reaction of userReactions.values()) {
                    if(msg.emoji.name != reaction.emoji.name)
                    {
                      reaction.users.remove(user.id);
                    }
                }
            } catch (error) {
                console.error('Erreur lors du la supression des reaction');
            }
          })
        }
    }
}