const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'listwl',
  description: 'Affiche tous les serveurs autorisés (whitelist)',

  async execute(message) {
    const filePath = path.join(__dirname, '..', 'allowedGuilds.json');
    const guilds = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const embed = new EmbedBuilder()
      .setTitle('📋 Liste des serveurs whitelistés')
      .setColor('#00ffcc')
      .setDescription(guilds.length > 0 ? guilds.map(id => `• \`${id}\``).join('\n') : 'Aucun serveur whitelisté.')
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  }
};
