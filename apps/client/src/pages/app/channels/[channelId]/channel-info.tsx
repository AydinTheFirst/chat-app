import type { Channel } from "dactoly.js";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@heroui/react";
import { LucideInfo, LucideX } from "lucide-react";
import { Link } from "react-router";

import { UserCard } from "~/components/user-card";
import { cdnSource } from "~/config";
import { useAuth } from "~/hooks/use-auth";
import useChannelInfo from "~/hooks/use-channel-info";

interface ChannelInfoModalProps {
  channel: Channel;
}

export default function ChannelInfoModal({ channel }: ChannelInfoModalProps) {
  const props = useDisclosure();
  const { user: currentUser } = useAuth();
  const channelInfo = useChannelInfo({ channel, user: currentUser });

  const isDM = channel.type === "DM";
  const isOwner = channel.ownerId === currentUser.id;

  return (
    <>
      <Button
        aria-label='Channel Info'
        isIconOnly
        onPress={props.onOpen}
        variant='light'
      >
        <LucideInfo size={20} />
      </Button>

      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        scrollBehavior='inside'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            <h2 className='text-xl font-semibold'>{channelInfo.displayName}</h2>
            <p className='text-muted text-sm'>
              {channel.type === "DM"
                ? "DM"
                : channel.description || "No description available."}
            </p>
          </ModalHeader>
          <ModalBody>
            <h3 className='text-lg font-semibold'>
              Users{" "}
              <span className='text-muted text-xs'>
                ({channel.users.length})
              </span>
            </h3>
            <ul className='grid gap-3'>
              {channel.users.map((user) => (
                <li
                  className='hover:bg-content3 flex items-center justify-between gap-2 rounded-md p-2'
                  key={user.id}
                >
                  <Link to={`/app/users/${user.id}`}>
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
                          {user.profile?.displayName || user.username}
                        </span>
                      }
                    />
                  </Link>
                  {!isDM && isOwner && currentUser.id !== user.id && (
                    <Button
                      color='danger'
                      isIconOnly
                      size='sm'
                      variant='light'
                    >
                      <LucideX size={16} />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button
              color='danger'
              variant='light'
            >
              Leave Channel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
