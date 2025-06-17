const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'unlock',
  description: 'Déverrouille le salon actuel en réactivant l\'envoi de messages.',
  async execute(message) {
    if (!message.guild) return;
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply('❌ Tu n\'as pas la permission de gérer ce salon.');
    }

    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: true });
      message.reply('🔓 Ce salon est maintenant déverrouillé parlez mtn bande fdp.');
    } catch (error) {
      console.error(error);
      message.reply('❌ Impossible de déverrouiller ce salon.');
    }
  },
};
