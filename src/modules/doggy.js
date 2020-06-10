`use strict`;

const fetch = require(`node-fetch`);

module.exports = {
    name: `doggy`,
    description: `Sends random dog picture.`,
    args: 0,
    guildOnly: false,
    aliases: [`d`],
    async execute(msg) {
        try {
            const response = await fetch(`https://api.thedogapi.com/v1/images/search`, { redirect: `follow` });
            const { 0: { url } } = await response.json();
            msg.channel.send({ files: [url] });
        } catch (e) {
            msg.reply(`Error has occured!`);
            console.error(e);
        }
    }
};