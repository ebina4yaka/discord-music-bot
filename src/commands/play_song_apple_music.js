import { SlashCommandBuilder } from '@discordjs/builders'
import { QueryType } from 'discord-player'
import { addTracks } from '../player.js'

export const command = {
  data: new SlashCommandBuilder()
    .setName('play_song_apple_music')
    .setDescription('音楽を再生します')
    .addStringOption((option) =>
      option.setName('url').setDescription('音楽のURL').setRequired(true),
    ),

  run: async ({ client, interaction }) => {
    await addTracks(client, interaction, QueryType.APPLE_MUSIC_SONG)
  },
}
