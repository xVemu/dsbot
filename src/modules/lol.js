'use strict'

const {lolKey} = require('../../config.json'),
    axios = require('axios').create({
        headers: {'X-Riot-Token': lolKey},
    }),
    {MessageEmbed} = require('discord.js')

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
            const region = regions[((regionArg?.value ?? regionArg))?.toUpperCase()] ?? regions['EUNE']
            const nick = nameArg.value ?? nameArg
            const baseURL = `https://${region}.api.riotgames.com/`
            const {
                data: {
                    id,
                    name,
                    summonerLevel,
                },
            } = await axios.get(`${baseURL}lol/summoner/v4/summoners/by-name/${nick}`)
            const {data: rank} = await axios.get(`${baseURL}lol/league/v4/entries/by-summoner/${id}`)
            const embedded = new MessageEmbed()
                .setTitle(name)
                .setColor(0x10B5BF)
                .setAuthor({name: 'League Of Legends Stats'})
                .setThumbnail('https://2.bp.blogspot.com/-HqSOKIIV59A/U8WP4WFW28I/AAAAAAAAT5U/qTSiV9UgvUY/s1600/icon.png')
                .addField('Level: ', summonerLevel.toString())
                .setFooter({text: 'Mover Bot'})
            rank.forEach(({tier, rank, leaguePoints, wins, losses, queueType}) => {
                embedded.addField(queueTypes[queueType], `${tier} ${rank} ${leaguePoints}LP(${wins}W/${losses}P)`)
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