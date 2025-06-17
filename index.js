const { Client, GatewayIntentBits, Collection, ActivityType, EmbedBuilder } = require('discord.js');
const fs = require('fs');

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

// 🛡️ Chargement de la whitelist des serveurs
let allowedGuilds = [];
try {
  allowedGuilds = JSON.parse(fs.readFileSync('./allowedGuilds.json', 'utf8'));
} catch (err) {
  console.warn('⚠️ Aucune whitelist trouvée. Création automatique.');
  fs.writeFileSync('./allowedGuilds.json', JSON.stringify([]));
}
client.allowedGuilds = allowedGuilds;

// 🛠️ Ton ID pour bloquer certaines commandes aux owners seulement
const botOwnerId = '1308505582365442100'; // 🔁 À remplacer !

// IDs des salons logs (à adapter)
const logChannels = {
  moderation: '1383610746948030504',
  voice: '1383610857384312922',
  roles: '1383610942591340635',
  messages: '1383611000000000000',
};

const snipes = new Map();
client.snipes = snipes;

// Charger toutes les commandes
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
  
  client.user.setPresence({
    activities: [{
      name: '.gg/mooon / NicoWilliamsLeGoat',
      type: ActivityType.Streaming,
      url: 'https://twitch.tv/ninja'
    }],
    status: 'online'
  });

  const systemChannelId = '1384502866659508276';
  const systemChannel = client.channels.cache.get(systemChannelId);
  if (systemChannel) {
    systemChannel.send('✅ Le bot a redémarré avec succès et est opérationnel.')
      .catch(console.error);
  } else {
    console.warn('⚠️ Salon système introuvable pour l\'annonce de redémarrage.');
  }
});

client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);

  client.user.setPresence({
    activities: [{
      name: '.gg/mooon / NicoWilliamsLeGoat',
      type: ActivityType.Streaming,
      url: 'https://twitch.tv/ninja'
    }],
    status: 'online'
  });

  // Annonce dans le salon système fixe
  const systemChannelId = '1384502866659508276';
  const systemChannel = client.channels.cache.get(systemChannelId);
  if (systemChannel) {
    systemChannel.send('✅ Le bot a redémarré avec succès et est opérationnel.')
      .catch(console.error);
  } else {
    console.warn('⚠️ Salon système introuvable pour l\'annonce de redémarrage.');
  }

  // Annonce dans le salon modération (logChannels)
  const restartChannel = client.channels.cache.get(logChannels.moderation);
  if (restartChannel) {
    restartChannel.send(`✅ Le bot a bien redémarré et est prêt à l'emploi.`)
      .catch(console.error);
  } else {
    console.warn('⚠️ Salon de logs de modération introuvable pour le redémarrage.');
  }
});

// ------------- EVENTS ---------------
// ... [ tes events inchangés ici - messageDelete, guildMemberUpdate etc. ]

// 🎯 Gestion des commandes avec vérif de la whitelist
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // 🔐 Vérif whitelist
  if (!client.allowedGuilds.includes(message.guild.id)) {
    return message.reply('❌ Ce serveur n’est pas autorisé à utiliser ce bot.');
  }

  // 🔧 Commande interne pour gérer la whitelist (owner seulement)
  if (message.author.id === botOwnerId) {
    if (commandName === 'addserver') {
      const guildId = args[0];
      if (!guildId) return message.reply('❌ Fournis un ID de serveur.');
      if (client.allowedGuilds.includes(guildId)) {
        return message.reply('✅ Ce serveur est déjà autorisé.');
      }
      client.allowedGuilds.push(guildId);
      fs.writeFileSync('./allowedGuilds.json', JSON.stringify(client.allowedGuilds, null, 2));
      return message.reply(`✅ Serveur \`${guildId}\` ajouté à la whitelist.`);
    }

    if (commandName === 'removeserver') {
      const guildId = args[0];
      if (!guildId) return message.reply('❌ Fournis un ID de serveur.');
      if (!client.allowedGuilds.includes(guildId)) {
        return message.reply('❌ Ce serveur n’est pas dans la whitelist.');
      }
      client.allowedGuilds = client.allowedGuilds.filter(id => id !== guildId);
      fs.writeFileSync('./allowedGuilds.json', JSON.stringify(client.allowedGuilds, null, 2));
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

client.login('MTM4MzUxMjY2ODIyODU1MDY2Ng.GgO0h4.QGXZyBuSnjkYxP8XqEsifqxhLOwZRlZUzeojhg');