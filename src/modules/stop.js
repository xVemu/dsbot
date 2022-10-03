'use strict'

const {CommandInteraction} = require('discord.js')

/*TODO*/
module.exports = {
    name: 'stop',
    description: 'Stops moving!',
    dmPermission: false,
    async execute(msg) {
        require('./move').shouldMoving = false
        if (msg instanceof CommandInteraction)
            await msg.reply('Stopped')
    },
    async buttonClick(interaction) {
        require('./move').shouldMoving = false
        await interaction.message.delete()
    },
}