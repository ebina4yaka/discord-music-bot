module.exports = (interaction, client, url, queryType) => {
  return client.player.search(url, {
    requestedBy: interaction.user,
    searchEngine: queryType,
  })
}
