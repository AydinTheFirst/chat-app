import { ChannelType, Message } from 'dactoly.js';

import { GeminiSessionManager } from '../GeminiSessionManager.js';

const gemini = new GeminiSessionManager(process.env.GEMINI_API_KEY as string);

export default async function handleMessage(message: Message) {
  message = Message.fromJSON(message);

  console.log(`Received message: ${message.content} in channel ${message.channelId}`);

  if (message.author && message.author.isBot) {
    return;
  }

  if (message.channel && message.channel.type !== ChannelType.DM) {
    return;
  }

  const args = message.content.trim().split(/\s+/);

  const command = args.shift()?.toLowerCase();

  if (command === 'reset') {
    gemini.reset(message.authorId as string);
    await message.channel?.send('Session reset.');
    return;
  }

  message.channel?.startTyping();
  const response = await gemini.chat(message.authorId as string, message.content);
  await message.channel?.send(response);
  message.channel?.stopTyping();
}
