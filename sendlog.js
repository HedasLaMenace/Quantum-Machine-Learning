// sendLog.js
module.exports = async function sendLog(guild, embed, logType) {
  // Remplace ces IDs par ceux de tes salons de logs réels
  const logChannels = {
    moderation: '123456789012345678',  // ID salon modération
    voice: '234567890123456789',       // ID salon vocal
    roles: '345678901234567890',       // ID salon rôles
  };

  const channelId = logChannels[logType];
  if (!channelId) {
    console.warn(`sendLog: Aucun salon défini pour le type de log "${logType}".`);
    return;
  }

  let channel;
  try {
    channel = await guild.channels.fetch(channelId);
  } catch (error) {
    console.error(`sendLog: Impossible de récupérer le salon ${channelId} pour le type ${logType}:`, error);
    return;
  }

  if (!channel || !channel.isTextBased()) {
    console.warn(`sendLog: Le salon avec l'ID ${channelId} n'existe pas ou n'est pas un salon textuel.`);
    return;
  }

  try {
    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error(`Erreur lors de l'envoi du log (${logType}) dans le salon ${channelId} :`, error);
  }
};
