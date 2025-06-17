const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'addserver',
  description: 'Ajoute un serveur à la whitelist (owner only)',

  async execute(message, args) {
    const ownerId = '1308505582365442100'; // Remplace par ton ID Discord
    if (message.author.id !== ownerId) {
      return message.reply('❌ Tu n\'as pas la permission d\'utiliser cette commande.');
    }

    const guildIdToAdd = args[0];
    if (!guildIdToAdd || isNaN(guildIdToAdd)) {
      return message.reply('❌ Spécifie un ID de serveur valide.');
    }

    const filePath = path.join(__dirname, '..', 'allowedGuilds.json');
    const guilds = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (guilds.includes(guildIdToAdd)) {
      return message.reply('ℹ️ Ce serveur est déjà dans la whitelist.');
    }

    guilds.push(guildIdToAdd);
    fs.writeFileSync(filePath, JSON.stringify(guilds, null, 2));
    message.reply(`✅ Serveur **${guildIdToAdd}** ajouté à la whitelist.`);
  }
};
