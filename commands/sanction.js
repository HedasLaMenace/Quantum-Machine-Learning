const path = require('path');
const fs = require('fs');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'sanction',
  description: 'Afficher l’historique des sanctions d’un membre',
  async execute(message, args, { client }) {
    // Récupérer le membre mentionné ou par ID
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
      return message.channel.send('Mentionnez un membre ou indiquez son ID.');
    }

    // Chemin vers le fichier sanctions.json (remonte d’un dossier si commands est un sous-dossier)
    const sanctionsFile = path.join(__dirname, '..', 'sanctions.json');

    let data = {};
    try {
      if (fs.existsSync(sanctionsFile)) {
        data = JSON.parse(fs.readFileSync(sanctionsFile, 'utf8'));
      }
    } catch (e) {
      console.error('Erreur lecture sanctions.json:', e);
    }

    const sanctions = data[member.id];
    if (!sanctions || sanctions.length === 0) {
      return message.channel.send(`Aucune sanction trouvée pour ${member.user.tag}.`);
    }

    // Construction de l'embed avec les sanctions
    const embed = new EmbedBuilder()
      .setTitle(`📋 Sanctions de ${member.user.tag}`)
      .setColor('Yellow')
      .setDescription(
        sanctions
          .map(
            (s, i) =>
              `**${i + 1}.** ${s.type.toUpperCase()} - ${s.reason} (${new Date(s.date).toLocaleString()})`
          )
          .join('\n')
      )
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  },
};
