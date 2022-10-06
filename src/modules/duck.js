import axios from 'axios'

export default {
  name: 'duck',
  description: 'Sends random duck picture.',
  async execute(msg) {
    await msg.deferReply()
    const { data: { url } } = await axios.get('https://random-d.uk/api/random')
    await msg.editReply({ files: [url] })
  },
}
