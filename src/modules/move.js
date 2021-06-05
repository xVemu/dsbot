'use strict'

const {CommandInteraction} = require('discord.js')
const { GuildMember } = require('discord.js')


module.exports = {
    name: 'move',
    description: 'Hey, wake up!',
    options: [
        {
            type: 'USER',
            name: 'user',
            description: 'User you want to move',
            required: true,
        },
        {
            type: 'STRING',
            name: 'delay',
            description: 'Delay between moving',
            required: false,
        },
    ],
    guildOnly: true,
    shouldMoving: false,
    async execute(msg, [userArg, delayArg]) {
        try {
            const delay = (isNaN(delayArg?.value ?? delayArg) ? 1 : (delayArg.value ?? delayArg)) * 1000
            const member = userArg.member ?? msg.mentions.members.first()
            if (!(member instanceof GuildMember)) return await msg.reply('It\'s not valid argument. Please use @tagged_user', {ephemeral: true})
            if (!member.voice.selfDeaf && delayArg !== `!`) return await msg.reply('User isn\'t self deafen!', {ephemeral: true})
            const memberChannel = member.voice.channel
            const channels = msg.guild.channels.cache
            let channelMoveTo = msg.guild.afkChannel
            if (!channelMoveTo) channelMoveTo = (channels.find(v => v.type === 'voice' && v.members.size === 0 && v.permissionsFor(member).has('CONNECT')) ||
                channels.find(v => v !== memberChannel && v.type === 'voice' && v.permissionsFor(member).has('CONNECT')))
            if (!channelMoveTo) return await msg.reply('Haven\'t found right channel!', {ephemeral: true})
            if (msg instanceof CommandInteraction)
                await msg.reply(':ok_hand:', {ephemeral: true})
            let channel = channelMoveTo
            this.shouldMoving = true
            while ((member.voice.selfDeaf || delayArg === '!') && this.shouldMoving) {
                await member.voice.setChannel(channel, 'Hey, wake up!')
                channel = channel === memberChannel ? channelMoveTo : memberChannel
                await new Promise(r => setTimeout(r, delay))
            }
            await member.voice.setChannel(memberChannel, 'Hey, wake up!')
        } catch (e) {
            msg.reply(e.message === 'Target user is not connected to voice.' ? e.message : 'Error has occurred', {ephemeral: true})
        } finally {
            this.shouldMoving = false
        }
    },
}