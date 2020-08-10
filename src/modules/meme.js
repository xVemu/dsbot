`use strict`;

const axios = require(`axios`);

module.exports = {
    name: `meme`,
    description: `Sends random meme.`,
    args: 0,
    guildOnly: false,
    aliases: [],
    async execute(msg) {
        try {
            const { data: { nsfw, url, title } } = await axios.get(`https://meme-api.herokuapp.com/gimme`);
            if (nsfw && !msg.channel.nsfw) return this.execute(msg);
            msg.channel.send(title, { files: [url] });
        } catch (e) {
            msg.reply(`Error has occurred!`);
            console.error(e);
        }
    }
};