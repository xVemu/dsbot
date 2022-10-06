// CANARY  https://discord.com/api/oauth2/authorize?client_id=538290561677918233&permissions=16780352&scope=bot%20applications.commands
// https://discord.com/api/oauth2/authorize?client_id=516250691069804544&permissions=16843840&scope=applications.commands%20bot
import { Client, Collection, GatewayIntentBits } from 'discord.js'
import fs from 'fs'
import config from './config.cjs'

const client = new Client({
  presence: { activities: [{ name: 'Use /' }] },
  intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds],
})

client.cmds = new Collection()

const cmdFiles = fs
  .readdirSync('src/modules')
  .filter(file => file.endsWith('.js'))

cmdFiles.forEach(async file => {
  const { default: cmd } = await import(`./modules/${file}`)
  client.cmds.set(cmd.name, cmd)
})

client.on('ready', async () => {
  console.log(`Logged in as
    \n${client.user.username}
    \n${client.user.id}`)
  // It's for testing on my server
  /* await client.guilds.cache.get('501826205180231691').commands.set([...client.cmds
    .filter(cmd => cmd.isCommand ?? true).values()]) */
  await client.application?.commands.set([...client.cmds
    .filter(cmd => cmd.isCommand ?? true).values()])
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand() && !interaction.isButton()) return

  const cmd = client.cmds.get(interaction.isButton()
    ? interaction.customId
    : interaction.commandName)

  try {
    await cmd.execute(interaction, interaction.options?.data)
  } catch (e) {
    console.error(e)
    if (interaction.deferred) return interaction.editReply('There was an error while executing this command!')

    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    })
  }
})

client.login(config.token)
