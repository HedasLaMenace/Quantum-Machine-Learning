const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'addrole',
  description: 'Ajoute un rôle à un membre (mentionné).',
  async execute(message, args) {
    if (!message.guild) return message.channel.send("Commande uniquement en serveur.");
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return message.channel.send("Tu n'as pas la permission.");
    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return message.channel.send("Je n'ai pas la permission.");

    const member = message.mentions.members.first();
    const role = message.mentions.roles.first();

    if (!member) return message.channel.send("Mentionne un membre.");
    if (!role) return message.channel.send("Mentionne un rôle.");

    if (role.position >= message.guild.members.me.roles.highest.position) 
      return message.channel.send("Le rôle est au-dessus de mon rôle.");

    try {
      await member.roles.add(role);
      message.channel.send(`Rôle ${role.name} ajouté à ${member.user.tag}.`);
    } catch (error) {
      console.error(error);
      message.channel.send("Erreur lors de l'ajout du rôle.");
    }
  }
};
