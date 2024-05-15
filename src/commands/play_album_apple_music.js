const { SlashCommandBuilder } = require('@discordjs/builders')
const { QueryType } = require('discord-player')
const addMultipleTracks = require('../utils/addMultipleTracks')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play_album_apple_music')
    .setDescription('アルバムを再生します')
    .addStringOption((option) =>
      option.setName('url').setDescription('音楽のURL').setRequired(true),
    ),

  run: async ({ client, interaction }) => {
    await addMultipleTracks(client, interaction, QueryType.APPLE_MUSIC_ALBUM)
  },
}
