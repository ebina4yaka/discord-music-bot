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

  const { tracks } = await search(interaction, client, url, queryType)
  const track = tracks[0]

  if (!track) {
    return await interaction.followUp({
      content: '音楽が見つかりませんでした',
    })
  }

  queue.addTrack(track)
  winston.loggers.get('info').info(`Added track: ${track}`)

  if (!queue.isPlaying()) {
    queue.play(track)
  }

  return await interaction.followUp({
    content: `音楽をキューに追加しました\n**${track.author}: ${track.title}**\n${track.url}`,
  })
}
