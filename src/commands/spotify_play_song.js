const { SlashCommandBuilder } = require('@discordjs/builders')
const { QueryType } = require('discord-player')
const joinVoiceChannel = require('../utils/joinVoiceChannel')
const createQueue = require('../utils/createQueue')
const connectionQueue = require('../utils/connectionQueue')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spotify_play_song')
    .setDescription('音楽を再生します')
    .addStringOption((option) =>
      option.setName('url').setDescription('音楽のURL').setRequired(true),
    ),

  run: async ({ client, interaction }) => {
    joinVoiceChannel(interaction)
    const queue = createQueue(client, interaction)
    connectionQueue(queue, interaction, interaction.member.voice.channel)

    await interaction.deferReply()
    const url = interaction.options.getString('url')

    const track = await client.player
      .search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.SPOTIFY_SONG,
      })
      .then((x) => x.tracks[0])

    if (!track) {
      return await interaction.followUp({
        content: '音楽が見つかりませんでした',
      })
    }

    queue.addTrack(track)

    if (!queue.isPlaying()) {
      queue.play(track)
    }

    return await interaction.followUp({
      content: `音楽をキューに追加しました\n**${track.author}: ${track.title}**\n${track.url}`,
    })
  },
}
