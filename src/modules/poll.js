import { ApplicationCommandOptionType } from "discord.js"

export default {
  name: "poll",
  description: "Creates a simple poll.",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "option1",
      description: "1st option",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "option2",
      description: "2nd option",
      required: true,
    },
  ],
  async execute(msg, [option1, option2]) {
    const message = `✅ - ${option1.value} \n❌ - ${option2.value}`
    const {
      resource: { message: sent },
    } = await msg.reply({
      content: message,
      withResponse: true,
    })
    await sent.react("✅")
    await sent.react("❌")
  },
}
