const {
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ApplicationCommandOptionType,
  ChannelType,
  ButtonStyle,
} = require('discord.js')
const sleep = require('util').promisify(setTimeout)

module.exports = {
  name: 'move',
  description: 'Hey, wake up!',
  options: [
    {
      type: ApplicationCommandOptionType.User,
      name: 'user',
      description: 'User you want to move',
      required: true,
    },
    {
      type: ApplicationCommandOptionType.Number,
      name: 'delay',
      description: 'Delay between moving',
      required: false,
    },
  ],
  dmPermission: false,
  shouldMoving: false,
  async execute(msg, [{ member }, delayArg]) {
    try {
      const delay = delayArg ? 1 : delayArg.value * 1000

      if (!member.voice.selfDeaf) {
        return await msg.reply({
          content: 'User isn\'t self deafen!',
          ephemeral: true,
        })
      }

      const memberChannel = member.voice.channel

      const movingChannel = findChannel(member, msg.guild)

      if (!movingChannel) {
        return await msg.reply({
          content: 'Haven\'t found right channel!',
          ephemeral: true,
        })
      }

      const row = new ActionRowBuilder({
        components: [
          new ButtonBuilder({
            customId: 'stop',
            label: 'STOP',
            style: ButtonStyle.Danger,
          }),
        ],
      })

      await msg.reply({
        content: 'Moving!',
        components: [row],
      })

      let channel = movingChannel
      this.shouldMoving = true

      while (member.voice.selfDeaf && this.shouldMoving) {
        /* eslint-disable no-await-in-loop */
        await member.voice.setChannel(channel, 'Hey, wake up!')
        channel = channel === memberChannel ? movingChannel : memberChannel
        await sleep(delay) // TODO cancel sleep when shouldMoving or selfDeaf changes
      }
      /* eslint-enable no-await-in-loop */
      await member.voice.setChannel(memberChannel, 'Hey, wake up!')
    } catch (e) {
      if (e.message === 'Target user is not connected to voice.') {
        return msg.reply({
          content: e.message,
          ephemeral: true,
        })
      }
      throw e
    } finally {
      this.shouldMoving = false
    }
  },
}

function findChannel(member, guild) {
  if (guild.afkChannel) return guild.afkChannel
  const channels = guild.channels.cache

  return channels.find(v => v.type === ChannelType.GuildVoice
      && v.members.size === 0
      && v.permissionsFor(member).has(PermissionsBitField.Flags.Connect))
    || channels.find(v => v !== member.voice.channel
      && v.type === ChannelType.GuildVoice
      && v.permissionsFor(member).has(PermissionsBitField.Flags.Connect))
}
