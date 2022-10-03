'use strict'

//CANARY  https://discord.com/api/oauth2/authorize?client_id=538290561677918233&permissions=16780352&scope=bot%20applications.commands
// https://discord.com/api/oauth2/authorize?client_id=516250691069804544&permissions=16780352&scope=bot%20applications.commands
const {Client, GatewayIntentBits, Collection} = require('discord.js')
const fs = require('fs')
const {token} = require('../config.json')

const client = new Client({
    presence: {
        activities: [{
            name: 'Use /',
        }],
    },
    intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds],
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
    if (!interaction.isChatInputCommand()) return

    const cmd = client.cmds.get(interaction.commandName)

    // if (cmd.guildOnly && interaction.channel.type === ChannelType.DM) return await interaction.reply('I can\'t execute that command inside DMs!')

    try {
        await cmd.execute(interaction, interaction.options.data)
    } catch (e) {
        console.error(e)
        await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
    }
})

client.login(token)
