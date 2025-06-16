import { DactolyClient, Message } from 'dactoly.js';

const PREFIX = '!';

export default async function handleMessage(client: DactolyClient, message: Message) {
  console.log(`Received message: ${message.content} in channel ${message.channelId}`);
  if (!message.content.startsWith(PREFIX)) {
    return;
  }

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);

  const command = args.shift()?.toLowerCase();

  console.log('Client', message.client.user.username);

  if (command === 'ping') {
    await message.reply('Pong!');
  }
}
