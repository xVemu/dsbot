'use strict'

const axios = require('axios')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'catfact',
    description: 'Sends random fact about cats.',
    async execute(msg) {
        const {data} = await axios.get('https://meowfacts.herokuapp.com/')
        await msg.reply({embeds: [new EmbedBuilder({title: 'Random cat fact!', description: data.data[0], color: 0x10B5BF, timestamp: Date.now(), footer: {text: 'Mover Bot'}})]})
    },
}