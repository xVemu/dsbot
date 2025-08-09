export default {
  name: "stop",
  description: "Stops moving!",
  isCommand: false,
  async execute(msg) {
    const {
      client: { movingSet },
      message: {
        interaction: { id: interactionId },
      },
    } = msg
    movingSet.delete(interactionId)
    await msg.message.delete().catch(() => {})
  },
}
