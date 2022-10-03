'use strict'

const axios = require('axios')

module.exports = {
    name: 'doggo',
    description: 'Sends random dog picture.',
    async execute(msg) {
        try {
            const {data: {0: {url}}} = await axios.get('https://api.thedogapi.com/v1/images/search')
            await msg.reply({files: [url]})
        } catch (e) {
            await msg.reply({content: 'Error has occurred!', ephemeral: true})
            console.error(e)
        }
    },
}