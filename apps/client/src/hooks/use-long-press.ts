import { useRef, useState } from "react";

export default function useLongPress(onLongPress: () => void, ms = 500) {
  const [, setLongPressTriggered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    timerRef.current = setTimeout(() => {
      onLongPress();
      setLongPressTriggered(true);
    }, ms);
  };

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setLongPressTriggered(false);
  };

  return {
    onMouseDown: start,
    onMouseLeave: clear,
    onMouseUp: clear,
    onTouchEnd: clear,
    onTouchStart: start
  };
}
