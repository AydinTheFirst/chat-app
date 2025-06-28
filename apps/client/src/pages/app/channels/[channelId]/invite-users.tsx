import type { Channel, InviteLink } from "dactoly.js";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@heroui/react";
import { LucideUserPlus2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { handleError } from "utils/handleError";

import dactoly from "~/lib/dactoly";

interface InviteUsersModalProps {
  channel: Channel;
}

export default function InviteUsersModal({ channel }: InviteUsersModalProps) {
  const props = useDisclosure();

  const [createdInvite, setCreatedInvite] = useState<InviteLink | null>(null);

  const handleCreate = async () => {
    try {
      const invite = await dactoly.invites.create(channel.id);
      setCreatedInvite(invite);
      toast.success("Invite link created successfully!");
    } catch (error) {
      handleError(error);
    }
  };

  const inviteLink = new URL(
    `/app/invites/${createdInvite?.code}`,
    window.location.origin
  );

  const copyInviteLink = async () => {
    if (!createdInvite) return;
    await navigator.clipboard.writeText(inviteLink.toString());
    toast.success("Invite link copied to clipboard!");
  };

  return (
    <>
      <Button
        aria-label='Invite Users'
        isIconOnly
        onPress={props.onOpen}
        variant='light'
      >
        <LucideUserPlus2 size={20} />
      </Button>

      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        scrollBehavior='inside'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            Invite Users
          </ModalHeader>
          <ModalBody>
            {createdInvite ? (
              <div className='flex flex-col gap-2'>
                <p>
                  Invite link created for channel{" "}
                  <strong>{channel.name}</strong>.
                </p>
                <p className='text-sm text-gray-500'>
                  Share this link with users to invite them to the channel.
                </p>
                <Input
                  isReadOnly
                  type='text'
                  value={inviteLink.toString()}
                />
                <Button
                  color='primary'
                  onPress={copyInviteLink}
                >
                  Copy Link
                </Button>
              </div>
            ) : (
              <div className='flex flex-col gap-2'>
                <p>
                  Click the button below to create an invite link for channel{" "}
                  <strong>{channel.name}</strong>.
                </p>
                <Button
                  color='primary'
                  onPress={handleCreate}
                >
                  Create Invite Link
                </Button>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color='danger'
              onPress={props.onClose}
              variant='light'
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
