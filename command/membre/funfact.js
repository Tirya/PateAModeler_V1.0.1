const https = require('https');
module.exports = {
    name: "funfact",
    writing : '$funfact',
    description : 'Renvoie un fun fact random (en anglais)',
    categorie : 'membre',
    async execute(message, args, client) {
        await https.request('https://uselessfacts.jsph.pl/random.json?language=en', (response) => {
            let data = []
            response.on('data', (chunk) => {
                data += chunk
            })

            response.on('end', () => {
                const result = {
                    "embed": {
                        "title": this.name.toUpperCase(),
                        "description": data,
                        "color": (Math.random()*0xFFFFFF<<0).toString(16),
                        "footer": {
                            "icon_url": message.author.avatarURL(),
                            "text": message.author.username
                        }
                    }
                }
                message.channel.send(result)
                console.log(data)
            })

        }).on('error', (err) => {
            console.error(err)
        })
    }
}