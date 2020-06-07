`use strict`;

const fetch = require(`node-fetch`);

module.exports = {
    name: `foxy`,
    description: `Sends random fox picture.`,
    args: 0,
    guildOnly: false,
    aliases: [`f`],
    async execute(msg) {
        const response = await fetch(`https://randomfox.ca/floof/`, { redirect: `follow` });
        const { image } = await response.json();
        msg.channel.send({ files: [image] });
    }
};