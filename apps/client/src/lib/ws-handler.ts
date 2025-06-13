/* import type { Message } from "dactoly.js"; */

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
    /*     notify(message); */
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

  socket.on("channelDelete", (channel) => {
    channelStore.deleteChannel(channel.id);
    socket.emit("leave", channel.id);
  });

  Object.values(channelStore.channels).map((c) => socket.emit("join", c.id));
};
/* 
const notify = (message: Message) => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notifications.");
    return;
  }

  if (Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      if (permission !== "granted") {
        console.warn("Notification permission not granted.");
        return;
      }
    });
  }

  const notification = new Notification(
    message.author?.profile?.displayName ?? "User",
    {
      body: message.content,
      icon: "/logo.png"
    }
  );

  notification.onclick = () => {
    window.focus();
    const channel = useChannelStore.getState().channels[message.channelId];
    if (channel) {
      window.location.href = `/channels/${channel.id}`;
    }
  };

  notification.onclose = () => {
    console.log("Notification closed");
  };
};
 */
