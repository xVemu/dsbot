import axios from 'axios';
import { EmbedBuilder } from 'discord.js';
import { fetchJson } from '../utils.js'

export default {
  name: 'excuse',
  description: 'Sends random excuse.',
  async execute(msg) {
    const [{ excuse, category }] = await fetchJson('https://excuser-three.vercel.app/v1/excuse');

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
