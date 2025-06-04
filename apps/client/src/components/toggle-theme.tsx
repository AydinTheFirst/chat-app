import { Button } from "@heroui/react";
import { LucideMoon, LucideSun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ToggleTheme() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const Icon = theme === "dark" ? LucideMoon : LucideSun;

  return (
    <Button
      aria-label='Toggle theme'
      isIconOnly
      onPress={toggleTheme}
      variant='light'
    >
      <Icon />
    </Button>
  );
}
