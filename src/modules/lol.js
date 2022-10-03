'use strict'

const {lolKey} = require('../../config.json'),
    axios = require('axios').create({
        headers: {'X-Riot-Token': lolKey},
    }),
    {EmbedBuilder, ApplicationCommandOptionType} = require('discord.js')

const regions = {
    'BR': 'br1',
    'EUNE': 'eun1',
    'EUW': 'euw1',
    'JP': 'jp1',
    'KR': 'kr',
    'LAN': 'la1',
    'LAS': 'la2',
    'NA': 'na1',
    'OC': 'oc1',
    'RU': 'ru',
    'TR': 'tr1',
}
const queueTypes = {
    'RANKED_SOLO_5x5': 'Solo/Duo: ',
    'RANKED_FLEX_SR': 'Flex: ',
    'RANKED_TFT': 'TFT: ',
}

module.exports = {
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
                value: value,
            })),
        },
    ],
    guildOnly: false,
    async execute(msg, [nameArg, regionArg]) {
        try {
            const region = regions[((regionArg?.value ?? regionArg))?.toUpperCase()] ?? regions['EUNE']
            const nick = nameArg.value ?? nameArg
            const baseURL = `https://${region}.api.riotgames.com/`
            const {
                data: {
                    id,
                    name,
                    summonerLevel,
                    profileIconId,
                },
            } = await axios.get(`${baseURL}lol/summoner/v4/summoners/by-name/${nick}`)
            const {data: rank} = await axios.get(`${baseURL}lol/league/v4/entries/by-summoner/${id}`)
            const embedded = new EmbedBuilder({
                title: name,
                color: 0x10B5BF,
                author: {
                    name: 'League Of Legends Stats',
                },
                thumbnail: {
                    url: `https://ddragon.leagueoflegends.com/cdn/12.18.1/img/profileicon/${profileIconId}.png`,
                },
                footer: {
                    text: 'Mover Bot',
                },
                fields: [{name: 'Level: ', value: summonerLevel.toString()}, ...rank.map(({
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
            await msg.reply({embeds: [embedded]})
        } catch (e) {
            if (e.response.status === 404)
                return await msg.reply({content: 'Summoner not found!', ephemeral: true})
            await msg.reply({content: 'Error has occurred!', ephemeral: true})
            console.error(e)
        }
    },
}