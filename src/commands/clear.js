module.exports = {
    name: 'clear',
    description: 'Supprime un nombre de messages dans le salon.',
    usage: '+clear <nombre>',
    async execute(message, args) {
      // Vérification des permissions
      if (!message.member.permissions.has('ManageMessages')) {
        return message.reply("❌ Tu n'as pas la permission de supprimer des messages.");
      }
      if (!message.guild.members.me.permissions.has('ManageMessages')) {
        return message.reply("❌ Je n'ai pas la permission de supprimer des messages.");
      }
  
      const amount = parseInt(args[0]);
      if (isNaN(amount) || amount < 1 || amount > 100) {
        return message.reply("❌ Merci de spécifier un nombre entre 1 et 100.");
      }
  
      try {
        // Supprimer les messages (la méthode bulkDelete ne supprime que jusqu'à 14 jours de messages)
        await message.channel.bulkDelete(amount + 1, true); // +1 pour supprimer le message de la commande aussi
        message.channel.send(`✅ ${amount} messages ont été supprimés.`)
          .then(msg => setTimeout(() => msg.delete(), 5000)); // Supprime le message de confirmation au bout de 5 secondes
      } catch (error) {
        console.error(error);
        message.reply("❌ Impossible de supprimer les messages.");
      }
    }
  };
  