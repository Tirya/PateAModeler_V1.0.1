const Discord = require('discord.js');
const config = require('../../config.json');
module.exports = {
    name : 'help',
    writing : '$help (optionnel catergorie)',
    description : 'Renvoie le profil du utilisateur mentionné',
    categorie : 'member',
    execute(message, args, client) {
        if(!args[0]) {
            const result = new Discord.MessageEmbed()
            result.setTitle(this.name.toUpperCase())
            result.setDescription(`Un argument est requis`)
            result.setColor((Math.random()*0xFFFFFF<<0).toString(16))
            for(const cat of client.HelpEmbed)
            {   
                result.addField(cat[1].name, `\`\`${config.prefix}${this.name} ${cat[1].name}\`\``, true)
            }
            return message.channel.send(result)
        }
        for(var title of args)
        {
            title = title.toLowerCase()
            if(client.HelpEmbed.get(title))
            {
                message.channel.send(client.HelpEmbed.get(title).embed)
            }
            else
            {
                const result = new Discord.MessageEmbed()
                result.setTitle(this.name.toUpperCase())
                result.setDescription(`Je n'ai pas réussi à trouver la catégorie *${title}*`)
                result.setColor((Math.random()*0xFFFFFF<<0).toString(16))
                result.setFooter(message.author.username, message.author.avatarURL())
                for(const cat of client.HelpEmbed)
                {
                    result.addField(cat[1].name, `\`\`${config.prefix}${this.name} ${cat[1].name}\`\``, true)
                }
                message.channel.send(result)
            }
        }
    }
}