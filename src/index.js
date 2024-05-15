const { Client, GatewayIntentBits } = require('discord.js')
const { Player } = require('discord-player')
const { SpotifyExtractor } = require('@discord-player/extractor')
const winston = require('winston')
const { makeLogger } = require('./logger')

require('./instrument.js')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
})
const commandFiles = require('./utils/commandFiles.js')

client.slashcommands = {}
client.player = new Player(client)

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.slashcommands[command.data.name] = command
}

client.on('ready', async () => {
  winston.loggers.add('info', makeLogger('info', 'json', 'info.log'))
  winston.loggers.add('error', makeLogger('error', 'json', 'error.log'))

  winston.loggers.get('info').info(`Logged in as ${client.user.tag}!`)
  // this is the entrypoint for discord-player based application
  const player = new Player(client)
  // Now, lets load all the default extractors, except 'YouTubeExtractor'. You can remove the filter if you want to load all the extractors.
  await player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor')
  await player.extractors.register(SpotifyExtractor, {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  })
  // this event is emitted whenever discord-player starts to play a track
  player.events.on('playerStart', (queue, track) => {
    winston.loggers.get('info').info(`playing track title: ${track.title}`)
    winston.loggers.get('info').info(`playing track author: ${track.author}`)
    winston.loggers.get('info').info(`playing track description: ${track.description}`)
    winston.loggers.get('info').info(`playing track url: ${track.url}`)
    winston.loggers.get('info').info(`playing track source: ${track.source}`)
    queue.metadata.followUp(`再生中 **${track.title}**`)
  })
  winston.loggers.get('info').info('Bot is ready')
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }

  const command = client.slashcommands[interaction.commandName]
  if (!command) {
    await interaction.reply({
      content: 'コマンドが存在しません',
      ephemeral: true,
    })
  }

  await command.run({ client, interaction })
})

client.login(process.env.TOKEN)
