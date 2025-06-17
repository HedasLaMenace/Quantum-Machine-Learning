const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { getServerLogsConfig, setServerLogChannel } = require('../data/logsconfig');

module.exports = {
  name: 'logsconfig',
  description: 'Configure les salons de logs du serveur.',
  async execute(message) {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply("❌ Vous devez être administrateur pour utiliser cette commande.");
    }

    const guildId = message.guild.id;
    const config = getServerLogsConfig(guildId) || {
      moderation: null,
      voice: null,
      roles: null,
      system: null, // ✅ Ajout du salon système
    };

    const embed = new EmbedBuilder()
      .setTitle('🔧 Configuration des salons de logs')
      .setDescription('Cliquez sur un bouton pour configurer le salon correspondant.\n' +
                      'Ensuite, envoyez l’ID du salon dans ce chat.')
      .addFields(
        { name: 'Salon modération', value: config.moderation ? `<#${config.moderation}>` : 'Non configuré', inline: true },
        { name: 'Salon vocal', value: config.voice ? `<#${config.voice}>` : 'Non configuré', inline: true },
        { name: 'Salon rôles', value: config.roles ? `<#${config.roles}>` : 'Non configuré', inline: true },
        { name: 'Salon système', value: config.system ? `<#${config.system}>` : 'Non configuré', inline: true }
      )
      .setColor('#0099ff');

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('config_moderation')
          .setLabel('Salon modération')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('config_voice')
          .setLabel('Salon vocal')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('config_roles')
          .setLabel('Salon rôles')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('config_system')
          .setLabel('Salon système')
          .setStyle(ButtonStyle.Danger)
      );

    const sentMessage = await message.channel.send({ embeds: [embed], components: [buttons] });

    const filter = i =>
      ['config_moderation', 'config_voice', 'config_roles', 'config_system'].includes(i.customId) &&
      i.user.id === message.author.id;

    const collector = sentMessage.createMessageComponentCollector({ filter, time: 120000 });

    collector.on('collect', async interaction => {
      await interaction.deferUpdate();

      const configType = interaction.customId.split('_')[1]; // moderation, voice, roles, system

      await interaction.followUp({ content: `Envoyez maintenant l'ID du salon pour **${configType}**.`, ephemeral: true });

      const msgFilter = m => m.author.id === message.author.id;

      try {
        const collected = await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 30000, errors: ['time'] });
        const newChannelId = collected.first().content.trim();

        const channel = message.guild.channels.cache.get(newChannelId);
        if (!channel) {
          return message.channel.send("❌ Salon invalide. Configuration annulée.");
        }

        setServerLogChannel(guildId, configType, newChannelId);

        await message.channel.send(`✅ Salon de logs **${configType}** mis à jour avec <#${newChannelId}>.`);

        embed.fields.find(f => f.name.toLowerCase().includes(configType)).value = `<#${newChannelId}>`;
        await sentMessage.edit({ embeds: [embed] });

      } catch {
        message.channel.send("⌛ Temps écoulé, configuration annulée.");
      }
    });

    collector.on('end', () => {
      sentMessage.edit({ components: [] }).catch(() => {});
    });
  }
};
