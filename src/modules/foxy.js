'use strict'

const axios = require('axios')

module.exports = {
    name: 'foxy',
    description: 'Sends random fox picture.',
    async execute(msg) {
        try {
            const {data: {image}} = await axios.get('https://randomfox.ca/floof/')
            await msg.reply({files: [image]})
        } catch (e) {
            await msg.reply({content: 'Error has occurred!', ephemeral: true})
            console.error(e)
        }
    },
}