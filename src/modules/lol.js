'use strict'

const { lolKey } = require('../../config.json'),
    axios = require('axios').create({
        headers: {'X-Riot-Token': lolKey},
    }),
    { MessageEmbed } = require('discord.js')

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
    'default':'eun1',
}
const queueTypes = {
    'RANKED_SOLO_5x5': 'Solo/Duo: ',
    'RANKED_FLEX_SR': 'Flex: ',
    'RANKED_TFT': 'TFT: ',
}
//TODO RGAPI-59bd6cf2-9bb8-4636-8725-66a4745a75c9
module.exports = {
    name: 'lol',
    description: 'Sends info about player in League Of Legends.',
    options: [
        {
            type: 'STRING',
            name: 'nick',
            description: 'player\'s nick',
            required: true,
        },
        {
            type: 'STRING',
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
            const region = regions[((regionArg?.value ?? regionArg) ?? 'EUNE').toUpperCase()] ?? regions['default']
            const nick = nameArg.value ?? nameArg
            const baseURL = `https://${region}.api.riotgames.com/`
            const { data: {id, name, summonerLevel }} = await axios.get(`${baseURL}lol/summoner/v4/summoners/by-name/${nick}`)
            const {data: rank} = await axios.get(`${baseURL}lol/league/v4/entries/by-summoner/${id}`)
            rank.push(...(await axios.get(`${baseURL}tft/league/v1/entries/by-summoner/${id}`)).data)
            const embedded = new MessageEmbed()
                .setTitle(name)
                .setColor(0x10B5BF)
                .setAuthor('League Of Legends Stats')
                .setThumbnail('https://2.bp.blogspot.com/-HqSOKIIV59A/U8WP4WFW28I/AAAAAAAAT5U/qTSiV9UgvUY/s1600/icon.png')
                .addField('Level: ', summonerLevel)
                .setFooter('Mover Bot')
            rank.forEach(({ tier, rank, leaguePoints, wins, losses, queueType }) => {
                embedded.addField(queueTypes[queueType], `${tier} ${rank} ${leaguePoints}LP(${wins}W/${losses}P)`)
            })
            await msg.reply(embedded)
        } catch (e) {
            await msg.reply(e.statusCode === 404 ? 'Summoner not found!' : 'Error has occurred!', {ephemeral: true})
            console.error(e)
        }
    },
}