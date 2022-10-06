import { ApplicationCommandOptionType } from 'discord.js'

export default {
  name: 'random',
  description: 'Randomize number from the given range.',
  options: [{
    type: ApplicationCommandOptionType.Integer,
    name: 'range',
    description: 'Maximum number than can be rolled.',
    required: true,
  }],
  async execute(msg, [range]) {
    const maxNumber = range.value

    if (Number.isNaN(maxNumber)) return msg.reply('that doesn\'t seem to be a valid number.')

    const random = (Math.floor(Math.random() * maxNumber) + 1).toString()
    await msg.reply(random)
  },
}
