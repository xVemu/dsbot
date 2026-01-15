import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  MessageFlags,
} from "discord.js"
import * as r6 from "r6-data.js"
import { runCatching } from "../utils.js"
import { r6dataEUkey } from "../../config.json"

const platform = "uplay"
const platformFamilies = "pc"

export default {
  name: "r6",
  isCommand: true,
  description: "Sends info about player in Rainbow Six Siege.",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "nick",
      description: "player's nick",
      required: true,
    },
  ],
  async execute(msg, [nickArg]) {
    try {
      await msg.deferReply()

      const nick = nickArg.value

      const [err, { level, profilePicture }] = await runCatching(
        r6.getAccountInfo(r6dataEUkey, { platformType: platform, nameOnPlatform: nick }),
      )

      if (err?.status === 404 || err?.status === 400)
        return msg.editReply("Player not found.")
      if (err !== undefined) {
        // noinspection ExceptionCaughtLocallyJS
        throw err
      }

      const stats = await r6
        .getPlayerStats(r6dataEUkey, {
          platformType: platform,
          nameOnPlatform: nickArg.value,
          platform_families: platformFamilies,
          board_id: "ranked",
        })
        .then(
          body =>
            body.platform_families_full_profiles[0].board_ids_full_profiles[0]
              .full_profiles[0],
        )

      const rank = await r6
        .getSeasonalStats(r6dataEUkey, {
          platformType: platform,
          nameOnPlatform: nick,
        })
        .then(body => body.data.history.data[0]?.[1])

      const matches = stats.season_statistics.match_outcomes
      const kda = stats.season_statistics

      const statsMap = {
        Level: level,
        Rank: `${rank?.metadata?.rank}, ${rank?.value} MMR`,
        Matches: `${matches.losses + matches.wins} (${(
          (matches.wins / (matches.losses + matches.wins)) * 100
        ).toFixed(2)}% WR)`,
        "K/D": `${kda.kills}/${kda.deaths} (${(kda.kills / (kda.deaths || 1)).toFixed(2)})`,
      }

      // Values for a player who has not played in a while.
      if (rank === undefined) statsMap["Rank"] = "UNRANKED"
      if (matches.losses + matches.wins === 0) statsMap["Matches"] = "None"

      const statsEmbedded = {
        title: nick,
        thumbnail: { url: profilePicture },
        fields: Object.entries(statsMap).map(([name, value]) => ({
          name,
          value: value.toString(),
        })),
      }

      const embedded = new EmbedBuilder({
        color: 0x808080,
        author: {
          name: "Rainbow Six Siege Stats",
          iconURL:
            "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/05100836-b28d-4395-a29d-2f17b751c23f/dcenrbz-667b492e-2ff6-4433-8308-873fd3adba67.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzA1MTAwODM2LWIyOGQtNDM5NS1hMjlkLTJmMTdiNzUxYzIzZlwvZGNlbnJiei02NjdiNDkyZS0yZmY2LTQ0MzMtODMwOC04NzNmZDNhZGJhNjcucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.XIUJyFHUlKj59cIGEeTOmKwTdhKF1Ws810F4Bq4ff30",
        },
        footer: { text: "Mover Bot" },
        timestamp: Date.now(),
        ...statsEmbedded,
      })

      await msg.editReply({ embeds: [embedded] })
    } catch (e) {
      console.error("r6api:" + e)

      return msg.editReply("There was an error while executing this command!")
    }
  },
}

function getUserStats({ user, region, progression, pvp }) {
  const { username, avatar } = user
  const {
    level,
    xp,
    lootboxProbability: { percent },
  } = progression
  const {
    general: { playtime, matches, deaths, kills, assists },
    weapons,
    operators,
  } = pvp

  const bestWeapon = Object.values(weapons)
    .flatMap(value => Object.values(value.list))
    .reduce((previousValue, currentValue) =>
      currentValue.kills > previousValue.kills ? currentValue : previousValue,
    )

  const mostPlayedOperator = Object.values(operators).reduce(
    (previousValue, currentValue) =>
      currentValue.playtime > previousValue.playtime
        ? currentValue
        : previousValue,
  )

  const statsMap = {
    Level: `${level} (${xp}XP)`,
    Playtime: getElapsedTime(playtime),
    Matches: matches,
    "K/D/A": `${kills}/${deaths}/${assists}`,
    Rank: region?.current.name ?? "None",
    "Wins/Loses": region ? `${region.wins}/${region.losses}` : "None",
    MMR: region?.current.mmr ?? "None",
    "Best weapon": `${bestWeapon.name}, ${bestWeapon.kills}K`,
    "Most played operator": `${mostPlayedOperator.name}`,
    "LootBox Chance": percent,
  }

  const statsEmbedded = {
    title: username,
    fields: Object.entries(statsMap).map(([name, value]) => ({
      name,
      value: value.toString(),
      inline: true,
    })),
  }

  if (region) statsEmbedded.thumbnail = { url: avatar["146"] }

  return statsEmbedded
}

function getOperatorStats({ operatorName, username, operators }) {
  const operator = Object.values(operators).find(
    ({ name }) => name.toLowerCase() === operatorName,
  )

  if (!operator) throw new Error("Incorrect operator's name")

  const statsMap = {
    Kills: operator.kills,
    Deaths: operator.deaths,
    Headshots: operator.headshots,
    "Wins/Loses": `${operator.wins}/${operator.losses}`,
    XP: operator.xp,
    Playtime: getElapsedTime(operator.playtime),
  }

  operator.uniqueAbility?.stats.forEach(({ name, value }) => {
    statsMap[name] = value
  })

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
  return `${(timestamp / 86400) | 0}d ${time.getUTCHours()}h ${time.getUTCMinutes()}m`
}
