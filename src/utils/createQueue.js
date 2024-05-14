module.exports = (client, interaction) => {
  return client.player.nodes.create(interaction.guild, {
    metadata: interaction.channel,
    bufferingTimeout: 15000, //How long the player should attempt buffering before giving up
    leaveOnStop: true, //If player should leave the voice channel after user stops the player
    leaveOnStopCooldown: 5000, //Cooldown in ms
    leaveOnEnd: true, //If player should leave after the whole queue is over
    leaveOnEndCooldown: 15000, //Cooldown in ms
    leaveOnEmpty: true, //If the player should leave when the voice channel is empty
    leaveOnEmptyCooldown: 300000, //Cooldown in ms
    skipOnNoStream: true,
  })
}
