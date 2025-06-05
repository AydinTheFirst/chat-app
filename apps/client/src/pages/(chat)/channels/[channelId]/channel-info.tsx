import type { User } from "server-types";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@heroui/react";
import { LucideUserX2 } from "lucide-react";
import { useNavigate, useRevalidator } from "react-router";
import { toast } from "sonner";

import type { ChannelWithUsers } from "~/types";

import ConfirmModal from "~/components/confirm-modal";
import { UserCard } from "~/components/user-card";
import { useAuth } from "~/hooks/use-auth";
import { handleError, http } from "~/lib/http";
import { getChannelInfo } from "~/lib/utils";

interface ChannelInfoModalProps {
  channel: ChannelWithUsers;
}

interface ChannelUserProps {
  channel: ChannelWithUsers;
  user: User;
}

export default function ChannelInfoModal({ channel }: ChannelInfoModalProps) {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const leaveChannelModal = useDisclosure();
  const deleteChannelModal = useDisclosure();

  const { user: currentUser } = useAuth();

  const channelInfo = getChannelInfo(channel, currentUser as User);

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

  return (
    <>
      <UserCard
        avatarProps={{
          src: channelInfo.avatar
        }}
        description={channelInfo.description}
        isFocusable
        name={channelInfo.displayName}
        onClick={onOpen}
      />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior='inside'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            <h2>{channelInfo.displayName}</h2>
            <p className='text-sm text-gray-500'>
              {channelInfo.description || "No description available."}
            </p>
          </ModalHeader>
          <ModalBody>
            <h2 className='mb-3 text-lg font-bold'>
              Channel Members
              <small className='ml-2 text-gray-500'>
                ({channel.users.length})
              </small>
            </h2>
            <div className='grid gap-3'>
              {channel.users.map((user, i) => (
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
            {isOwner && (
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
        onYes={handleLeave}
        {...leaveChannelModal}
      />

      <ConfirmModal
        message='Are you sure you want to delete this channel? This action cannot be undone.'
        onYes={deleteChannel}
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
      http.delete(`/channels/${channel.id}/kick/${user.id}`);
      toast.success("User kicked successfully!");
      revalidator.revalidate();
    } catch (error) {
      handleError(error);
    }
  };

  const isOwner = channel.ownerId === currentUser?.id;

  return (
    <>
      <div className='flex items-center justify-between'>
        <UserCard
          avatarProps={{
            src: user.avatarUrl ?? ""
          }}
          description={user.username}
          key={user.id}
          name={user.displayName}
        />
        <div className='flex gap-3'>
          {isOwner && (
            <Button
              color='danger'
              isIconOnly
              onPress={kickModal.onOpen}
              variant='light'
            >
              <LucideUserX2 className='h-5 w-5' />
            </Button>
          )}
        </div>
      </div>

      <ConfirmModal
        message='Are you sure you want to kick this user from the channel?'
        onYes={handleKick}
        {...kickModal}
      />
    </>
  );
}
