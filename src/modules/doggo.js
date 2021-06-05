'use strict'

const axios = require('axios')

module.exports = {
    name: 'doggo',
    description: 'Sends random dog picture.',
    guildOnly: false,
    async execute(msg) {
        try {
            const { data: { 0: { url } } } = await axios.get('https://api.thedogapi.com/v1/images/search')
            await msg.reply({ content: 'Here\'s your doggo', files: [url] })
        } catch (e) {
            await msg.reply('Error has occurred!', { ephemeral: true })
            console.error(e)
        }
    },
}