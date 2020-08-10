`use strict`;

const LeagueJS = require(`leaguejs`);


const { lolKey } = require(`../../config.json`),
    { MessageEmbed } = require(`discord.js`),
    leagueJs = new LeagueJS(lolKey),
    queueTypes = {
        'RANKED_SOLO_5x5': `Solo/Duo: `,
        'RANKED_FLEX_SR': `Flex: `,
        'RANKED_FLEX_TT': `Flex 3v3: `,
        'RANKED_TFT': `TFT: `
    };

module.exports = {
    name: `lol`,
    description: `Sends info about player in League Of Legends.`,
    args: 1,
    usage: `<nick> (server[default: eune])`,
    guildOnly: false,
    async execute(msg, args) {
        try {
            const region = args[1] == `euw` ? `euw1` : `eun1`;
            const { id, name, summonerLevel, revisionDate } = await leagueJs.Summoner.gettingByName(args[0], region);
            const rank = await leagueJs.League.gettingEntriesForSummonerId(id, region);
            const embeded = new MessageEmbed()
                .setTitle(name)
                .setColor(0x0000ff)
                .setAuthor(`League Of Legends Stats`)
                .setThumbnail(`http://2.bp.blogspot.com/-HqSOKIIV59A/U8WP4WFW28I/AAAAAAAAT5U/qTSiV9UgvUY/s1600/icon.png`)
                .addField(`Level: `, summonerLevel)
                .addField(`Last online: `, timeConverter(revisionDate))
                .setFooter(`Mover Bot`);
            rank.forEach(v => {
                const { tier, rank, leaguePoints, wins, losses, queueType } = v;
                embeded.addField(queueTypes[queueType], `${tier} ${rank} ${leaguePoints}LP(${wins}W/${losses}P)`);
            });
            msg.channel.send(embeded);
        } catch (e) {
            if (e.message.startsWith(`Summoner name`)) msg.reply(e.message);
            else if (e.statusCode === 404) msg.reply(`Summoner not found!`);
            else {
                msg.reply(`Error has occurred!`);
                console.error(e);
            }
        }
    }
};

const timeConverter = UNIX_timestamp => {
    const a = new Date(UNIX_timestamp),
        months = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`],
        time = a.getDate() + ` ` + months[a.getMonth()] + ` ` + a.getFullYear() + ` ` + a.getHours() + `:` + a.getMinutes() + `:` + a.getSeconds();
    return time;
};