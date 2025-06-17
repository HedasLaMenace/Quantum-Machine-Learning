const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = '+';
const ownerId = '1308505582365442100';

client.on('messageCreate', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'leave') {
    if (message.author.id !== ownerId) {
      return message.reply("Tu n'es pas autorisé à utiliser cette commande.");
    }

    const guildId = args[0];
    if (!guildId) return message.reply("Tu dois fournir un ID de serveur.");

    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      return message.reply("Je ne suis pas dans ce serveur, ou l'ID est invalide.");
    }

    try {
      await guild.leave();
      message.reply(`**J'ai quitté le serveur** : **${guild.name}**`);
    } catch (err) {
      console.error(err);
      message.reply("Erreur lors de la tentative de quitter le serveur.");
    }
  }
});

client.login('MTM4MzUxMjY2ODIyODU1MDY2Ng.GgO0h4.QGXZyBuSnjkYxP8XqEsifqxhLOwZRlZUzeojhg');
