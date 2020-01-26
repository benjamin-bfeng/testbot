const Discord = require('discord.js')
const config = require('./config')

const discordClient = new Discord.Client()

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`)
})

discordClient.login(config.discordApiToken)