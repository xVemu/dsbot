'use strict'

const R6API = require('r6api.js').default,
    {EmbedBuilder, CommandInteraction, ApplicationCommandOptionType} = require('discord.js'),
    {r6mail, r6psw} = require('../../config.json'),
    platform = 'uplay',
    R6 = new R6API({
        email: r6mail,
        password: r6psw,
    })

module.exports = {
    name: 'r6',
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
            if (msg instanceof CommandInteraction) await msg.deferReply()
            const {0: {userId, username, avatar}} = await R6.findByUsername(platform, nickArg.value),
                {0: {level, xp, lootboxProbability: {percent}}} = await R6.getProgression(platform, userId),
                {
                    0: {
                        pvp: {
                            general,
                            weapons,
                            operators,
                        },
                    },
                } = await R6.getStats(platform, userId, {categories: ['generalpvp', 'weaponspvp', 'operatorspvp']}),
                {0: {seasons}} = await R6.getRanks(platform, userId, {seasonIds: -1, boardIds: 'pvp_ranked'}),
                region = Object.values(seasons)[0].regions.emea.boards.pvp_ranked
            let stats = {}
            const embedded = new EmbedBuilder({
                color: 0x808080,
                author: {
                    name: 'Rainbow Six Siege Stats',
                    iconURL: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/05100836-b28d-4395-a29d-2f17b751c23f/dcenrbz-667b492e-2ff6-4433-8308-873fd3adba67.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzA1MTAwODM2LWIyOGQtNDM5NS1hMjlkLTJmMTdiNzUxYzIzZlwvZGNlbnJiei02NjdiNDkyZS0yZmY2LTQ0MzMtODMwOC04NzNmZDNhZGJhNjcucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.XIUJyFHUlKj59cIGEeTOmKwTdhKF1Ws810F4Bq4ff30',
                },
                footer: {
                    text: 'Mover Bot',
                },
                timestamp: Date.now(),
            })
            if (operatorArg) {
                const operator = Object.values(operators).find(operator => operator.name === operatorArg.value)
                embedded.setTitle(`${username}/${operator.name}`).setThumbnail(operator.icon)
                const time = parseInt(operator.playtime / 86400) + 'd ' + (new Date(operator.playtime % 86400 * 1000)).toUTCString().replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, '$1h $2m $3s')
                stats = {
                    Kills: operator.kills,
                    Deaths: operator.deaths,
                    Headshots: operator.headshots,
                    'Wins/Loses': `${operator.wins}/${operator.losses}`,
                    XP: operator.xp,
                    Playtime: time,
                }
                operator.uniqueAbility?.stats.forEach(gadget => stats[gadget.name] = gadget.value)
            } else {
                embedded.setTitle(username)
                if (region) embedded.setThumbnail(avatar['146'])
                const time = parseInt(general.playtime / 86400) + 'd ' + (new Date(general.playtime % 86400 * 1000)).toUTCString().replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, '$1h $2m $3s')
                const bestWeapon = Object.values(weapons).map(value => Object.values(value.list)).flat()
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
            const fields = Object.entries(stats).map(([name, value]) => ({name, value: value.toString(), inline: true}))
            embedded.addFields(fields)
            if (msg instanceof CommandInteraction)
                return await msg.editReply({embeds: [embedded]})
            await msg.reply({embeds: [embedded]})
        } catch (e) {
            if (e === 'Cannot read property \'userId\' of undefined') await msg.reply('Player not found')
            else if (e === 'Cannot read property \'name\' of undefined') await msg.reply('Uncorrect operator\'s name')
            throw new Error('r6 api error')
        }
    },
}