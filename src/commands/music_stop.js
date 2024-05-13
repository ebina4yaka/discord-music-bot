const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('music_stop')
    .setDescription('再生を停止してbotを終了します'),

  run: async ({ client, interaction }) => {
    const queue = client.player.nodes.get(interaction.guildId)

    if (!queue) {
      return await interaction.reply({
        content: '音楽が再生されていません',
        ephemeral: true,
      })
    }

    queue.delete()

    await interaction.reply({
      content: 'botを終了しました',
    })
  },
}
