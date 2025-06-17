module.exports = {
  name: 'unto',
  description: "Retirer le rôle 'Prison' d'un membre",
  async execute(message, args) {
    // Vérification des permissions
    if (!message.member.permissions.has('ManageRoles')) {
      return message.reply("❌ Tu n'as pas la permission d'enlever des rôles.");
    }
    if (!message.guild.members.me.permissions.has('ManageRoles')) {
      return message.reply("❌ Je n'ai pas la permission d'enlever des rôles.");
    }

    if (!args[0]) {
      return message.reply("❌ Merci de mentionner un membre ou fournir son ID.");
    }

    // Récupérer le membre via mention ou ID
    let member;
    if (message.mentions.members.size > 0) {
      member = message.mentions.members.first();
    } else {
      try {
        member = await message.guild.members.fetch(args[0]);
      } catch {
        return message.reply("❌ Membre introuvable avec cet ID.");
      }
    }

    // Chercher le rôle Prison
    const prisonRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'prison');
    if (!prisonRole) {
      return message.reply("❌ Le rôle Prison n'existe pas sur ce serveur.");
    }

    // Vérifier si le membre a le rôle
    if (!member.roles.cache.has(prisonRole.id)) {
      return message.reply("❌ Ce membre n'a pas le rôle Prison.");
    }

    try {
      await member.roles.remove(prisonRole);
      message.channel.send(`✅ ${member.user.tag} a été libéré du shtar.`);
    } catch (error) {
      console.error(error);
      message.reply("❌ Impossible d'enlever le rôle Prison.");
    }
  }
};
