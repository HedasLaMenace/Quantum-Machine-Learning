const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'lock',
  description: 'Verrouille le salon actuel en désactivant l\'envoi de messages.',
  async execute(message) {
    if (!message.guild) return;
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply('❌ Tu n\'as pas la permission de gérer ce salon.');
    }

    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
      message.reply('🔒 Ce salon est maintenant verrouillé. nvm vous allez pas parler');
    } catch (error) {
      console.error(error);
      message.reply('❌ Impossible de verrouiller ce salon.');
    }
  },
};
