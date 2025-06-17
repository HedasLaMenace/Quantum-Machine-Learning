const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'blserver',
  description: 'Retire un serveur de la whitelist (owner only)',

  async execute(message, args) {
    const ownerId = '1308505582365442100'; // Remplace par ton ID Discord
    if (message.author.id !== ownerId) {
      return message.reply('❌ Tu n\'as pas la permission d\'utiliser cette commande.');
    }

    const guildIdToRemove = args[0];
    if (!guildIdToRemove || isNaN(guildIdToRemove)) {
      return message.reply('❌ Spécifie un ID de serveur valide.');
    }

    const filePath = path.join(__dirname, '..', 'allowedGuilds.json');
    const guilds = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const index = guilds.indexOf(guildIdToRemove);
    if (index === -1) {
      return message.reply('ℹ️ Ce serveur n\'est pas dans la whitelist.');
    }

    guilds.splice(index, 1);
    fs.writeFileSync(filePath, JSON.stringify(guilds, null, 2));
    message.reply(`✅ Serveur **${guildIdToRemove}** retiré de la whitelist.`);
  }
};
