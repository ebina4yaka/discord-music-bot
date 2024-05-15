import { SlashCommandBuilder } from '@discordjs/builders'
import winston from 'winston'

export const command = {
  data: new SlashCommandBuilder()
    .setName('stop_music')
    .setDescription('再生を停止してbotを終了します'),

  run: async ({ client, interaction }) => {
    const queue = client.player.nodes.get(interaction.guildId)

    if (!queue) {
      return await interaction.reply({
        content: '音楽が再生されていません',
        ephemeral: true,
      })
    }

    winston.loggers.get('info').info(`queue delete: ${queue}`)

    queue.delete()

    await interaction.reply({
      content: 'botを終了しました',
    })
  },
}
