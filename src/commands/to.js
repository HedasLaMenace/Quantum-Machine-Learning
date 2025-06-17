module.exports = {
  name: 'to',
  description: 'Mute un membre en lui ajoutant le rôle Prison',
  async execute(message, args) {
    // Vérification des permissions
    if (!message.member.permissions.has('ManageRoles')) {
      return message.reply("❌ Tu n'as pas la permission de gérer les rôles.");
    }
    if (!message.guild.members.me.permissions.has('ManageRoles')) {
      return message.reply("❌ Je n'ai pas la permission de gérer les rôles.");
    }

    if (!args[0]) {
      return message.reply("❌ Merci de mentionner un membre ou fournir son ID.");
    }

    // Récupérer le membre via mention ou ID
    let member = null;
    if (message.mentions.members.size > 0) {
      member = message.mentions.members.first();
    } else {
      try {
        member = await message.guild.members.fetch(args[0]);
      } catch {
        return message.reply("❌ Membre introuvable avec cet ID.");
      }
    }

    // Chercher le rôle Prison sur le serveur
    const prisonRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'prison');
    if (!prisonRole) {
      return message.reply("❌ Le rôle Prison n'existe pas sur ce serveur.");
    }

    // Vérifier si le membre a déjà le rôle
    if (member.roles.cache.has(prisonRole.id)) {
      return message.reply("❌ Ce membre est déjà en prison.");
    }

    // Vérifier la position des rôles (le bot doit pouvoir attribuer ce rôle)
    if (prisonRole.position >= message.guild.members.me.roles.highest.position) {
      return message.reply("❌ Je ne peux pas attribuer ce rôle car il est au-dessus de mon rôle.");
    }

    try {
      await member.roles.add(prisonRole);
      message.channel.send(`✅ ${member.user.tag} est maintenant au shtar grosse force a lui/elle.`);
    } catch (error) {
      console.error(error);
      message.reply("❌ Impossible d'ajouter le rôle Prison.");
    }
  }
};
