import { fetchJson } from "../utils.js"

export default {
  name: "meme",
  description: "Sends random meme.",
  async execute(msg) {
    if (!msg.deferred) await msg.deferReply()
    const { nsfw, url, title } = await fetchJson("https://meme-api.com/gimme")
    if (nsfw && !msg.channel.nsfw) return this.execute(msg)

    await msg.editReply({
      content: title,
      files: [url],
    })
  },
}
