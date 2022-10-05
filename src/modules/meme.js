const axios = require('axios')

module.exports = {
  name: 'meme',
  description: 'Sends random meme.',
  async execute(msg) {
    const { data: { nsfw, url, title } } = await axios.get('https://meme-api.herokuapp.com/gimme')
    if (nsfw && !msg.channel.nsfw) return this.execute(msg)
    await msg.reply({
      content: title,
      files: [url],
    })
  },
}
