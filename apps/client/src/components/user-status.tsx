import { cn } from "@heroui/react";
import { useEffect, useState } from "react";

import { useSocket } from "~/hooks/use-socket";

type UserStatus = "idle" | "offline" | "online";

interface UserStatusProps {
  userId: string;
}

export default function UserStatus({ userId }: UserStatusProps) {
  const { socket } = useSocket();
  const [status, setStatus] = useState<UserStatus>("offline");

  useEffect(() => {
    if (!socket) return;

    socket.emit("getStatus", userId);

    socket.on("userStatus", (data: { status: UserStatus; userId: string }) => {
      if (data.userId === userId) {
        setStatus(data.status);
      }
    });

    return () => {
      socket.off("userStatus");
    };
  }, [socket, userId]);

  const indicatorColor = {
    idle: "bg-yellow-500",
    offline: "bg-red-500",
    online: "bg-green-500"
  };

  return (
    <div className='flex items-center gap-1'>
      <span
        className={cn(
          `inline-block h-2.5 w-2.5 rounded-full`,
          indicatorColor[status]
        )}
      />
      {status}
    </div>
  );
}
