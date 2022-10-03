'use strict'

const {ApplicationCommandOptionType} = require('discord.js')

module.exports = {
    name: 'random',
    description: 'Randomize number from the given range.',
    guildOnly: false,
    options: [{
        type: ApplicationCommandOptionType.Integer,
        name: 'range',
        description: 'Maximum number than can be rolled.',
        required: true,
    }],
    async execute(msg, [range]) {
        const maxNumber = range.value ?? parseInt(range)

        if (isNaN(maxNumber))
            return await msg.reply('that doesn\'t seem to be a valid number.')

        const random = (Math.floor(Math.random() * maxNumber) + 1).toString()
        await msg.reply(random)
    },
}