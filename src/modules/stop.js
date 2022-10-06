export default {
  name: 'stop',
  description: 'Stops moving!',
  isCommand: false,
  async execute(msg) {
    // eslint-disable-next-line global-require
    require('./move').shouldMoving = false
    await msg.message.delete()
  },
}
