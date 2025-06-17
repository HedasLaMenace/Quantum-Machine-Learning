const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Affiche la liste des commandes de modération.',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setTitle('📜 Commandes du bot')
      .setColor('#0099ff')
      .setDescription('Voici la liste des commandes de modération et leur rôle requis :')
      .addFields(
        { name: '+bl @membre [raison]', value: 'Bannir un membre. Rôle requis : `Perm Ban` ou `Prestige`' },
        { name: '+unbl ID_membre', value: 'Débannir un membre par son ID. Rôle requis : `Perm Ban` ou `Prestige`' },
        { name: '+kick @membre [raison]', value: 'Expulser un membre. Rôle requis : `Perm Kick` ou `Prestige`' },
        { name: '+to @membre durée_en_minutes', value: 'Mettre un membre en prison (timeout). Rôle requis : `Perm Prison` ou `Prestige`' },
        { name: '+unto @membre', value: 'Enlever le rôle prison d\'un membre. Rôle requis : `Perm Prison` ou `Prestige`' },
        { name: '+clear nombre', value: 'Supprime un nombre donné de messages. Permission : gérer les messages.' },
        { name: '+logsconfig', value: 'Affiche la configuration des logs. Accessible aux admins et rôle Prestige.' },
        { name: '+sanction @membre', value: 'Affiche l’historique des sanctions d’un membre.' },
        { name: '+addrole @membre @role', value: 'Ajoute un rôle à la personne mentionnée ou via réponse.' },
        { name: '+snipe', value: 'Affiche le dernier message supprimé dans ce salon. (Embed bleu, message en gras)' }
      )
      .setFooter({ text: 'Bot de modération par maxihlel, inutilisable sans serveurs whitelistés' })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};

