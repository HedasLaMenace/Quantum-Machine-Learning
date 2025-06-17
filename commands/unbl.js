const { EmbedBuilder } = require('discord.js');
const sendLog = require('../sendLog'); // Ton fichier sendLog.js doit exister

module.exports = {
  name: 'unbl',
  description: 'Débannir un membre par ID',
  async execute(message, args) {
    const id = args[0];
    if (!id) {
      return message.reply("❌ Merci de fournir l'ID du membre à débannir.");
    }

    try {
      // Récupérer la liste des bans pour vérifier que l'ID est bien bannie
      const bans = await message.guild.bans.fetch();
      const bannedUser = bans.get(id);
      if (!bannedUser) {
        return message.reply("❌ Cet utilisateur n'est pas banni.");
      }

      // Débannir
      await message.guild.members.unban(id);

      await message.channel.send(`✅ Membre avec l'ID ${id} a été débanni.`);

      const embed = new EmbedBuilder()
        .setTitle('✅ Débannissement')
        .setColor('Green')
        .addFields(
          { name: 'Modérateur', value: `${message.author.tag} (${message.author.id})` },
          { name: 'ID membre', value: id },
          { name: 'Date', value: new Date().toLocaleString('fr-FR') },
        );

      await sendLog(message.guild, embed, 'moderation');

    } catch (error) {
      console.error(error);
      await message.channel.send("❌ Impossible de débannir ce membre.");
    }
  }
};
