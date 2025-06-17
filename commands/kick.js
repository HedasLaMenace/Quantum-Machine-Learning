module.exports = {
  name: 'kick',
  description: 'Expulse un membre du serveur',
  async execute(message, args, { client }) {
    // Ton code ici, tu peux utiliser `client` normalement
    if (!message.member.permissions.has('KICK_MEMBERS')) {
      return message.reply("❌ Tu n'as pas la permission d'expulser des membres.");
    }
    
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply("❌ Merci de mentionner un membre à expulser.");
    }
    
    if (!member.kickable) {
      return message.reply("❌ Je ne peux pas expulser ce membre.");
    }
    
    const reason = args.slice(1).join(' ') || "Aucune raison fournie";
    
    await member.kick(reason);
    message.channel.send(`✅ ${member.user.tag} a été expulsé. Raison : ${reason}`);
  }
};
