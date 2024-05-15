import { SlashCommandBuilder } from '@discordjs/builders'
import { QueryType } from 'discord-player'
import { addTracks } from '../player.js'

export const command = {
  data: new SlashCommandBuilder()
    .setName('play_playlist_apple_music')
    .setDescription('プレイリストを再生します')
    .addStringOption((option) =>
      option.setName('url').setDescription('プレイリストのURL').setRequired(true),
    ),

  run: async ({ client, interaction }) => {
    await addTracks(client, interaction, QueryType.APPLE_MUSIC_PLAYLIST)
  },
}
