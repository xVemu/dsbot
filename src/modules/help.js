import { ApplicationCommandOptionType } from 'discord.js'

export default {
  name: 'help',
  description: 'List all of my commands or info about a specific command.',
  options: [{
    type: ApplicationCommandOptionType.String,
    name: 'command',
    description: 'Command name',
    required: false,
    /* TODO choices: cmds.map((_, key) => ({
            name: key,
            value: key,
        })), */
  }],
  async execute(msg, [command]) {
    const data = []
    const { cmds } = msg.client

    if (!command) {
      data.push('Here\'s a list of all my commands:')
      data.push(cmds.keys().map(({ name }) => name).toArray().join(', '))
      data.push('\nYou can send `/help (command name)` to get info on a specific command!')

      return msg.reply({
        content: data.join('\n'),
        ephemeral: true,
      })
    }

    const name = command.value.toLowerCase()
    const cmd = cmds.get(name)

    if (!cmd) {
      return msg.reply({
        content: 'That\'s not a valid command!',
        ephemeral: true,
      })
    }

    data.push(`Name: ${cmd.name}`)

    if (cmd.description) data.push(`Description: ${cmd.description}`)
    if (cmd.options) {
      data.push(`Params:\n${cmd.options
        .map(value => `${value.name} - ${value.description} - required ${value.required ? '✓' : '✗'}`)
        .join('\n')}`)
    }

    await msg.reply({
      content: data.join('\n'),
      ephemeral: true,
    })
  },
}
