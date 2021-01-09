module.exports = {
    name : 'error',
    writing : '$error',
    description : 'Fais une erreur',
    categorie : 'member',
    execute(message, args, client) {
        throw `erreur volontaire => ${args.slice(0).join(" ")}`
    }
}