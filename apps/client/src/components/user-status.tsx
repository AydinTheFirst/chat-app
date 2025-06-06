import { cn } from "@heroui/react";
import { useEffect, useState } from "react";

import { useDictoly } from "~/hooks/use-dictoly";

type UserStatus = "idle" | "offline" | "online";

interface UserStatusProps {
  userId: string;
}

export default function UserStatus({ userId }: UserStatusProps) {
  const { dictolyClient } = useDictoly();
  const [status, setStatus] = useState<UserStatus>("offline");

  useEffect(() => {
    dictolyClient.ws.emit("getStatus", userId);

    dictolyClient.ws.on("userStatus", (data) => {
      if (data.userId === userId) {
        setStatus(data.status);
      }
    });

    return () => {
      dictolyClient.ws.off("userStatus");
    };
  }, [dictolyClient, userId]);

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
