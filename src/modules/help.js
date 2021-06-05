'use strict'

const { prefix } = require('../../config.json')
// const cmds = require('../index')
module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    guildOnly: false,
    options: [{
        type: 'STRING',
        name: 'command',
        description: 'Command name',
        required: false,
        /*TODO choices: cmds.map((_, key) => ({
            name: key,
            value: key,
        })),*/
    }],
    async execute(msg, args) {
        const data = []
        const { cmds } = msg.client

        if (!args.length) {
            data.push('Here\'s a list of all my commands:')
            data.push(cmds.map(command => command.name).join(', '))
            data.push(`\nYou can send \`${prefix}help (command name)\` to get info on a specific command!`)

            return await msg.reply(data.join('\n'), { ephemeral: true })
        }
        const name = (args[0].value ?? args[0]).toLowerCase()
        const cmd = cmds.get(name)

        if (!cmd) {
            return await msg.reply('that\'s not a valid command!', { ephemeral: true })
        }

        data.push(`Name: ${cmd.name}`)

        if (cmd.description) data.push(`Description: ${cmd.description}`)
        if (cmd.options) data.push(`Params:\n${cmd.options
            .map(value => `${value.name} - ${value.description} - required ${value.required ? '✅' : '❌'}`)
            .join('\n')}`)

        await msg.reply(data.join('\n'), { ephemeral: true })
    },
}