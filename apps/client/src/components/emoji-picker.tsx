import * as Picker from "emoji-picker-react";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}
export default function EmojiPicker(props: EmojiPickerProps) {
  const { theme } = useTheme();

  const handleClick = (emoji: Picker.EmojiClickData) => {
    props.onSelect(emoji.emoji);
  };
  return (
    <Picker.default
      onEmojiClick={handleClick}
      theme={theme as Picker.Theme}
    />
  );
}
