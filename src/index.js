`use strict`;

const Discord = require(`discord.js`),
    fs = require(`fs`),
    config = require(`../config.json`),
    client = new Discord.Client();

let funcsObj = {},
    funcs = [];

fs.readdir(`src/modules`, (err, files) => {
    if (err) console.error(err);
    files.map(v => {
        if (v.endsWith(`.js`)) {
            const vReplace = v.replace(`.js`, ``);
            funcsObj[vReplace] = require(`./modules/` + vReplace);
            funcs.push(vReplace);
        }
    });
});

exports.funcs = funcs;

client.on(`ready`, async () => {
    console.log(`Logged in as
    \n${client.user.username}
    \n${client.user.id}`);
});

client.on(`message`, async msg => {
    if (msg.content.startsWith(`?`)) {
        try {
            const split = msg.content.split(` `);
            const message = await funcsObj[split[0].substr(1).toLowerCase()](msg, split.slice(1));
            await msg.channel.send(message);
        }
        catch (e) {
            if (e.message == `funcsObj[split[0].substr(...).toLowerCase(...)] is not a function`) {
                console.log(`Command not found: ${msg.content}`);
            } else console.error(e);
        }
    }
});

client.login(config.token);