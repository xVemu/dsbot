'use strict'

const {ApplicationCommandOptionType} = require('discord.js')

module.exports = {
    name: 'poll',
    description: 'Creates a simple poll.',
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: 'option1',
            description: '1st option',
            required: true,
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'option2',
            description: '2nd option',
            required: true,
        },
    ],
    async execute(msg, [option1, option2]) {
        const message = `✅ - ${option1.value ?? option1} \n❌ - ${option2.value ?? option2}`
        const sent = await msg.reply({content: message, fetchReply: true}) ?? await msg.fetchReply()
        sent.react('✅')
        sent.react('❌')
    },
}