import axios from 'axios'

export default {
  name: 'kitty',
  description: 'Sends random cat picture.',
  async execute(msg) {
    const { data: { 0: { url } } } = await axios.get('https://api.thecatapi.com/v1/images/search')
    await msg.reply({ files: [url] })
  },
}
