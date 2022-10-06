import axios from 'axios'
import { EmbedBuilder } from 'discord.js'

export default {
  name: 'dogfact',
  description: 'Sends random fact about dogs.',
  async execute(msg) {
    const { data: { facts } } = await axios.get('https://dog-api.kinduff.com/api/facts')
    const embed = new EmbedBuilder({
      title: 'Random dog fact!',
      description: facts[0],
      color: 0x10B5BF,
      timestamp: Date.now(),
      footer: { text: 'Mover Bot' },
    })
    await msg.reply({ embeds: [embed] })
  },
}
