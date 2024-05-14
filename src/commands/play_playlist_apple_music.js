const { SlashCommandBuilder } = require('@discordjs/builders')
const { QueryType } = require('discord-player')
const addMultipleTracks = require('../utils/addMultipleTracks')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play_playlist_apple_music')
    .setDescription('プレイリストを再生します')
    .addStringOption((option) =>
      option.setName('url').setDescription('プレイリストのURL').setRequired(true),
    ),

  run: async ({ client, interaction }) => {
    await addMultipleTracks(interaction, client, QueryType.APPLE_MUSIC_PLAYLIST)
  },
}
