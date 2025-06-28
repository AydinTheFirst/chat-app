import { Button, type ButtonProps } from "@heroui/react";
import { LucideMoon, LucideSun } from "lucide-react";
import { useTheme } from "next-themes";

interface ToggleThemeProps extends ButtonProps {
  ariaLabel?: string;
}

export default function ToggleTheme(props: ToggleThemeProps) {
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
      {...props}
    >
      <Icon size={20} />
    </Button>
  );
}
