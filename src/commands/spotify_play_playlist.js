const { SlashCommandBuilder } = require('@discordjs/builders')
const { QueryType } = require('discord-player')
const joinVoiceChannel = require('../utils/joinVoiceChannel')
const createQueue = require('../utils/createQueue')
const connectionQueue = require('../utils/connectionQueue')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spotify_play_playlist')
    .setDescription('プレイリストを再生します')
    .addStringOption((option) =>
      option.setName('url').setDescription('プレイリストのURL').setRequired(true),
    ),

  run: async ({ client, interaction }) => {
    joinVoiceChannel(interaction)
    const queue = createQueue(client, interaction)
    connectionQueue(queue, interaction, interaction.member.voice.channel)

    await interaction.deferReply()
    const url = interaction.options.getString('url')

    const result = await client.player.search(url, {
      requestedBy: interaction.user,
      searchEngine: QueryType.SPOTIFY_PLAYLIST,
    })

    const tracks = result.tracks

    if (tracks.length === 0) {
      return await interaction.followUp({
        content: '音楽が見つかりませんでした',
      })
    }

    queue.addTrack(tracks)

    if (!queue.isPlaying()) {
      queue.play(tracks)
    }

    return await interaction.followUp({
      content: `プレイリストをキューに追加しました\n**${result.playlist.title}: ${result.playlist.tracks.length}曲**\n${result.playlist.url}`,
    })
  },
}
