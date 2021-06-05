'use strict'

const {CommandInteraction} = require('discord.js')

module.exports = {
    name: 'stop',
    description: 'Stops moving!',
    guildOnly: true,
    async execute(msg) {
        require('./move').shouldMoving = false
        if (msg instanceof CommandInteraction)
            await msg.reply(':ok_hand:', {ephemeral: true})
    }
    ,
}