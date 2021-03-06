`use strict`;

module.exports = {
    name: `coinflip`,
    description: `Flip a coin.`,
    args: 0,
    guildOnly: false,
    aliases: [`cf`],
    async execute(msg) {
        msg.reply((Math.floor(Math.random() * 2) == 0) ? `heads` : `tails`);
    }
};