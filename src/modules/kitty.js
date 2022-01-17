'use strict'

const axios = require('axios')

module.exports = {
    name: 'kitty',
    description: 'Sends random cat picture.',
    guildOnly: false,
    async execute(msg) {
        try {
            const {data: {0: {url}}} = await axios.get('https://api.thecatapi.com/v1/images/search')
            await msg.reply({files: [url]})
        } catch (e) {
            await msg.reply({content: 'Error has occurred!', ephemeral: true})
            console.error(e)
        }
    },
}