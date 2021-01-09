const { twitch } = require("../../config.json")
module.exports = {
    name: "twitch",
    writing : '$twitch',
    description : 'Retourne la chaine Twitch du trou du cul !',
    categorie : 'membre',
    execute(message, args, client) {
        const result = {
            "embed": {
                "title": this.name.toUpperCase(),
                "url": twitch.url,
                "description": "Voici le lien de ma chaine twitch",
                "color": "#6441A5",
                "footer": {
                  "icon_url": message.author.avatarURL(),
                  "text": message.author.name
                },
                "thumbnail": {
                "url": twitch.avatar,
                },
                "author": {
                    "name": twitch.name,
                    "icon_url": twitch.avatar,
                    "url": twitch.url
                }
            }
        }
        message.channel.send(result)
    }
}