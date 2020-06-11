`use strict`;

const axios = require(`axios`).default;

module.exports = {
    name: `foxy`,
    description: `Sends random fox picture.`,
    args: 0,
    guildOnly: false,
    aliases: [`f`],
    async execute(msg) {
        try {
            const { data: { image } } = await axios.get(`https://randomfox.ca/floof/`);
            msg.channel.send({ files: [image] });
        } catch (e) {
            msg.reply(`Error has occured!`);
            console.error(e);
        }
    }
};