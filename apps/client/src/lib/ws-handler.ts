import { dactoly } from "~/lib/dactoly";
import { useChannelStore } from "~/store/channel-store";
import { useMessageStore } from "~/store/message-store";

let initialized = false;

export const initSocketEvents = () => {
  if (initialized) return;
  initialized = true;

  console.log("Socket init");

  const channelStore = useChannelStore.getState();
  const messageStore = useMessageStore.getState();

  const socket = dactoly.ws;

  socket.on("messageCreate", (message) => {
    messageStore.addMessage(message.channelId, message);
  });

  socket.on("messageUpdate", (message) => {
    messageStore.updateMessage(message.channelId, message);
  });

  socket.on("messageDelete", async (message) => {
    messageStore.deleteMessage(message.channelId, message.id);
  });

  socket.on("channelCraete", (channel) => {
    channelStore.addChannel(channel);
    socket.emit("join", channel.id);
  });

  socket.on("channelUpdate", (channel) => {
    channelStore.updateChannel(channel.id, channel);
  });

  socket.on("channelJoin", (channel) => {
    channelStore.addChannel(channel);
    socket.emit("join", channel.id);
  });

  socket.on("channelLeave", (channel) => {
    channelStore.deleteChannel(channel.id);
    socket.emit("leave", channel.id);
  });

  socket.on("channelDelete", (channel) => {
    channelStore.deleteChannel(channel.id);
    socket.emit("leave", channel.id);
  });

  Object.values(channelStore.channels).map((c) => socket.emit("join", c.id));
};
