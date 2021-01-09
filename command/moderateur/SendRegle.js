const { channel } = require('../../config.json')
module.exports = {
    name: "sendrule",
    writing : '$sendrule',
    description : 'Envoie le règlement dans le salon !',
    categorie : 'moderateur',
    async execute(message, args, client) {
        if(!message.member.hasPermission('ADMINISTRATOR')) {
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
        const regle = {
            "embed":{
              "title": "RÈGLEMENT",
              "description": "En rejoignant le Discord, vous acceptez le règlement ci-dessous. Il est du devoir de chacun de se tenir informé des modifications apportées à ce règlement.",
              "color": (Math.random()*0xFFFFFF<<0).toString(16),
              "thumbnail": {
                "url": "https://cdn.discordapp.com/attachments/668209234483216429/670961547446714379/98048017-d4ac-42dc-960e-59ae4e73c2ef-profile_image-70x70.jpeg"
              },
              "author": {
                "name": "Tirya",
                "icon_url": "https://cdn.discordapp.com/avatars/624900890469466132/256c78d58e3b7400b373823ffb0955c7.png?size=1024"
              },
              "footer": {
                "text": "Les Modérateurs auront toujours le dernier mot.",
                "icon_url": "https://www.fcg.bzh/wp-content/uploads/2019/11/attention-hi.png"
              },
              "image": {
                "url": "https://cdn.discordapp.com/attachments/668209234483216429/670957137412882432/eb1ba48c-1e3c-41b1-acaa-08bbe7bd23b9-profile_banner-480.jpeg"
              },
              "fields": [
                {
                  "name": "Règle 1",
                  "value": "**``->``** Pas de NSFW, de racisme, de sexisme, de harcèlement."
                },
                {
                  "name": "Règle 2",
                  "value": "**``->``** Évitez de spam, quel que soit le channel."
                },
                {
                  "name": "Règle 3",
                  "value": "**``->``** Publicité interdite, pour quoi que ce soit."
                },
                {
                  "name": "Règle 4",
                  "value": "**``->``** Pas de liens vers des sites douteux/inconnus."
                },
                {
                  "name": "Règle 5",
                  "value": "**``->``** Ayez un pseudo facile à mentionner."
                }
              ]
            }
          }
          await message.guild.channels.cache.get(channel.config.regle).send(regle)

          if(args[0] == "true")
          {
            message.channel.send(regle)
          }
          const result = {
            "embed":{
              "title": this.name.toUpperCase(),
              "description": "Commande éffectuer avec succée !",
              "color": "#008000",
              "footer": {
                  "text": message.author.username,
                  "icon_url":  message.author.avatarURL()
              }
            }
          }
          message.channel.send(result)
    }
}