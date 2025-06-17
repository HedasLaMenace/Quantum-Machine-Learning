const fs = require('fs');
const path = './data/logsConfig.json';

let logsConfig = {};
if (fs.existsSync(path)) {
  logsConfig = JSON.parse(fs.readFileSync(path, 'utf-8'));
}

function getServerLogsConfig(guildId) {
  return logsConfig[guildId];
}

function setServerLogChannel(guildId, type, channelId) {
  if (!logsConfig[guildId]) logsConfig[guildId] = {};
  logsConfig[guildId][type] = channelId;
  fs.writeFileSync(path, JSON.stringify(logsConfig, null, 2));
}

module.exports = {
  getServerLogsConfig,
  setServerLogChannel,
};
