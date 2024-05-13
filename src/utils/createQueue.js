module.exports = (client, interaction) => {
  return client.player.nodes.create(interaction.guild, {
    metadata: {
      channel: interaction.channel,
    },
  })
}
