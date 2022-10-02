'use strict'

//CANARY  https://discord.com/api/oauth2/authorize?client_id=538290561677918233&permissions=16780352&scope=bot%20applications.commands
// https://discord.com/api/oauth2/authorize?client_id=516250691069804544&permissions=16780352&scope=bot%20applications.commands
const {Client, GatewayIntentBits, Partials, Collection} = require('discord.js'),
    fs = require('fs'),
    {token, prefix} = require('../config.json'),
    client = new Client({
        presence: {
            activities: [
                {
                    name: `Prefix: / or ${prefix}`,
                },
            ],
        },
        intents: [
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
        ],
        partials: [
            Partials.Channel,
        ],
    })

client.cmds = new Collection()

const cmdFiles = fs.readdirSync('src/modules').filter(file => file.endsWith('.js'))

for (const file of cmdFiles) {
    const cmd = require(`./modules/${file}`)
    client.cmds.set(cmd.name, cmd)
}

client.on('ready', async () => {
    console.log(`Logged in as
    \n${client.user.username}
    \n${client.user.id}`)
    // await client.guilds.cache.get('501826205180231691').commands.set([...client.cmds.values()]) //It's for testing on my server
    await client.application?.commands.set([...client.cmds.values()])
})

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) return await client.cmds.get(interaction.customId).buttonClick(interaction)
    if (!interaction.isCommand()) return
    const cmd = client.cmds.get(interaction.commandName)
    if (cmd.guildOnly && interaction.channel.type === 'DM') return await interaction.reply('I can\'t execute that command inside DMs!')
    await cmd.execute(interaction, interaction.options.data)
})

client.on('messageCreate', async msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return
    const argu = msg.content.slice(prefix.length).match(/[^\s"']+|"([^"]*)"/gmi)
    if (!argu) return
    const args = argu.map(v => v.replace(/["']/g, ''))
    const cmdName = args.shift().toLowerCase()
    const cmd = client.cmds.get(cmdName)
    if (!cmd) return
    if (cmd.guildOnly && msg.channel.type === 'DM') return msg.reply('I can\'t execute that command inside DMs!')
    if (args.length < cmd.options?.filter(v => v.required).length) return msg.reply('You didn\'t provide enough arguments!')

    try {
        cmd.execute(msg, args)
    } catch (e) {
        console.error(e)
    }
})

client.login(token)
