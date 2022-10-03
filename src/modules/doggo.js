'use strict'

const axios = require('axios')

module.exports = {
    name: 'doggo',
    description: 'Sends random dog picture.',
    async execute(msg) {
        const {data: {0: {url}}} = await axios.get('https://api.thedogapi.com/v1/images/search')
        await msg.reply({files: [url]})
    },
}