const axios = require('axios')

module.exports = {
  name: 'foxy',
  description: 'Sends random fox picture.',
  async execute(msg) {
    const { data: { image } } = await axios.get('https://randomfox.ca/floof/')
    await msg.reply({ files: [image] })
  },
}
