import type { User } from "dactoly.js";

import { toast } from "sonner";

import { CtxMenu, CtxMenuItem, CtxMenuSeparator } from "./context-menu";

interface UserContextMenuProps {
  children: React.ReactNode;
  user: User;
}

export default function UserContextMenu({
  children,
  user
}: UserContextMenuProps) {
  const handleCopyId = async () => {
    await navigator.clipboard.writeText(user.id);
    toast.success("User ID copied to clipboard.");
  };

  return (
    <>
      <CtxMenu triggerElement={children}>
        <CtxMenuItem onClick={() => toast.info("Feature coming soon!")}>
          View Profile
        </CtxMenuItem>
        <CtxMenuItem onClick={() => toast.info("Feature coming soon!")}>
          Send Message
        </CtxMenuItem>
        <CtxMenuSeparator />
        <CtxMenuItem onClick={handleCopyId}>Copy User ID</CtxMenuItem>
      </CtxMenu>
    </>
  );
}
