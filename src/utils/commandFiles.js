const fs = require('node:fs')
const path = require('node:path')

module.exports = fs
  .readdirSync(path.join(__dirname, '../commands'))
  .filter((file) => file.endsWith('.js'))
