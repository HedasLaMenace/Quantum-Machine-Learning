module.exports = {
  name: 'restart',
  description: 'Redémarre le bot (owner seulement)',
  async execute(message) {
    const ownerId = '1308505582365442100';
    if (message.author.id !== ownerId) {
      return message.reply("❌ Seul le propriétaire du bot peut exécuter cette commande.");
    }

    await message.reply('♻️ Redémarrage du bot en cours...');

    // Simule un redémarrage (utile avec PM2 ou un système externe)
    process.exit(0);
  }
};
