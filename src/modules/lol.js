`use strict`;

const LeagueJS = require(`leaguejs`);


const { lolKey } = require(`../../config.json`),
    { MessageEmbed } = require(`discord.js`),
    leagueJs = new LeagueJS(lolKey);

module.exports = async (_, split) => {
    let region = ``;
    split[1] == `euw` ? region = `euw1` : region = `eun1`;
    const { id, name, summonerLevel, revisionDate } = await leagueJs.Summoner.gettingByName(split[0], region);
    const rank = await leagueJs.League.gettingEntriesForSummonerId(id, region);
    const embeded = new MessageEmbed()
        .setTitle(name)
        .setColor(0x0000ff)
        .setAuthor(`League Of Legends Stats`)
        .setThumbnail(`http://2.bp.blogspot.com/-HqSOKIIV59A/U8WP4WFW28I/AAAAAAAAT5U/qTSiV9UgvUY/s1600/icon.png`)
        .addField(`Level: `, summonerLevel)
        .addField(`Last online: `, timeConverter(revisionDate));
    const queueTypes = {
        'RANKED_SOLO_5x5': `Solo/Duo: `,
        'RANKED_FLEX_SR': `Flex: `,
        'RANKED_FLEX_TT': `Flex 3v3: `,
        'RANKED_TFT': `TFT: `
    };
    rank.forEach(v => {
        const { tier, rank, leaguePoints, wins, losses, queueType } = v;
        embeded.addField(queueTypes[queueType], `${tier} ${rank} ${leaguePoints}LP(${wins}W/${losses}P)`);
    });
    return embeded;
};

const timeConverter = UNIX_timestamp => {
    const a = new Date(UNIX_timestamp),
        months = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`],
        time = a.getDate() + ` ` + months[a.getMonth()] + ` ` + a.getFullYear() + ` ` + a.getHours() + `:` + a.getMinutes() + `:` + a.getSeconds();
    return time;
};