const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'bl',
  description: 'Bannir un membre du serveur',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply('❌ Tu n’as pas la permission de bannir des membres.');
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply('❌ Mentionne un membre à bannir.');

    const reason = args.slice(1).join(' ') || 'Aucune raison spécifiée';

    try {
      await member.send(`🚫 Tu as été banni du serveur **${message.guild.name}**.\nRaison : ${reason}`).catch(() => {});
      await member.ban({ reason });
      message.channel.send(`✅ ${member.user.tag} a été banni.\nRaison : ${reason}`);
    } catch (error) {
      console.error(error);
      message.reply('❌ Une erreur est survenue lors du bannissement.');
    }
  }
};
