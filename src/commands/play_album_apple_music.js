import { SlashCommandBuilder } from '@discordjs/builders'
import { QueryType } from 'discord-player'
import { addTracks } from '../player.js'

export default {
  data: new SlashCommandBuilder()
    .setName('play_album_apple_music')
    .setDescription('アルバムを再生します')
    .addStringOption((option) =>
      option.setName('url').setDescription('音楽のURL').setRequired(true),
    ),

  run: async ({ client, interaction }) => {
    await addTracks(client, interaction, QueryType.APPLE_MUSIC_ALBUM)
  },
}
