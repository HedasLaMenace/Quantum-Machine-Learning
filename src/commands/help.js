const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Affiche la liste des commandes par catégories avec navigation par boutons.',
  async execute(message) {
    const moderationEmbed = new EmbedBuilder()
      .setTitle('📜 Commandes de modération')
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
        { name: '+snipe', value: 'Affiche le dernier message supprimé dans ce salon.' },
        { name: '+banlist', value: 'Affiche la liste des membres bannis du serveur avec leur nom et ID.' }
      )
      .setFooter({ text: 'Bot de modération par maxihlel, inutilisable sans serveurs whitelistés' })
      .setTimestamp();

    const gestionEmbed = new EmbedBuilder()
      .setTitle('🛠️ Commandes de gestion')
      .setColor('#00cc99')
      .setDescription('Commandes pour gérer les salons et les permissions.')
      .addFields(
        { name: '+lock', value: 'Verrouille le salon actuel (empêche d\'envoyer des messages).' },
        { name: '+unlock', value: 'Déverrouille le salon actuel.' }
      )
      .setFooter({ text: 'Gestion des permissions des salons et autres outils' })
      .setTimestamp();

    const ownerEmbed = new EmbedBuilder()
      .setTitle('🔒 Commandes réservées à l\'owner')
      .setColor('#ff0000')
      .setDescription('Voici les commandes uniquement accessibles à l\'owner du bot :')
      .addFields(
        { name: '+addserver ID_serveur', value: 'Ajoute un serveur à la whitelist.' },
        { name: '+removeserver ID_serveur', value: 'Retire un serveur de la whitelist.' },
        { name: '+restart', value: 'Redémarre le bot. Commande réservée à l\'owner.' }
      )
      .setFooter({ text: 'Seul le propriétaire du bot peut utiliser ces commandes.' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('modération')
        .setLabel('Modération')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('gestion')
        .setLabel('Gestion')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('owner')
        .setLabel('Owner')
        .setStyle(ButtonStyle.Danger)
    );

    const helpMessage = await message.channel.send({ embeds: [moderationEmbed], components: [row] });

    const filter = i => ['modération', 'gestion', 'owner'].includes(i.customId) && i.user.id === message.author.id;

    const collector = helpMessage.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      if (i.customId === 'modération') {
        await i.update({ embeds: [moderationEmbed], components: [row] });
      } else if (i.customId === 'gestion') {
        await i.update({ embeds: [gestionEmbed], components: [row] });
      } else if (i.customId === 'owner') {
        await i.update({ embeds: [ownerEmbed], components: [row] });
      }
    });

    collector.on('end', () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        row.components.map(btn => btn.setDisabled(true))
      );
      helpMessage.edit({ components: [disabledRow] }).catch(() => null);
    });
  },
};
