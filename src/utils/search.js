module.exports = (interaction, client, url, searchEngine) => {
  return client.player.search(url, {
    requestedBy: interaction.user,
    searchEngine,
  })
}
