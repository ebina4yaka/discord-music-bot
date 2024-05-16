const { useMainPlayer } = require('discord-player')

const addTracks = async (_client, interaction, queryType) => {
  joinVoiceChannel(interaction)

  const player = useMainPlayer()
  const queue = player.nodes.create(interaction.guild, {
    metadata: interaction,
    noEmitInsert: true,
    leaveOnStop: false,
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 60000,
    leaveOnEnd: true,
    leaveOnEndCooldown: 60000,
    pauseOnEmpty: true,
    preferBridgedMetadata: false,
    disableBiquad: true,
  })

  try {
    if (!queue.connection) {
      await queue.connect(interaction.member.voice.channel)
    }
  } catch {
    queue.delete()
    return await interaction.reply({
      content: 'ボイスチャンネルに参加できませんでした',
      ephemeral: true,
    })
  }

  await interaction.deferReply()
  const url = interaction.options.getString('url')

  const result = await player.search(url, {
    requestedBy: interaction.user,
    searchEngine: queryType,
  })
  const tracks = result.tracks

  if (tracks.length === 0) {
    return await interaction.followUp({
      content: '音楽が見つかりませんでした',
    })
  }

  // acquire task entry
  const entry = queue.tasksQueue.acquire()
  // wait for previous task to be released and our task to be resolved
  await entry.getTask()

  queue.addTrack(result.tracks)

  if (result.playlist == null) {
    await interaction.followUp({
      content: `トラックをキューに追加しました\n**${result.tracks[0].title}**\n${result.tracks[0].url}`,
    })
  } else if (result.playlist.type === 'playlist') {
    await interaction.followUp({
      content: `プレイリストをキューに追加しました\n**${result.playlist.title}: ${result.playlist.tracks.length}曲**\n${result.playlist.url}`,
    })
  } else if (result.playlist.type === 'album') {
    await interaction.followUp({
      content: `アルバムをキューに追加しました\n**${result.playlist.title}: ${result.playlist.tracks.length}曲**\n${result.playlist.url}`,
    })
  }

  try {
    if (!queue.isPlaying()) {
      await queue.node.play()
    }
  } catch (error) {
    interaction.followUp({
      content: `再生に失敗しました\n**${queue.currentTrack.title}\n**${error.message}**`,
    })
  } finally {
    // release the task we acquired to let other tasks to be executed
    // make sure you are releasing your entry, otherwise your bot won't
    // accept new play requests
    queue.tasksQueue.release()
  }
}

const joinVoiceChannel = (interaction) => {
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

module.exports.addTracks = addTracks
