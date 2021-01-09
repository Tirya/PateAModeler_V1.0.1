const fonction = require('../../function')
module.exports = {
    name: "changemsg",
    writing : '$changemsg',
    description : "change le contenue d'un message",
    categorie : 'admin',
    execute(message, args, client) {
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
        
        let tmp = new Date(fonction.NextFriday());
        
        let msgInscr
        msgInscr = "```Pseudo : [pseudo]```"

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
                  "value": "Brawlhalla",
                  "inline": true
                },
                {
                  "name": "Mode",
                  "value": "Solo",
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

        message.guild.channels.cache.get('790201456175087647').messages.fetch('796417090382069830').then(msg => msg.edit(Annonce))

    }
}