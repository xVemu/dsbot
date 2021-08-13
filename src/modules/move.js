'use strict'

const {Permissions, GuildMember, MessageActionRow, MessageButton} = require('discord.js'),
    sleep = require('util').promisify(setTimeout)


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
            if (!(member instanceof GuildMember)) return await msg.reply({content: 'It\'s not valid argument. Please use @tagged_user', ephemeral: true})
            if (!member.voice.selfDeaf && delayArg !== '!') return await msg.reply({content: 'User isn\'t self deafen!', ephemeral: true})
            const memberChannel = member.voice.channel
            const channels = msg.guild.channels.cache
            let channelMoveTo = msg.guild.afkChannel
            if (!channelMoveTo) channelMoveTo = (channels.find(v => v.isVoice() && v.members.size === 0 && v.permissionsFor(member).has(Permissions.FLAGS.CONNECT)) ||
                channels.find(v => v !== memberChannel && v.isVoice() && v.permissionsFor(member).has(Permissions.FLAGS.CONNECT)))
            if (!channelMoveTo) return await msg.reply({content: 'Haven\'t found right channel!', ephemeral: true})
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('stop')
                        .setLabel('STOP')
                        .setStyle('DANGER'),
                )
            await msg.reply({content: 'Moving!', components: [row]})
            let channel = channelMoveTo
            this.shouldMoving = true
            while ((member.voice.selfDeaf || delayArg === '!') && this.shouldMoving) {
                await member.voice.setChannel(channel, 'Hey, wake up!')
                channel = channel === memberChannel ? channelMoveTo : memberChannel
                await sleep(delay) //TODO cancel sleep when shouldMoving or selfDeaf changes
            }
            await member.voice.setChannel(memberChannel, 'Hey, wake up!')
        } catch (e) {
            if (e.message === 'Target user is not connected to voice.') await msg.reply({content: e.message, ephemeral: true})
            else {
                await msg.reply({ content: 'Error has occurred!', ephemeral: true })
                console.error(e)
            }
        } finally {
            this.shouldMoving = false
        }
    },
}