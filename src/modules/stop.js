`use strict`;


module.exports = {
    name: `stop`,
    description: `Stops moving!`,
    args: 0,
    guildOnly: true,
    aliases: [`s`],
    async execute() {
        require(`./move`).moving = false;
    }
};