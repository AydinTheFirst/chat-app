import 'dotenv/config';
import { Client } from 'dactoly.js';

import handleMessage from './events/messageCreate.js';

const client = new Client({
  baseUrl: process.env.DACTOLY_BASE_URL as string,
  token: process.env.DACTOLY_TOKEN as string,
});

client.ws.on('authSuccess', async () => {
  console.log('WebSocket authentication successful');

  client.ws.emit('updateStatus', 'online');

  const channels = await client.channels.fetch();
  for (const channel of channels) {
    client.ws.emit('join', channel.id);

    client.channels.cache.set(channel.id, channel);

    const messages = await client.messages.fetch({
      channelId: channel.id,
      limit: 100,
    });

    for (const message of messages.items) {
      client.messages.cache.set(message.id, message);
    }
  }
});

client.ws.on('messageCreate', handleMessage);

client.ws.connect();
