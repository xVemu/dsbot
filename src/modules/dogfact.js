'use strict'

const axios = require('axios')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'dogfact',
    description: 'Sends random fact about dogs.',
    async execute(msg) {
        const {data: {facts}} = await axios.get('https://dog-api.kinduff.com/api/facts')
        await msg.reply({embeds: [new EmbedBuilder().setTitle("Random dog fact!").setDescription(facts[0]).setColor('Random').setTimestamp()]})
    },
}