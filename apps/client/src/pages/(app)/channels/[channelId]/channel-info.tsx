import type { Channel, User } from "dactoly.js";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@heroui/react";
import { LucideInfo, LucideUserX2 } from "lucide-react";
import { useNavigate, useRevalidator } from "react-router";
import { toast } from "sonner";

import ConfirmModal from "~/components/confirm-modal";
import UserCard from "~/components/user-card";
import { useAuth } from "~/hooks/use-auth";
import { handleError, http } from "~/lib/http";
import { getChannelDisplayInfo } from "~/lib/utils";

interface ChannelInfoModalProps {
  channel: Channel;
}

interface ChannelUserProps {
  channel: Channel;
  user: User;
}

export default function ChannelInfoModal({ channel }: ChannelInfoModalProps) {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const leaveChannelModal = useDisclosure();
  const deleteChannelModal = useDisclosure();

  const { user: currentUser } = useAuth();

  const channelInfo = getChannelDisplayInfo(channel, currentUser.id);

  const handleLeave = async () => {
    try {
      await http.delete(`/channels/${channel.id}/leave`);
      toast.success("You have left the channel.");
      onClose();
      revalidator.revalidate();
      navigate("/");
    } catch (error) {
      handleError(error);
    }
  };

  const deleteChannel = async () => {
    try {
      await http.delete(`/channels/${channel.id}`);
      toast.success("Channel deleted successfully!");
      onClose();
      revalidator.revalidate();
      navigate("/");
    } catch (error) {
      handleError(error);
    }
  };

  const isOwner = channel.ownerId === currentUser?.id;
  const isDM = channel.type === "DM";

  if (!channelInfo) {
    return <p>Channel not found or you do not have permission to view it.</p>;
  }

  return (
    <>
      <Button
        isIconOnly
        onPress={onOpen}
        variant='light'
      >
        <LucideInfo />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior='inside'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            <h2>{channelInfo.displayName}</h2>
            <p className='text-sm text-gray-500'>{channelInfo.description}</p>
            {!isDM && (
              <p className='text-sm text-gray-500'>
                Owner: {channel.owner?.username}
              </p>
            )}
          </ModalHeader>
          <ModalBody>
            <h2 className='mb-3 text-lg font-bold'>
              Channel Members
              <small className='ml-2 text-gray-500'>
                ({channel.users?.length})
              </small>
            </h2>
            <div className='grid gap-3'>
              {channel.users?.map((user, i) => (
                <ChannelUser
                  channel={channel}
                  key={i}
                  user={user}
                />
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color='danger'
              onPress={onClose}
              variant='light'
            >
              Close
            </Button>
            {!isOwner && (
              <Button
                color='danger'
                onPress={leaveChannelModal.onOpen}
                variant='light'
              >
                Leave
              </Button>
            )}
            {isOwner && !isDM && (
              <Button
                color='danger'
                onPress={deleteChannelModal.onOpen}
                variant='light'
              >
                Delete Channel
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmModal
        message='Are you sure you want to leave this channel?'
        onConfirm={handleLeave}
        {...leaveChannelModal}
      />

      <ConfirmModal
        message='Are you sure you want to delete this channel? This action cannot be undone.'
        onConfirm={deleteChannel}
        {...deleteChannelModal}
      />
    </>
  );
}
function ChannelUser({ channel, user }: ChannelUserProps) {
  const revalidator = useRevalidator();
  const kickModal = useDisclosure();
  const { user: currentUser } = useAuth();

  const handleKick = async () => {
    try {
      await http.delete(`/channels/${channel.id}/kick/${user.id}`);
      toast.success("User kicked successfully!");
      revalidator.revalidate();
    } catch (error) {
      handleError(error);
    }
  };

  const isOwner = channel.ownerId === currentUser?.id;
  const isCurrentUser = user.id === currentUser?.id;
  const isDM = channel.type === "DM";

  return (
    <>
      <div className='flex items-center justify-between'>
        <UserCard user={user} />
        <div className='flex gap-3'>
          {isOwner && !isCurrentUser && !isDM && (
            <Button
              color='danger'
              isIconOnly
              onPress={kickModal.onOpen}
              variant='light'
            >
              <LucideUserX2 />
            </Button>
          )}
        </div>
      </div>

      <ConfirmModal
        message='Are you sure you want to kick this user from the channel?'
        onConfirm={handleKick}
        {...kickModal}
      />
    </>
  );
}
