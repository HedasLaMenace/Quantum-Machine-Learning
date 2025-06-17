const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'invite',
  description: 'Affiche le lien d\'invitation du bot',

  execute(message, args, client) {
    const clientId = client.user.id;
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`;

    const embed = new EmbedBuilder()
      .setTitle(' Invitation du bot.')
      .setDescription(`[Clique ici pour inviter le bot sur ton serveur](${inviteLink})`)
      .setColor(0x5865F2)
      .setFooter({ text: 'Merci d’utiliser notre bot !' })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  }
};
