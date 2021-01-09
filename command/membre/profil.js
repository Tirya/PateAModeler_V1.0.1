const discord = require('discord.js')
module.exports = {
    name : 'profil',
    writing : '$profil (optionnel mention)',
    description : 'retourne la photo de profil de la mention',
    categorie : 'member',
    execute(message, args, client) {
        var target = {
            name: "",
            id: "",
            avatar: "",
            color: ""
        }
        var author = {
            name: message.author.username,
            avatar: message.author.avatarURL()
        }
        try{
            target.name = message.mentions.members.first().displayName
            target.id = message.mentions.members.first().id
            target.avatar = message.mentions.members.first().user.avatarURL(),
            target.color = message.mentions.members.first().displayColor
        }
        catch{
            target.name = message.author.username
            target.id = message.author.id
            target.avatar = message.author.avatarURL()
            target.color = message.member.displayColor
        }

        var result = {
            "embed": {
              "title": `**${target.name.toUpperCase()}**`,
              "url": target.avatar,
              "color": target.color,
              "footer": {
                "icon_url": author.avatar,
                "text": author.name
              },
              "thumbnail": {
                "url": target.avatar
              },
              "fields": [
                {
                  "name": "Id de l'utilisateur",
                  "value": target.id
                },
                {
                    "name": "URL de l'avatar",
                    "value": target.avatar
                }
              ]
            }
          }
        message.channel.send(result)
    }
}