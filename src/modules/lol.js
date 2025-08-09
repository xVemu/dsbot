/** biome-ignore-all lint/style/useNamingConvention: Constants are in uppercase */
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js"
import config from "../../config.json"
import { fetchJson } from "../utils.js"

const regions = {
  BR: "br1",
  EUNE: "eun1",
  EUW: "euw1",
  JP: "jp1",
  KR: "kr",
  LAN: "la1",
  LAS: "la2",
  NA: "na1",
  OC: "oc1",
  RU: "ru",
  TR: "tr1",
  TW: "TW2",
  VN: "VN2",
}

const queueTypes = {
  RANKED_SOLO_5x5: "Solo/Duo: ",
  RANKED_FLEX_SR: "Flex: ",
  RANKED_TFT: "TFT: ",
}

const latestPatch = await fetchJson(
  "https://ddragon.leagueoflegends.com/api/versions.json",
).then(res => res[0])

export default {
  name: "lol",
  description: "Sends info about player in League Of Legends.",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "nick",
      description: "player's nick with tag",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "server",
      description: "For example EUNE or EUW",
      required: false,
      choices: Object.keys(regions).map(value => ({
        name: value,
        value,
      })),
    },
  ],
  async execute(msg, [nameArg, regionArg]) {
    await msg.deferReply()

    const [nick, tag] = nameArg.value.split("#")
    const region = regions[regionArg?.value.toUpperCase()] ?? regions.EUNE
    const baseURL = `https://${region}.api.riotgames.com/`

    const { puuid } = await fetchJson(
      `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${nick}/${tag}?api_key=${config.lolKey}`,
    )
    const { summonerLevel, profileIconId } = await fetchJson(
      `${baseURL}lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${config.lolKey}`,
    )

    if (!summonerLevel) return msg.editReply("Summoner not found!")

    const rankList = await fetchJson(
      `${baseURL}lol/league/v4/entries/by-puuid/${puuid}?api_key=${config.lolKey}`,
    )

    const embedded = new EmbedBuilder({
      title: nameArg.value,
      // biome-ignore lint/nursery/useNumericSeparators: Easier to copy and paste to see color
      color: 0x10b5bf,
      author: { name: "League Of Legends Stats" },
      thumbnail: {
        url: `https://ddragon.leagueoflegends.com/cdn/${latestPatch}/img/profileicon/${profileIconId}.png`,
      },
      footer: { text: "Mover Bot" },
      fields: [
        {
          name: "Level: ",
          value: summonerLevel.toString(),
        },
        ...rankList.map(
          ({ tier, rank, leaguePoints, wins, losses, queueType }) => ({
            name: queueTypes[queueType],
            value: `${tier} ${rank} ${leaguePoints}LP - ${Math.round(
              (wins / (losses + wins)) * 100,
            )}% WR (${wins}W/${losses}L)`,
          }),
        ),
      ],
    })

    await msg.editReply({ embeds: [embedded] })
  },
}
