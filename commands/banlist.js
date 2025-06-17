const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'banlist',
  description: 'Affiche la liste des membres bannis du serveur.',
  async execute(message) {
    // Vérifier si le message vient d'un serveur
    if (!message.guild) {
      return message.reply('❌ Cette commande doit être utilisée dans un serveur.');
    }

    // Vérifier les permissions de l'utilisateur (gérer les bans)
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('❌ Tu n\'as pas la permission de voir la liste des bans.');
    }

    try {
      // Récupérer la liste des bans
      const bans = await message.guild.bans.fetch();

      if (bans.size === 0) {
        return message.reply('📭 Aucun membre n\'est banni sur ce serveur.');
      }

      // Construire la description de l'embed avec la liste des bans
      const description = bans.map(ban => `**${ban.user.tag}** (ID: \`${ban.user.id}\`)`).join('\n');

      const embed = new EmbedBuilder()
        .setTitle(`📋 Liste des membres bannis (${bans.size})`)
        .setDescription(description)
        .setColor('#ff0000')
        .setTimestamp()
        .setFooter({ text: `Demandé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Erreur lors de la récupération des bans :', error);
      message.reply('❌ Une erreur est survenue lors de la récupération des bans.');
    }
  },
};
