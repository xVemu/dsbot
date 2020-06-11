`use strict`;

const Discord = require(`discord.js`),
    fs = require(`fs`),
    { token, prefix } = require(`../config.json`),
    client = new Discord.Client({ presence: { activity: { name: `prefix: ?` } } });

client.cmds = new Discord.Collection();

const cmdFiles = fs.readdirSync(`src/modules`).filter(file => file.endsWith(`.js`));

for (const file of cmdFiles) {
    const cmd = require(`./modules/${file}`);
    client.cmds.set(cmd.name, cmd);
}

client.on(`ready`, async () => {
    console.log(`Logged in as
    \n${client.user.username}
    \n${client.user.id}`);
});

client.on(`message`, msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    const argu = msg.content.slice(prefix.length).match(/[^\s"']+|"([^"]*)"/gmi);
    if (!argu) return;
    const args = argu.map(v => v.replace(/["']/g, ``));
    const cmdName = args.shift().toLowerCase();
    const cmd = client.cmds.get(cmdName)
        || client.cmds.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
    if (!cmd) return;
    if (cmd.guildOnly && msg.channel.type !== `text`) return msg.reply(`I can't execute that command inside DMs!`);
    if (cmd.args > 0 && args.length < cmd.args) {
        let reply = `You didn't provide any arguments!`;

        if (cmd.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${cmd.name} ${cmd.usage}\``;
        }

        return msg.reply(reply);
    }
    try {
        cmd.execute(msg, args);
        return;
    }
    catch (e) {
        console.error(e);
    }
});

client.login(token);