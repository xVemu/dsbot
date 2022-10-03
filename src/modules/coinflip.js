'use strict'

module.exports = {
    name: 'coinflip',
    description: 'Flips a coin.',
    async execute(msg) {
        await msg.reply((Math.floor(Math.random() * 2) === 0) ? 'heads' : 'tails')
    },
}