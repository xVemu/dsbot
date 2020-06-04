`use strict`;

module.exports = async (msg, split) => {
    const message = `✅ - ${split[0]} \n❌ - ${split[1]}`;
    const sent = await msg.channel.send(message);
    sent.react(`✅`);
    sent.react(`❌`);
    return;
};