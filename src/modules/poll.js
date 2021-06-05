'use strict'


module.exports = {
    name: 'poll',
    description: 'Creates a simple poll.',
    guildOnly: false,
    options: [
        {
            type: 'STRING',
            name: 'option1',
            description: '1st option',
            required: true,
        },
        {
            type: 'STRING',
            name: 'option2',
            description: '2nd option',
            required: true,
        },
    ],
    async execute(msg, [option1, option2]) {
        const message = `✅ - ${option1.value ?? option1} \n❌ - ${option2.value ?? option2}`
        const sent = await msg.reply(message) ?? await msg.fetchReply()
        sent.react('✅')
        sent.react('❌')
    },
}