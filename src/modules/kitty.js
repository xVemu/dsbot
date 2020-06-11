`use strict`;

const axios = require(`axios`);

module.exports = {
    name: `kitty`,
    description: `Sends random cat picture.`,
    args: 0,
    guildOnly: false,
    aliases: [`k`],
    async execute(msg) {
        try {
            const {data: {0: { url }}} = await axios.get(`https://api.thecatapi.com/v1/images/search`);
            msg.channel.send({ files: [url] });
        } catch (e) {
            msg.reply(`Error has occured!`);
            console.error(e);
        }
    }
};