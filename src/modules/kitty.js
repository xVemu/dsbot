`use strict`;

const fetch = require(`node-fetch`);

module.exports = {
    name: `kitty`,
    description: `Sends random cat picture.`,
    args: 0,
    guildOnly: false,
    aliases: [`k`],
    async execute(msg) {
        try {
            const response = await fetch(`https://api.thecatapi.com/v1/images/search`, { redirect: `follow` });
            const { 0: { url } } = await response.json();
            msg.channel.send({ files: [url] });
        } catch (e) {
            msg.reply(`Error has occured!`);
            console.error(e);
        }
    }
};