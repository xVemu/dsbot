`use strict`;

const { prefix } = require(`../../config.json`);

module.exports = {
    name: `help`,
    description: `List all of my commands or info about a specific command.`,
    args: 0,
    guildOnly: false,
    aliases: [`commands`, `h`],
    usage: `(command name)`,
    async execute(msg, args) {
        const data = [];
        const { cmds } = msg.client;

        if (!args.length) {
            data.push(`Here's a list of all my commands:`);
            data.push(cmds.map(command => command.name).join(`, `));
            data.push(`\nYou can send \`${prefix}help (command name)\` to get info on a specific command!`);

            return msg.channel.send(data, { split: true });
        }
        const name = args[0].toLowerCase();
        const command = cmds.get(name) || cmds.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return msg.reply(`that's not a valid command!`);
        }

        data.push(`Name: ${command.name}`);

        if (command.aliases) data.push(`Aliases: ${command.aliases.join(`, `)}`);
        if (command.description) data.push(`Description: ${command.description}`);
        if (command.usage) data.push(`Usage: ${prefix}${command.name} ${command.usage}`);

        msg.channel.send(data, { split: true });
    }
};