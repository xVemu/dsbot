`use strict`;

const { GuildMember } = require(`discord.js`);


module.exports = {
    name: `move`,
    description: `Hey, wake up!`,
    args: 1,
    usage: `<nick> (delay[default: 1s])`,
    guildOnly: true,
    aliases: [`m`],
    moving: true,
    async execute(msg, args) {
        try {
            const time = (isNaN(args[1]) ? 1 : args[1]) * 1000;
            const member = msg.mentions.members.first();
            if (!(member instanceof GuildMember)) return msg.reply(`It's not valid argument. Please use @tagged_user`);
            if (!member.voice.selfDeaf) return msg.reply(`User isn't self deafen!`);
            const channel1 = member.voice.channel;
            const channelList = msg.guild.channels.cache;
            let channel2 = msg.guild.afkChannel;
            if (!channel2) channel2 = (channelList.find(v => v.type == `voice` && v.members.size === 0 && v.permissionsFor(member).has(`CONNECT`)) ||
                channelList.find(v => v != channel1 && v.type == `voice` && v.permissionsFor(member).has(`CONNECT`)));
            if (!channel2) return msg.reply(`Haven't found right channel!`);
            let channel = channel2;
            while (member.voice.selfDeaf && this.moving) {
                await member.voice.setChannel(channel, `Hey, wake up!`);
                channel = channel === channel1 ? channel2 : channel1;
                await new Promise(r => setTimeout(r, time));
            }
            await member.voice.setChannel(channel1, `Hey, wake up!`);
        } catch (e) {
            if (e.message === `Target user is not connected to voice.`) msg.reply(e.message);
            else {
                msg.reply(`Error has occurred`);
                console.error(e);
            }
        } finally {
            this.moving = true;
        }
    }
};