const config = require('../config.json');

module.exports = {
  name: 'guildMemberAdd',
  once: false,
  async execute(member, client) {
    const channel = member.guild.channels.cache.get(config.welcomeChannel);
    if (!channel) return;

    try {
      const message = await channel.send(`<@${member.id}>`);
      setTimeout(() => {
        message.delete().catch(console.error);
      }, 4000); // Supprime après 4 secondes
    } catch (error) {
      console.error('Erreur lors de l\'envoi ou suppression du message :', error);
    }
  }
};