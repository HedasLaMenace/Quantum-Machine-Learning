module.exports = {
    name: 'prison',
    description: 'Voir le temps restant de prison d\'un membre',
    async execute(message, args) {
      const member = message.mentions.members.first() || message.member;
  
      if (!member.communicationDisabledUntilTimestamp || member.communicationDisabledUntilTimestamp < Date.now()) {
        return message.reply(`${member.user.tag} n'est pas en prison.`);
      }
  
      const timeLeft = member.communicationDisabledUntilTimestamp - Date.now();
      const minutesLeft = Math.ceil(timeLeft / 60000);
  
      message.channel.send(`${member.user.tag} est en prison pour encore ${minutesLeft} minute(s).`);
    }
  };
  