'use strict'

const axios = require('axios')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'catfact',
    description: 'Sends random fact about cats.',
    async execute(msg) {
        const {data} = await axios.get('https://meowfacts.herokuapp.com/')
        await msg.reply({embeds: [new EmbedBuilder().setTitle('Random cat fact!').setDescription(data.data[0]).setColor('Random').setTimestamp()]})
    },
}