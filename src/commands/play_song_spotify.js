const { SlashCommandBuilder } = require('@discordjs/builders')
const { QueryType } = require('discord-player')
const addSingleTrack = require('../utils/addSingleTrack')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play_song_spotify')
    .setDescription('音楽を再生します')
    .addStringOption((option) =>
      option.setName('url').setDescription('音楽のURL').setRequired(true),
    ),

  run: async ({ client, interaction }) => {
    await addSingleTrack(client, interaction, QueryType.SPOTIFY_SONG)
  },
}
