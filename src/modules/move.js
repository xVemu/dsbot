`use strict`;


module.exports = {
    name: `move`,
    description: `Hey, wake up!`,
    args: 1,
    usage: `<nick> (delay[default: 1s])`,
    guildOnly: true,
    aliases: [`m`],
    moving: true,
    async execute(msg, args) {
        const time = args[1] || 1;
        const member = msg.mentions.members.first();
        const channel1 = member.voice.channel;
        const channelList = msg.guild.channels.cache;
        let channel2 = msg.guild.afkChannel;
        if(!channel2) channel2 = (channelList.find(v => v.type == `voice` && v.members.size === 0 && v.permissionsFor(member).has(`CONNECT`)) ||
            channelList.find(v => v != channel1 && v.type == `voice` && v.permissionsFor(member).has(`CONNECT`)));
        let channel = channel2;
        while (member.voice.selfDeaf && this.moving) {
            await member.voice.setChannel(channel, `Hey, wake up!`);
            channel = channel === channel1 ? channel2 : channel1;
            await new Promise(r => setTimeout(r, time * 1000));
        }
        this.moving = true;
        await member.voice.setChannel(channel1, `Hey, wake up!`);
    }
};