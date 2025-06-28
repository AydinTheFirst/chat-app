import { Button } from "@heroui/react";
import { LucideSettings } from "lucide-react";

import ToggleTheme from "~/components/toggle-theme";
import { UserCard } from "~/components/user-card";
import { cdnSource } from "~/config";
import { useAuth } from "~/hooks/use-auth";

export default function SidebarUserCard() {
  const { user } = useAuth();

  return (
    <div className='flex w-full items-center justify-between'>
      <UserCard
        avatarProps={{
          name: user.username,
          ...(user.profile?.avatarUrl && {
            src: cdnSource(user.profile.avatarUrl)
          })
        }}
        description={
          <span className='block max-w-28 truncate text-xs text-gray-500'>
            {user.username}
          </span>
        }
        name={
          <span className='block max-w-28 truncate'>
            {user.profile?.displayName}
          </span>
        }
      />
      <div className='flex gap-1'>
        <ToggleTheme size='sm' />
        <Button
          isIconOnly
          size='sm'
          variant='light'
        >
          <LucideSettings size={20} />
        </Button>
      </div>
    </div>
  );
}
