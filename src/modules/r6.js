'use strict'

const R6API = require('r6api.js'),
    { MessageEmbed } = require('discord.js'),
    { r6mail, r6psw } = require('../../config.json'),
    platform = 'uplay',
    R6 = new R6API(r6mail, r6psw)
const {CommandInteraction} = require('discord.js')

module.exports = {
    name: 'r6',
    description: 'Sends info about player in Rainbow Six Siege.',
    guildOnly: false,
    options: [
        {
            type: 'STRING',
            name: 'nick',
            description: 'player\'s nick',
            required: true,
        },
        {
            type: 'STRING',
            name: 'operator',
            description: 'operator\'s name',
            required: false,
        },
    ],
    async execute(msg, [nickArg, operatorArg]) {
        try {
            if (msg instanceof CommandInteraction) await msg.defer()
            const nick = nickArg.value ?? nickArg
            const operatorName = operatorArg?.value ?? operatorArg
            const { 0: { userId, username } } = await R6.getId(platform, nick),
                { 0: { level, xp, lootboxProbability: {percent} } } = await R6.getLevel(platform, userId),
                { 0: { pvp: { general, weapons, operators } } } = await R6.getStats(platform, userId),
                { 0: { seasons } } = await R6.getRank(platform, userId),
                { 0: { regions } } = Object.values(seasons),
                [region] = Object.values(regions).filter(v => v.updateTime !== '1970-01-01T00:00:00+00:00')
            let stats = {}, gadgets
            const embedded = new MessageEmbed()
                .setColor(0x808080)
                .setAuthor('Rainbow Six Siege Stats', 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/05100836-b28d-4395-a29d-2f17b751c23f/dcenrbz-667b492e-2ff6-4433-8308-873fd3adba67.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzA1MTAwODM2LWIyOGQtNDM5NS1hMjlkLTJmMTdiNzUxYzIzZlwvZGNlbnJiei02NjdiNDkyZS0yZmY2LTQ0MzMtODMwOC04NzNmZDNhZGJhNjcucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.XIUJyFHUlKj59cIGEeTOmKwTdhKF1Ws810F4Bq4ff30')
                .setFooter('Mover Bot')
                .setTimestamp()
            if (operatorName) {
                const operator = operators[operatorName.toLowerCase()]
                embedded.setTitle(`${username}/${operator.name}`).setThumbnail(operator.badge)
                const time = parseInt(operator.playtime / 86400) + 'd ' + (new Date(operator.playtime % 86400 * 1000)).toUTCString().replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, '$1h $2m $3s')
                stats = {
                    Kills: operator.kills,
                    Deaths: operator.deaths,
                    Headshots: operator.headshots,
                    'Wins/Loses': `${operator.wins}/${operator.losses}`,
                    XP: operator.xp,
                    Playtime: time,
                }
                gadgets = new Map()
                for (const gadget of operator.gadget) {
                    gadgets.set(gadget.name, gadget.value)
                }
            } else if (nick) {
                embedded.setTitle(username)
                if (region) embedded.setThumbnail(region.current.image)
                const time = parseInt(general.playtime / 86400) + 'd ' + (new Date(general.playtime % 86400 * 1000)).toUTCString().replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, '$1h $2m $3s')
                const bestWeapon = Object.values(weapons).map(value => value.list).flat()
                    .reduce((previousValue, currentValue) =>
                        currentValue.kills > previousValue.kills ? currentValue : previousValue)
                const mostPlayedOp = Object.values(operators)
                    .reduce((previousValue, currentValue) =>
                        currentValue.playtime > previousValue.playtime ? currentValue : previousValue)
                stats = {
                    Level: `${level} (${xp}XP)`,
                    Playtime: time,
                    Matches: general.matches,
                    'K/D/A': `${general.kills}/${general.deaths}/${general.assists}`,
                    Rank: region ? region.current.name : 'None',
                    'Wins/Loses': region ? `${region.wins}/${region.losses}` : 'None',
                    MMR: region ? region.current.mmr : 'None',
                    'Best weapon': `${bestWeapon.name}, ${bestWeapon.kills}K`,
                    'Most played operator': `${mostPlayedOp.name}`,
                    'Lootbox Chance': percent,
                }
            }
            for (const [key, value] of Object.entries(stats)) {
                embedded.addField(key, value, true)
            }
            if (gadgets) {
                for (const [key, value] of gadgets) {
                    embedded.addField(key, value, true)
                }
            }
            if (msg instanceof CommandInteraction) await msg.editReply(embedded)
            else await msg.reply(embedded)
        } catch (e) {
            if (e === 'Cannot destructure property `userId` of \'undefined\' or \'null\'.') await msg.reply('Player not found')
            else if (e === 'Cannot read property \'name\' of undefined') await msg.reply('Uncorrect operator\'s name')
            else {
                await msg.reply('Error has occurred')
                console.error(e)
            }
        }
    },
}