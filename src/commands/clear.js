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
      // Supprimer les messages (bulkDelete ne supprime que jusqu'à 14 jours)
      await message.channel.bulkDelete(amount + 1, true);

      const confirmation = await message.channel.send(`✅ ${amount} messages ont été supprimés.`);

      setTimeout(async () => {
        try {
          await confirmation.delete();
        } catch (err) {
          if (err.code === 10008) {
            console.warn("🔸 Le message de confirmation était déjà supprimé.");
          } else {
            console.error("❌ Erreur lors de la suppression du message de confirmation :", err);
          }
        }
      }, 5000);

    } catch (error) {
      console.error("❌ Erreur lors du bulkDelete :", error);
      message.reply("❌ Impossible de supprimer les messages.");
    }
  }
};

  
