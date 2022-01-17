'use strict'

const axios = require('axios')

module.exports = {
    name: 'meme',
    description: 'Sends random meme.',
    guildOnly: false,
    async execute(msg) {
        try {
            const {data: {nsfw, url, title}} = await axios.get('https://meme-api.herokuapp.com/gimme')
            if (nsfw && !msg.channel.nsfw) return this.execute(msg)
            await msg.reply({content: title, files: [url]})
        } catch (e) {
            await msg.reply('Error has occurred!')
            console.error(e)
        }
    },
}