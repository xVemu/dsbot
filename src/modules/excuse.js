import axios from 'axios';
import { EmbedBuilder } from 'discord.js';

export default {
  name: 'excuse',
  description: 'Sends random excuse.',
  async execute(msg) {
    const {
      data: [{ excuse, category }],
    } = await axios.get('https://excuser-three.vercel.app/v1/excuse');

    await msg.reply({
      embeds: [
        new EmbedBuilder({
          title: 'Random excuse!',
          fields: [
            { name: 'Excuse', value: excuse },
            { name: 'Category', value: category },
          ],
          color: 0x10b5bf,
          timestamp: Date.now(),
          footer: { text: 'Mover Bot' },
        }),
      ],
    });
  },
};
