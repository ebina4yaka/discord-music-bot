const joinVoiceChannel = require('./joinVoiceChannel')
const createQueue = require('./createQueue')
const connectionQueue = require('./connectionQueue')
const search = require('./search')
const winston = require('winston')

module.exports = async (client, interaction, queryType) => {
  joinVoiceChannel(interaction)
  const queue = createQueue(client, interaction)
  await connectionQueue(queue, interaction, interaction.member.voice.channel)

  await interaction.deferReply()
  const url = interaction.options.getString('url')

  const result = await search(interaction, client, url, queryType)
  const tracks = result.tracks

  if (tracks.length === 0) {
    return await interaction.followUp({
      content: '音楽が見つかりませんでした',
    })
  }

  queue.addTrack(tracks)

  tracks.map((track) => {
    winston.loggers.get('info').info(`Added track: ${track}`)
  })

  if (!queue.isPlaying()) {
    queue.play(tracks)
  }

  return await interaction.followUp({
    content: `プレイリストをキューに追加しました\n**${result.playlist.title}: ${result.playlist.tracks.length}曲**\n${result.playlist.url}`,
  })
}
