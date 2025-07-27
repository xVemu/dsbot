// import R6API from 'r6api.js'
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'

const platform = 'uplay'
/*const R6 = new R6API({
  email: config.r6mail,
  password: config.r6psw,
})*/

export default {
  name: 'r6',
  isCommand: false, // Disabled because none api work
  description: 'Sends info about player in Rainbow Six Siege.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'nick',
      description: 'player\'s nick',
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'operator',
      description: 'operator\'s name',
      required: false,
    },
  ],
  async execute(msg, [nickArg, operatorArg]) {
    try {
      await msg.deferReply()

      const [user] = await R6.findByUsername(platform, nickArg.value)
      if (user === undefined) {
        return msg.editReply({
          content: 'Player not found.',
          ephemeral: true,
        })
      }

      const [progression] = await R6.getProgression(platform, user.userId)
      const userStats = await R6.getStats(platform, user.userId, { categories: ['generalpvp', 'weaponspvp', 'operatorspvp'] })

      if (!userStats.length) {
        return msg.editReply({
          content: 'Player not found.',
          ephemeral: true,
        })
      }

      const { 0: { seasons } } = await R6.getRanks(platform, user.userId, {
        seasonIds: -1,
        boardIds: 'pvp_ranked',
      })

      const region = Object.values(seasons)[0].regions.emea.boards.pvp_ranked

      const statsEmbedded = operatorArg
        ? getOperatorStats({
          operatorName: operatorArg.value.toLowerCase(),
          username: user.username,
          operators: userStats[0].pvp.operators,
        }) : getUserStats({
          user,
          region,
          progression,
          pvp: userStats[0].pvp,
        })

      const embedded = new EmbedBuilder({
        color: 0x808080,
        author: {
          name: 'Rainbow Six Siege Stats',
          iconURL: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/05100836-b28d-4395-a29d-2f17b751c23f/dcenrbz-667b492e-2ff6-4433-8308-873fd3adba67.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzA1MTAwODM2LWIyOGQtNDM5NS1hMjlkLTJmMTdiNzUxYzIzZlwvZGNlbnJiei02NjdiNDkyZS0yZmY2LTQ0MzMtODMwOC04NzNmZDNhZGJhNjcucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.XIUJyFHUlKj59cIGEeTOmKwTdhKF1Ws810F4Bq4ff30',
        },
        footer: { text: 'Mover Bot' },
        timestamp: Date.now(),
        ...statsEmbedded,
      })

      await msg.editReply({ embeds: [embedded] })
    } catch (e) {
      if (e.message === 'Incorrect operator\'s name') {
        return msg.editReply(e.message)
      }
      throw e
    }
  },
}

function getUserStats({ user, region, progression, pvp }) {
  const { username, avatar } = user
  const { level, xp, lootboxProbability: { percent } } = progression
  const { general: { playtime, matches, deaths, kills, assists }, weapons, operators } = pvp

  const bestWeapon = Object.values(weapons)
    .flatMap(value => Object.values(value.list))
    .reduce((previousValue, currentValue) => (
      currentValue.kills > previousValue.kills ? currentValue : previousValue))

  const mostPlayedOperator = Object.values(operators)
    .reduce((previousValue, currentValue) => (
      currentValue.playtime > previousValue.playtime ? currentValue : previousValue))

  const statsMap = {
    Level: `${level} (${xp}XP)`,
    Playtime: getElapsedTime(playtime),
    Matches: matches,
    'K/D/A': `${kills}/${deaths}/${assists}`,
    Rank: region?.current.name ?? 'None',
    'Wins/Loses': region ? `${region.wins}/${region.losses}` : 'None',
    MMR: region?.current.mmr ?? 'None',
    'Best weapon': `${bestWeapon.name}, ${bestWeapon.kills}K`,
    'Most played operator': `${mostPlayedOperator.name}`,
    'LootBox Chance': percent,
  }

  const statsEmbedded = {
    title: username,
    fields: Object.entries(statsMap).map(([name, value]) => ({
      name,
      value: value.toString(),
      inline: true,
    })),
  }

  if (region) statsEmbedded.thumbnail = { url: avatar['146'] }

  return statsEmbedded
}

function getOperatorStats({ operatorName, username, operators }) {
  const operator = Object.values(operators)
    .find(({ name }) => name.toLowerCase() === operatorName)

  if (!operator) throw new Error('Incorrect operator\'s name')

  const statsMap = {
    Kills: operator.kills,
    Deaths: operator.deaths,
    Headshots: operator.headshots,
    'Wins/Loses': `${operator.wins}/${operator.losses}`,
    XP: operator.xp,
    Playtime: getElapsedTime(operator.playtime),
  }

  operator.uniqueAbility?.stats.forEach(({ name, value }) => { statsMap[name] = value })

  return {
    title: `${username} - ${operator.name}`,
    thumbnail: { url: operator.icon },
    fields: Object.entries(statsMap).map(([name, value]) => ({
      name,
      value: value.toString(),
      inline: true,
    })),
  }
}

function getElapsedTime(timestamp) {
  const time = new Date((timestamp % 86400) * 1000)
  // eslint-disable-next-line no-bitwise
  return `${(timestamp / 86400) | 0}d ${time.getUTCHours()}h ${time.getUTCMinutes()}m`
}
