
const path = require('path');
const fs = require('fs');
const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageTyping,
  ],
});

const prefix = '+';
client.commands = new Collection();

// 📁 Chemin absolu vers allowedGuilds.json (placé à la racine du projet)
const whitelistPath = path.join(__dirname, '..', 'allowedGuilds.json');

// 🛡️ Chargement de la whitelist des serveurs
let allowedGuilds = [];
try {
  allowedGuilds = JSON.parse(fs.readFileSync(whitelistPath, 'utf8'));
} catch (err) {
  console.warn('⚠️ Aucune whitelist trouvée. Création automatique.');
  fs.writeFileSync(whitelistPath, JSON.stringify([]));
}
client.allowedGuilds = allowedGuilds;

// 🛠️ ID du propriétaire (à remplacer par le tien)
const botOwnerId = '1308505582365442100';

// IDs des salons logs (à adapter)
const logChannels = {
  moderation: '1383610746948030504',
  voice: '1383610857384312922',
  roles: '1383610942591340635',
  messages: '1383611000000000000',
};

// Map pour snipes
client.snipes = new Map();

// 📂 Chargement dynamique des commandes depuis /src/commands
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.name, command);
  }
} else {
  console.warn('❌ Dossier de commandes introuvable :', commandsPath);
}

client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);

  client.user.setPresence({
    activities: [{
      name: '.gg/mooon / By maxihlel',
      type: ActivityType.Streaming,
      url: 'https://twitch.tv/ninja'
    }],
    status: 'online'
  });

  const systemChannelId = '1384502866659508276';
  const systemChannel = client.channels.cache.get(systemChannelId);
  if (systemChannel) {
    systemChannel.send('✅ Le bot a redémarré avec succès et est opérationnel.').catch(console.error);
  } else {
    console.warn('⚠️ Salon système introuvable.');
  }

  const restartChannel = client.channels.cache.get(logChannels.moderation);
  if (restartChannel) {
    restartChannel.send('✅ Le bot a bien redémarré.').catch(console.error);
  } else {
    console.warn('⚠️ Salon de logs modération introuvable.');
  }
});

// 🎯 Gestion des commandes avec whitelist
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  if (!message.guild) return; // Sécurité au cas où message DM

  console.log(`Commande reçue: ${message.content} de ${message.author.tag}`);
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.allowedGuilds.includes(message.guild.id)) {
    return message.reply('❌ Ce serveur n’est pas autorisé à utiliser ce bot.');
  }

  // 🔧 Commandes owner : addserver / removeserver
  if (message.author.id === botOwnerId) {
    if (commandName === 'addserver') {
      const guildId = args[0];
      if (!guildId) return message.reply('❌ Fournis un ID de serveur.');
      if (client.allowedGuilds.includes(guildId)) {
        return message.reply('✅ Ce serveur est déjà autorisé.');
      }
      client.allowedGuilds.push(guildId);
      fs.writeFileSync(whitelistPath, JSON.stringify(client.allowedGuilds, null, 2));
      return message.reply(`✅ Serveur \`${guildId}\` ajouté à la whitelist.`);
    }
    if (commandName === 'removeserver') {
      const guildId = args[0];
      if (!guildId) return message.reply('❌ Fournis un ID de serveur.');
      if (!client.allowedGuilds.includes(guildId)) {
        return message.reply('❌ Ce serveur n’est pas dans la whitelist.');
      }
      client.allowedGuilds = client.allowedGuilds.filter(id => id !== guildId);
      fs.writeFileSync(whitelistPath, JSON.stringify(client.allowedGuilds, null, 2));
      return message.reply(`✅ Serveur \`${guildId}\` supprimé de la whitelist.`);
    }
  }

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, client, logChannels);
  } catch (error) {
    console.error(error);
    message.reply('❌ Une erreur est survenue lors de l\'exécution de la commande.');
  }
});

client.login('MTM4MzUxMjY2ODIyODU1MDY2Ng.GpBTJP.GPBgqZkUddLCU-qodnO9RwWOXFpXOF6RCEdcuE');
