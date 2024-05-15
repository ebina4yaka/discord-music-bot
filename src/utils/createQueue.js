module.exports = (client, interaction) => {
  return client.player.nodes.create(interaction.guild, {
    metadata: interaction,
    noEmitInsert: true,
    leaveOnStop: false,
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 60000,
    leaveOnEnd: true,
    leaveOnEndCooldown: 60000,
    pauseOnEmpty: true,
    preferBridgedMetadata: true,
    disableBiquad: true,
  })
}
