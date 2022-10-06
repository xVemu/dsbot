import axios from 'axios'
import { EmbedBuilder } from 'discord.js'

export default {
  name: 'catfact',
  description: 'Sends random fact about cats.',
  async execute(msg) {
    const { data: { data: facts } } = await axios.get('https://meowfacts.herokuapp.com/')
    const embed = new EmbedBuilder({
      title: 'Random cat fact!',
      description: facts[0],
      color: 0x10B5BF,
      timestamp: Date.now(),
      footer: { text: 'Mover Bot' },
    })
    await msg.reply({ embeds: [embed] })
  },
}
