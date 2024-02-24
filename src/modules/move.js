import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
} from 'discord.js'
import { promisify } from 'util'

const sleep = promisify(setTimeout)

export default {
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
    const delay = delayArg ? delayArg.value * 1000 : 1000

    if (!member.voice.selfDeaf) {
      return msg.reply({
        content: 'User isn\'t self deafen!',
        ephemeral: true,
      })
    }

    const memberChannel = member.voice.channel

    const movingChannel = findChannel(member, msg.guild)

    if (!movingChannel) {
      return msg.reply({
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

    const { interaction: { id: interactionId } } = await msg.reply({
      content: `Moving ${member}!`,
      components: [row],
      fetchReply: true,
    })

    const { client: { movingList } } = msg
    movingList.push(interactionId)

    let channel = movingChannel

    try {
      while (member.voice.selfDeaf && movingList.includes(interactionId)) {
        /* eslint-disable no-await-in-loop */
        await member.voice.setChannel(channel, 'Hey, wake up!')
        channel = channel === memberChannel ? movingChannel : memberChannel
        await sleep(delay) // TODO cancel sleep when shouldMoving or selfDeaf changes
      }
      /* eslint-enable no-await-in-loop */
      await member.voice.setChannel(memberChannel, 'Hey, wake up!')
    } catch (e) {
      if (e.message === 'Target user is not connected to voice.') {
        return msg.deleteReply()
          .catch(() => {})
      }

      if (e.message === 'Missing Permissions') {
        return msg.editReply({
          content: 'I haven\'t enough permissions to move user!',
          components: [],
        })
      }

      throw e
    } finally {
      movingList.splice(movingList.indexOf(interactionId), 1)
    }
  },
}

function findChannel(member, guild) {
  if (guild.afkChannel) return guild.afkChannel
  const channels = guild.channels.cache

  return channels.find(v => v.type === ChannelType.GuildVoice
      && v.members.size === 0
      && v.permissionsFor(member)
        .has(PermissionsBitField.Flags.Connect))
    || channels.find(v => v !== member.voice.channel
      && v.type === ChannelType.GuildVoice
      && v.permissionsFor(member)
        .has(PermissionsBitField.Flags.Connect))
}
