import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'
import { fetchJson } from '../utils.js'

const types = new Map([
  ['cat', cat],
  ['dog', dog],
  ['useless', useless],
])

export default {
  name: 'fact',
  description: 'Sends random fact.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'type',
      description: 'Fact type',
      required: true,
      choices: types.keys().map(name => ({
        name,
        value: name,
      })).toArray(),
    },
  ],
  async execute(msg, [type]) {
    const fact = await types.get(type.value)()
    const embed = new EmbedBuilder({
      title: `Random ${type.value} fact!`,
      description: fact,
      color: 0x10B5BF,
      timestamp: Date.now(),
      footer: { text: 'Mover Bot' },
    })
    await msg.reply({ embeds: [embed] })
  },
}

function dog() {
  return fetchJson('https://dogapi.dog/api/v2/facts').then(res => res.data[0].attributes.body)
}

function useless() {
  return fetchJson('https://uselessfacts.jsph.pl/api/v2/facts/today').then(res => res.text)
}

function cat() {
  return fetchJson('https://meowfacts.herokuapp.com/').then(res => res.data[0])
}
