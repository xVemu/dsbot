'use strict'

const axios = require('axios')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'dogfact',
    description: 'Sends random fact about dogs.',
    async execute(msg) {
        const {data: {facts}} = await axios.get('https://dog-api.kinduff.com/api/facts')
        await msg.reply({embeds: [new EmbedBuilder({title: 'Random dog fact!', description: facts[0], color: 'Random', timestamp: Date.now(), footer: {text: 'Mover Bot'}}).setTitle('Random dog fact!').setDescription(facts[0]).setColor('Random').setTimestamp()]})
    },
}