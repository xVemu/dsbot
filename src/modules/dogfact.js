import axios from 'axios'
import { EmbedBuilder } from 'discord.js'

export default {
  name: 'dogfact',
  description: 'Sends random fact about dogs.',
  async execute(msg) {
    const { data: { data: [{ attributes: { body: fact } }] } } = await axios
      .get('https://dogapi.dog/api/v2/facts')
    const embed = new EmbedBuilder({
      title: 'Random dog fact!',
      description: fact,
      color: 0x10B5BF,
      timestamp: Date.now(),
      footer: { text: 'Mover Bot' },
    })
    await msg.reply({ embeds: [embed] })
  },
}
