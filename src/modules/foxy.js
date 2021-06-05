'use strict'

const axios = require('axios')

module.exports = {
    name: 'foxy',
    description: 'Sends random fox picture.',
    guildOnly: false,
    async execute(msg) {
        try {
            const { data: { image } } = await axios.get('https://randomfox.ca/floof/')
            await msg.reply({ content: 'Here\'s your foxy', files: [image] })
        } catch (e) {
            await msg.reply('Error has occurred!', { ephemeral: true })
            console.error(e)
        }
    },
}