`use strict`;


module.exports = {
    name: `random`,
    description: `Randomize number from the given range.`,
    args: 1,
    guildOnly: false,
    usage: `<range>`,
    aliases: [`r`],
    async execute(msg, args) {
        const range = parseInt(args[0]);

        if (isNaN(range)) {
            return msg.reply(`that doesn't seem to be a valid number.`);
        }

        const random = (Math.floor(Math.random() * range) + 1).toString();
        msg.channel.send(random);
    }
};