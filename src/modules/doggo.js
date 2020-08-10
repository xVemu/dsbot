`use strict`;

const axios = require(`axios`).default;

module.exports = {
    name: `doggo`,
    description: `Sends random dog picture.`,
    args: 0,
    guildOnly: false,
    aliases: [`d`],
    async execute(msg) {
        try {
            const { data: { 0: url } } = await axios.get(`https://api.thedogapi.com/v1/images/search`);
            msg.channel.send({ files: [url] });
        } catch (e) {
            msg.reply(`Error has occurred!`);
            console.error(e);
        }
    }
};