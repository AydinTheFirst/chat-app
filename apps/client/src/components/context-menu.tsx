import { cn } from "@heroui/react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import React from "react";

interface CtxMenuItemProps {
  children: React.ReactNode;
  onClick: () => void;
}

interface CtxMenuProps {
  children: React.ReactNode;
  triggerElement: React.ReactNode;
}

export function CtxMenu({ children, triggerElement }: CtxMenuProps) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{triggerElement}</ContextMenu.Trigger>
      <ContextMenu.Content
        className={cn("bg-content2 z-50 min-w-40 rounded-lg p-1 shadow-lg")}
      >
        {children}
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

export function CtxMenuItem({ children, onClick }: CtxMenuItemProps) {
  return (
    <ContextMenu.Item
      className='hover:bg-content3 cursor-pointer rounded px-2 py-1 text-sm transition-colors'
      onClick={onClick}
    >
      {children}
    </ContextMenu.Item>
  );
}

export function CtxMenuSeparator() {
  return (
    <ContextMenu.Separator className='my-1 h-px bg-gray-200 dark:bg-gray-700' />
  );
}
