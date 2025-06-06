import { Button } from "@heroui/react";
import { LucidePanelLeft } from "lucide-react";

import { useSidebar } from "~/hooks/use-sidebar";

interface SidebarTogglerProps {
  className?: string;
}

export default function SidebarToggler({ className }: SidebarTogglerProps) {
  const { toggle } = useSidebar();

  return (
    <Button
      className={className}
      isIconOnly
      onPress={toggle}
      variant='light'
    >
      <LucidePanelLeft />
    </Button>
  );
}
