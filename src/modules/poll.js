`use strict`;


module.exports = {
    name: `poll`,
    description: `Creates a simple poll.`,
    args: 2,
    guildOnly: false,
    usage: `<option 1> <option 2>`,
    aliases: [`p`],
    async execute(msg, args) {
        const message = `✅ - ${args[0]} \n❌ - ${args[1]}`;
        const sent = await msg.channel.send(message);
        sent.react(`✅`);
        sent.react(`❌`);
    }
};