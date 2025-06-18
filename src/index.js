const path = require('path');
const fs = require('fs');
const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
require('dotenv').config();

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
const ownerId = '1308505582365442100';
const whitelistPath = path.join(__dirname, 'allowedGuilds.json');

// Chargement de la whitelist
let allowedGuilds = [];
try {
  allowedGuilds = JSON.parse(fs.readFileSync(whitelistPath, 'utf8'));
} catch {
  console.warn('⚠️ Aucune whitelist trouvée. Création automatique.');
  fs.writeFileSync(whitelistPath, JSON.stringify([]));
}

client.allowedGuilds = allowedGuilds;

// Chargement dynamique des commandes
client.commands = new Collection();
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

  // Envoi message dans salons système / logs si besoin (ajoute ici si nécessaire)
});

// Gestion des commandes
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (!message.guild) return; // ignore DM

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Commande addserver accessible partout MAIS que par owner
  if (commandName === 'addserver') {
    if (message.author.id !== ownerId) {
      return message.reply('❌ Tu n\'as pas la permission d\'utiliser cette commande.');
    }
    const guildId = args[0];
    if (!guildId) return message.reply('❌ Fournis un ID de serveur.');
    if (client.allowedGuilds.includes(guildId)) {
      return message.reply('✅ Ce serveur est déjà autorisé.');
    }
    client.allowedGuilds.push(guildId);
    fs.writeFileSync(whitelistPath, JSON.stringify(client.allowedGuilds, null, 2));
    return message.reply(`✅ Serveur \`${guildId}\` ajouté à la whitelist.`);
  }

  // Commande removeserver accessible que par owner
  if (commandName === 'removeserver') {
    if (message.author.id !== ownerId) {
      return message.reply('❌ Tu n\'as pas la permission d\'utiliser cette commande.');
    }
    const guildId = args[0];
    if (!guildId) return message.reply('❌ Fournis un ID de serveur.');
    if (!client.allowedGuilds.includes(guildId)) {
      return message.reply('❌ Ce serveur n’est pas dans la whitelist.');
    }
    client.allowedGuilds = client.allowedGuilds.filter(id => id !== guildId);
    fs.writeFileSync(whitelistPath, JSON.stringify(client.allowedGuilds, null, 2));
    return message.reply(`✅ Serveur \`${guildId}\` supprimé de la whitelist.`);
  }

  // Vérification whitelist avant les autres commandes
  if (!client.allowedGuilds.includes(message.guild.id)) {
    return message.reply('❌ Ce serveur n’est pas autorisé à utiliser ce bot.');
  }

  // Exécution des autres commandes
  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply('❌ Une erreur est survenue lors de l\'exécution de la commande.');
  }
});

client.login(process.env.BOT_TOKEN);