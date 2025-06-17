import { useEffect, useRef, useState } from "react";

import dactoly from "~/lib/dactoly";

export function useTyping(channelId: string) {
  const [isTyping, setIsTyping] = useState(false);
  const lastEventRef = useRef<"startTyping" | "stopTyping">("stopTyping");

  useEffect(() => {
    if (!channelId) return;

    const event = isTyping ? "startTyping" : "stopTyping";
    if (lastEventRef.current === event) return;

    lastEventRef.current = event;
    dactoly.ws.emit(event, channelId);
  }, [channelId, isTyping]);

  const setTyping = (typing: boolean) => {
    setIsTyping(typing);
  };

  return { isTyping, setTyping };
}
