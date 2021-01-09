const { youtube } = require("../../config.json")
module.exports = {
    name: "youtube",
    writing : '$youtube',
    description : 'Retourne la chaine Youtube du trou du cul !',
    categorie : 'membre',
    execute(message, args, client) {        
        const result = {
        "embed": {
            "title": this.name.toUpperCase(),
            "url": youtube.url,
            "description": "Voici le lien de ma chaine youtube",
            "color": "#c4302b",
            "footer": {
              "icon_url": message.author.avatarURL(),
              "text": message.author.name
            },
            "thumbnail": {
                "url": youtube.avatar   
            },
            "author": {
                "name": youtube.name,
                "icon_url": youtube.avatar,
                "url": youtube.url
            }
        }
    }
    message.channel.send(result)
    }
}