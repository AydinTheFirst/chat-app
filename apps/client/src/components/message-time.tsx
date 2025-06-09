interface MessageTimeProps {
  createdAt: Date | string;
}

export default function MessageTime({ createdAt }: MessageTimeProps) {
  const messageDate = new Date(createdAt);
  const now = new Date();

  const isToday =
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear();

  if (isToday) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  return messageDate.toLocaleDateString([], {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}
