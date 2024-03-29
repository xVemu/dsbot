import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'
import Axios from 'axios'
import config from '../config.cjs'

const axios = Axios.create({ headers: { 'X-Riot-Token': config.lolKey } })

const regions = {
  BR: 'br1',
  EUNE: 'eun1',
  EUW: 'euw1',
  JP: 'jp1',
  KR: 'kr',
  LAN: 'la1',
  LAS: 'la2',
  NA: 'na1',
  OC: 'oc1',
  RU: 'ru',
  TR: 'tr1',
}

const queueTypes = {
  RANKED_SOLO_5x5: 'Solo/Duo: ',
  RANKED_FLEX_SR: 'Flex: ',
  RANKED_TFT: 'TFT: ',
}

export default {
  name: 'lol',
  description: 'Sends info about player in League Of Legends.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'nick',
      description: 'player\'s nick',
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'server',
      description: 'For example EUNE or EUW',
      required: false,
      choices: Object.keys(regions).map(value => ({
        name: value,
        value,
      })),
    },
  ],
  async execute(msg, [nameArg, regionArg]) {
    try {
      await msg.deferReply()

      const region = regions[regionArg?.value.toUpperCase()] ?? regions.EUNE
      const baseURL = `https://${region}.api.riotgames.com/`
      const { data: { id, name, summonerLevel, profileIconId } } = await axios.get(`${baseURL}lol/summoner/v4/summoners/by-name/${nameArg.value}`)
      const { data: rankList } = await axios.get(`${baseURL}lol/league/v4/entries/by-summoner/${id}`)

      const embedded = new EmbedBuilder({
        title: name,
        color: 0x10B5BF,
        author: { name: 'League Of Legends Stats' },
        thumbnail: { url: `https://ddragon.leagueoflegends.com/cdn/12.18.1/img/profileicon/${profileIconId}.png` },
        footer: { text: 'Mover Bot' },
        fields: [{
          name: 'Level: ',
          value: summonerLevel.toString(),
        }, ...rankList.map(({
          tier,
          rank,
          leaguePoints,
          wins,
          losses,
          queueType,
        }) => ({
          name: queueTypes[queueType],
          value: `${tier} ${rank} ${leaguePoints}LP(${wins}W/${losses}P)`,
        }))],
      })

      await msg.editReply({ embeds: [embedded] })
    } catch (e) {
      if (e.response.status === 404) return msg.editReply('Summoner not found!')
      throw e
    }
  },
}
