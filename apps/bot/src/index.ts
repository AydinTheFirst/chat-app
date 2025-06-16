import 'dotenv/config';
import { DactolyClient } from 'dactoly.js';

import handleMessage from './events/messageCreate.js';

const client = new DactolyClient({
  baseUrl: process.env.DACTOLY_BASE_URL as string,
  token: process.env.DACTOLY_TOKEN as string,
});

client.ws.on('authSuccess', () => {
  console.log('WebSocket authentication successful');

  client.ws.emit('updateStatus', 'online');

  client.channels.getAll().then((channels) => {
    channels.forEach((channel) => {
      client.ws.emit('join', channel.id);
    });
  });
});

client.ws.on('messageCreate', (msg) => handleMessage(client, msg));

await client.login();
