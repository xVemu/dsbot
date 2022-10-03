'use strict'

const {ApplicationCommandOptionType} = require('discord.js')

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    options: [{
        type: ApplicationCommandOptionType.String,
        name: 'command',
        description: 'Command name',
        required: false,
        /*TODO choices: cmds.map((_, key) => ({
            name: key,
            value: key,
        })),*/
    }],
    async execute(msg, [command]) {
        const data = []
        const {cmds} = msg.client

        if (!command) {
            data.push('Here\'s a list of all my commands:')
            data.push(cmds.map(command => command.name).join(', '))
            data.push('\nYou can send `/help (command name)` to get info on a specific command!')

            return await msg.reply({content: data.join('\n'), ephemeral: true})
        }
        const name = command.value.toLowerCase()
        const cmd = cmds.get(name)

        if (!cmd) return await msg.reply({content: 'that\'s not a valid command!', ephemeral: true})

        data.push(`Name: ${cmd.name}`)

        if (cmd.description) data.push(`Description: ${cmd.description}`)
        if (cmd.options) data.push(`Params:\n${cmd.options
            .map(value => `${value.name} - ${value.description} - required ${value.required ? '✓' : '✗'}`)
            .join('\n')}`)

        await msg.reply({content: data.join('\n'), ephemeral: true})
    },
}