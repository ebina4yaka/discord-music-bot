const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const path = require('node:path')
const commandFiles = require('./utils/commandFiles.js')

const commands = commandFiles.map((file) => {
  const command = require(path.resolve(__dirname, `./commands/${file}`))
  return command.data.toJSON()
})

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN)
;(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
      body: commands,
    })
  } catch (error) {
    console.error(error)
  }
})()
