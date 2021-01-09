const config = require('../../function')
module.exports = {
    name: "tmp",
    writing : '$tmp',
    description : 'description',
    categorie : 'categorie',
    execute(message, args, client) {
        console.log(config.NextFriday())
        message.channel.send('')
    }
}