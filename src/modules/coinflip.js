'use strict'

module.exports = {
    name: 'coinflip',
    description: 'Flips a coin.',
    guildOnly: false,
    async execute(msg) {
        await msg.reply((Math.floor(Math.random() * 2) === 0) ? 'heads' : 'tails')
    },
}