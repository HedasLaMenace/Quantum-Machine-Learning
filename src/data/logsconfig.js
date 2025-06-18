const fs = require('fs');
const path = './data/logsConfig.json';  // fichier JSON où tu stockes les configs

let logsConfig = {};
if (fs.existsSync(path)) {
  try {
    logsConfig = JSON.parse(fs.readFileSync(path, 'utf-8'));
  } catch (err) {
    console.error('Erreur lors de la lecture de logsConfig.json:', err);
  }
}

// Récupérer la config logs pour un serveur donné (guildId)
function getServerLogsConfig(guildId) {
  return logsConfig[guildId] || null;
}

// Mettre à jour le channel de logs pour un type donné sur un serveur
function setServerLogChannel(guildId, type, channelId) {
  if (!logsConfig[guildId]) logsConfig[guildId] = {};
  logsConfig[guildId][type] = channelId;

  try {
    fs.writeFileSync(path, JSON.stringify(logsConfig, null, 2));
  } catch (err) {
    console.error('Erreur lors de l\'écriture de logsConfig.json:', err);
  }
}

module.exports = {
  getServerLogsConfig,
  setServerLogChannel,
};
