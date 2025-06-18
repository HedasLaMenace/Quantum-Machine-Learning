const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'snipe',
  description: 'Affiche le dernier message supprimé dans ce salon',
  async execute(message) {
    // Vérifie si la collection snipes existe sur le client
    if (!message.client.snipes || !message.client.snipes.has(message.channel.id)) {
      return message.channel.send("❌ Aucun message supprimé à snipper ici.").catch(() => {});
    }

    const snipe = message.client.snipes.get(message.channel.id);

    if (!snipe) {
      return message.channel.send("❌ Aucun message supprimé à snipper ici.").catch(() => {});
    }

    const embed = new EmbedBuilder()
      .setColor('#3498db')
      .setDescription(snipe.content?.length > 0 ? snipe.content : '*[Message vide]*')
      .setAuthor({ name: snipe.author.tag, iconURL: snipe.author.displayAvatarURL?.() })
      .setFooter({ text: 'Message supprimé' })
      .setTimestamp(snipe.timestamp || Date.now());

    try {
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Erreur lors de l’envoi du snipe :', error);
    }
  },
};
