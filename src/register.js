import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { commandFiles } from './files.js'

const commands = commandFiles.map(async (file) => {
  const command = await import(`./commands/${file}`)
  return command.default.data.toJSON()
})

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN)
;(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
      body: await Promise.all(commands),
    })
  } catch (error) {
    console.error(error)
  }
})()
