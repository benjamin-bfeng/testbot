const Discord = require('discord.js')
const config = require('./config')
const {ConvertTo1ChannelStream} = require('./convertStream')
const {playFile} = require('./media')
const googleSpeech = require('@google-cloud/speech')

const googleSpeechClient = new googleSpeech.SpeechClient()

const discordClient = new Discord.Client()

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`)
})

discordClient.login(config.discordApiToken)

discordClient.on('message', async (message) => {
  if (message.content == "!join") {
    const member = message.member
    const memberVoiceChannel = member.voice.channel

    const connection = await memberVoiceChannel.join()
    const receiver = connection.receiver

    await playFile(connection, 'wrongChannelEn.mp3')

    connection.on('speaking', (user, speaking) => {
      if (!speaking) {
        return
      }

      console.log(`I'm listening to ${user.username}`)

      // this creates a 16-bit signed PCM, stereo 48KHz stream
      const audioStream = receiver.createStream(user, { mode: 'pcm' })
      const requestConfig = {
        encoding: 'LINEAR16',
        sampleRateHertz: 48000,
        languageCode: 'en-US'
      }
      const request = {
        config: requestConfig
      }
      const recognizeStream = googleSpeechClient
        .streamingRecognize(request)
        .on('error', console.error)
        .on('data', response => {
          const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n')
            .toLowerCase()
          console.log(`Transcription: ${transcription}`)
        })

      const convertTo1ChannelStream = new ConvertTo1ChannelStream()

      audioStream.pipe(convertTo1ChannelStream).pipe(recognizeStream)

      audioStream.on('end', async () => {
        console.log('audioStream end')
      })
    })
  } else if (message.content == "!leave") {
    const member = message.member
    const memberVoiceChannel = member.voice.channel
    memberVoiceChannel.leave()
  }
})