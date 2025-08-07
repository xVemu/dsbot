import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  InteractionContextType,
  MessageFlags,
  PermissionsBitField,
} from 'discord.js'
import { promisify } from 'util'

const sleep = promisify(setTimeout)

export default {
  name: 'move',
  description: 'Hey, wake up!',
  contexts: [InteractionContextType.Guild],
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
      description: 'Delay between moving in seconds',
      required: false,
    },
  ],
  async execute(msg, [{ member }, delayArg]) {
    const delay = delayArg ? delayArg.value * 1000 : 1000

    if (!member.voice.selfDeaf) {
      return msg.reply({
        content: 'User isn\'t self deafen!',
        flags: MessageFlags.Ephemeral,
      })
    }

    const memberChannel = member.voice.channel

    const movingChannel = findChannel(member, msg.guild)

    if (!movingChannel) {
      return msg.reply({
        content: 'Haven\'t found right channel!',
        flags: MessageFlags.Ephemeral,
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

    const {
      resource:
        {
          message:
            {
              interaction: {
                id: interactionId,
              },
            },
        },
    } = await msg.reply({
      content: `Moving ${member}!`,
      components: [row],
      withResponse: true,
    })

    const { client: { movingSet } } = msg
    movingSet.add(interactionId)

    let channel = movingChannel

    try {
      while (member.voice.selfDeaf && movingSet.has(interactionId)) {
        /* eslint-disable no-await-in-loop */
        await member.voice.setChannel(channel, 'Hey, wake up!')
        channel = channel === memberChannel ? movingChannel : memberChannel
        await sleep(delay)
      }
      /* eslint-enable no-await-in-loop */
      await member.voice.setChannel(memberChannel, 'Hey, wake up!')
      await msg.deleteReply().catch(() => {})
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
      movingSet.delete(interactionId)
    }
  },
}

function findChannel(member, guild) {
  if (guild.afkChannel) return guild.afkChannel
  const channels = guild.channels.cache.values()

  let secondBest

  for (const ch of channels) {
    // Skip if it's not a voice channel or a member can't connect to it.
    if (ch.type !== ChannelType.GuildVoice || !ch.permissionsFor(member)
      .has(PermissionsBitField.Flags.Connect)) continue

    if (ch.members.size === 0) return ch

    // If couldn't find an empty channel.
    // Find a channel which the member is not connected to
    if (ch !== member.voice.channel) secondBest = ch
  }

  return secondBest
}

// Only for tests
export const __testChannel = findChannel
