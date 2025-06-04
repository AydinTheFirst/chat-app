import { Avatar, cn } from "@heroui/react";

interface MessageBubbleProps {
  avatarUrl?: string;
  fromUser?: boolean; // true ise sağda, değilse solda göster
  message: string;
  userName?: string;
}

export default function MessageBubble(props: MessageBubbleProps) {
  const {
    avatarUrl,
    fromUser = false,
    message,
    userName = "Unknown User"
  } = props;

  return (
    <div
      className={cn(
        "flex items-start gap-2",
        fromUser ? "justify-end" : "justify-start"
      )}
    >
      {!fromUser && avatarUrl && (
        <Avatar
          alt={userName}
          src={avatarUrl}
        />
      )}
      <div
        className={cn(
          "max-w-xs rounded-lg px-4 py-2 text-sm leading-relaxed",
          fromUser
            ? "rounded-br-none bg-blue-600 text-white"
            : "rounded-bl-none bg-gray-300 text-gray-900"
        )}
      >
        {message}
      </div>
      {fromUser && avatarUrl && (
        <Avatar
          alt={userName}
          src={avatarUrl}
        />
      )}
    </div>
  );
}
