module.exports = async (queue, interaction, userChannel) => {
  try {
    if (!queue.connection) {
      await queue.connect(userChannel)
    }
  } catch {
    queue.delete()
    return await interaction.reply({
      content: 'ボイスチャンネルに参加できませんでした',
      ephemeral: true,
    })
  }
}
