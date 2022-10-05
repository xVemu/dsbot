// CANARY  https://discord.com/api/oauth2/authorize?client_id=538290561677918233&permissions=16780352&scope=bot%20applications.commands
// https://discord.com/api/oauth2/authorize?client_id=516250691069804544&permissions=16780352&scope=bot%20applications.commands
const {
  Client,
  GatewayIntentBits,
  Collection,
} = require('discord.js')
const fs = require('fs')
const { token } = require('../config.json')

const client = new Client({
  presence: { activities: [{ name: 'Use /' }] },
  intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds],
})

client.cmds = new Collection()

const cmdFiles = fs
  .readdirSync('src/modules')
  .filter(file => file.endsWith('.js'))

cmdFiles.forEach(file => {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const cmd = require(`./modules/${file}`)
  client.cmds.set(cmd.name, cmd)
})

client.on('ready', async () => {
  console.log(`Logged in as
    \n${client.user.username}
    \n${client.user.id}`)
  // It's for testing on my server
  // await client.guilds.cache.get('501826205180231691').commands.set([...client.cmds.values()])
  await client.application?.commands.set([...client.cmds.values()])
})

client.on('interactionCreate', async interaction => {
  if (interaction.isButton()) {
    // eslint-disable-next-line no-return-await
    return await client.cmds.get(interaction.customId)
      .buttonClick(interaction)
  }
  if (!interaction.isChatInputCommand()) return

  const cmd = client.cmds.get(interaction.commandName)

  try {
    await cmd.execute(interaction, interaction.options.data)
  } catch (e) {
    console.error(e)
    if (interaction.deferred) return interaction.editReply('There was an error while executing this command!')

    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    })
  }
})

client.login(token)
