import axios from 'axios';
import { EmbedBuilder } from 'discord.js';

export default {
  name: 'uselessfact',
  description: 'Sends random useless fact.',
  async execute(msg) {
    const {
      data: { text },
    } = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/today');

    await msg.reply({
      embeds: [
        new EmbedBuilder({
          title: 'Random useless fact!',
          description: text,
          color: 0x10b5bf,
          timestamp: Date.now(),
          footer: { text: 'Mover Bot' },
        }),
      ],
    });
  },
};
