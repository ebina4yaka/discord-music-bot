module.exports = (interaction) => {
  const userChannelId = interaction.member.voice.channelId
  const botChannelId = interaction.guild.members.me.voice.channelId

  if (!userChannelId) {
    return interaction.reply({
      ephemeral: true,
    })
  }

  if (botChannelId && userChannelId !== botChannelId) {
    return interaction.reply({
      content: 'botと同じボイスチャンネルに参加してください',
      ephemeral: true,
    })
  }
}
