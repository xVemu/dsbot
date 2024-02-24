export default {
  name: 'stop',
  description: 'Stops moving!',
  isCommand: false,
  async execute(msg) {
    const { client: { movingList }, message: { interaction: { id: interactionId } } } = msg
    movingList.splice(movingList.indexOf(interactionId), 1)
    try {
      await msg.message.delete()
    } catch (e) { /* empty */
    }
  },
}
