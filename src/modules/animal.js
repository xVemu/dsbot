import { ApplicationCommandOptionType } from 'discord.js'
import { fetchJson } from '../utils.js'

const types = new Map([
  ['cat', cat],
  ['dog', dog],
  ['duck', duck],
  ['fox', fox],
])

export default {
  name: 'animal',
  description: 'Sends random animal picture.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'type',
      description: 'Animal type',
      required: true,
      choices: types.keys().map(name => ({
        name,
        value: name,
      })).toArray(),
    },
  ],
  async execute(msg, [type]) {
    await msg.deferReply()
    const imageUrl = await types.get(type.value)()
    await msg.editReply({files: [imageUrl]})
  },
}

function dog() {
  return fetchJson('https://api.thedogapi.com/v1/images/search').then(res => res[0].url)
}

function duck() {
  return fetchJson('https://random-d.uk/api/random').then(res => res.url)
}

function fox() {
  return fetchJson('https://randomfox.ca/floof/').then(res => res.image)
}

function cat() {
  return fetchJson('https://api.thecatapi.com/v1/images/search').then(res => res[0].url)
}
