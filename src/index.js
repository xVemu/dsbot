// CANARY  https://discord.com/api/oauth2/authorize?client_id=538290561677918233&permissions=16780352&scope=bot%20applications.commands
// https://discord.com/api/oauth2/authorize?client_id=516250691069804544&permissions=16843840&scope=applications.commands%20bot
import { Client, GatewayIntentBits } from 'discord.js'
import config from '../config.json'
import { Glob } from 'bun'

const client = new Client({
  presence: { activities: [{ name: 'Use /' }] },
  intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds],
})

client.cmds = new Map()
client.movingSet = new Set()

for await (const file of new Glob('*.js').scan('src/modules')) {
  const { default: cmd } = await import(`./modules/${file}`)
  client.cmds.set(cmd.name, cmd)
}

client.on('ready', async () => {
  console.log(`Logged in as
    \n${client.user.username}
    \n${client.user.id}`)

  const commands = client.cmds.values().filter(cmd => cmd.isCommand !== false).toArray()

  if (process.env.NODE_ENV === 'production')
    return await client.application?.commands.set(commands)

  // It's for testing on my server
  await client.guilds.cache.get('501826205180231691').commands.set(commands)
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand() && !interaction.isButton()) return

  const cmd = client.cmds.get(interaction.isButton()
    ? interaction.customId
    : interaction.commandName)

  try {
    await cmd.execute(interaction, interaction.options?.data)
  } catch (e) {
    console.error({
      e,
      command: interaction.commandName,
      arguments: interaction.options?.data,
    })

    if (interaction.deferred) return interaction.editReply(
      'There was an error while executing this command!',
    )

    try {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    } catch (_) { /* empty */
    }
  }
})

// noinspection JSIgnoredPromiseFromCall
client.login(config.token)
