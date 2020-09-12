`use strct`;

const R6StatsAPI = require(`r6api.js`),
    { MessageEmbed } = require(`discord.js`),
    { r6mail, r6psw } = require(`../../config.json`),
    platform = `uplay`,
    R6 = new R6StatsAPI(r6mail, r6psw);

module.exports = {
    name: `rainbow`,
    description: `Sends info about player in Rainbow Six Siege.`,
    args: 1,
    guildOnly: false,
    usage: `<nick> (operator)`,
    aliases: [`r6`],
    async execute(msg, args) {
        try {
            const [nick, operatorName] = args,
                { 0: { userId, username } } = await R6.getId(platform, nick),
                { 0: { level } } = await R6.getLevel(platform, userId),
                { 0: { pvp: { general, operators } } } = await R6.getStats(platform, userId),
                { 0: { seasons } } = await R6.getRank(platform, userId),
                { 0: { regions } } = Object.values(seasons),
                [region] = Object.values(regions).filter(v => v.updateTime !== `1970-01-01T00:00:00+00:00`);
            let stats = {}, gadgets;
            const embeded = new MessageEmbed()
                .setColor(0x808080)
                .setAuthor(`Rainbow Six Siege Stats`, `https://i.redd.it/iznunq2m8vgy.png`)
                .setFooter(`Mover Bot`)
                .setTimestamp();
            if (operatorName) {
                const operator = operators[operatorName.toLowerCase()];
                embeded.setTitle(`${username}/${operator.name}`).setThumbnail(operator.badge);
                const time = parseInt(operator.playtime / 86400) + `d ` + (new Date(operator.playtime % 86400 * 1000)).toUTCString().replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, `$1h $2m $3s`);
                stats = {
                    Kills: operator.kills,
                    Deaths: operator.deaths,
                    Headshots: operator.headshots,
                    "Wins/Loses": `${operator.wins}/${operator.losses}`,
                    XP: operator.xp,
                    Playtime: time,
                };
                gadgets = new Map();
                for (const gadget of operator.gadget) {
                    gadgets.set(gadget.name, gadget.value);
                }
            } else if (nick) {
                embeded.setTitle(username);
                if (region) embeded.setThumbnail(region.current.image);
                const time = parseInt(general.playtime / 86400) + `d ` + (new Date(general.playtime % 86400 * 1000)).toUTCString().replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, `$1h $2m $3s`);
                stats = {
                    Level: level,
                    Playtime: time,
                    Matches: general.matches,
                    Kills: general.kills,
                    Deaths: general.deaths,
                    Accuracy: `${((general.bulletsConnected / general.bulletsFired) * 100).toFixed(2)}%`,
                    Rank: region ? region.current.name : `None`,
                    "Wins/Loses": region ? `${region.wins}/${region.losses}` : `None`,
                    MMR: region ? region.current.mmr : `None`
                };
            }
            for (const [key, value] of Object.entries(stats)) {
                embeded.addField(key, value, true);
            }
            if (gadgets) {
                for (const [key, value] of gadgets) {
                    embeded.addField(key, value, true);
                }
            }
            msg.channel.send(embeded);
        } catch (e) {
            if (e === `Cannot destructure property \`userId\` of 'undefined' or 'null'.`) msg.reply(`Player not found`);
            else if (e === `Cannot read property 'name' of undefined`) msg.reply(`Uncorrect operator's name`);
            else {
                msg.reply(`Error has occurred`);
                console.error(e);
            }
        }
    }
};