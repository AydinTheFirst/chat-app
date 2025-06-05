import type { InviteLink } from "server-types";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure
} from "@heroui/react";
import { LucideUserPlus } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

import { StyledButton } from "~/components/styled-button";
import { handleError, http } from "~/lib/http";

export default function CreateInvite() {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const { channelId } = useParams();

  const [code, setCode] = useState<string>("");

  const handleSubmit = async () => {
    try {
      const { data: invite } = await http.post<InviteLink>(
        `/invites/${channelId}`
      );
      setCode(invite.code);
    } catch (error) {
      handleError(error);
    }
  };

  const handleCopy = async () => {
    const link = new URL(`/invites`, location.origin);
    link.searchParams.set("code", code);

    await navigator.clipboard.writeText(link.toString());
    toast.success("Invite link copied to clipboard!");
  };

  return (
    <>
      <Button
        isIconOnly
        onPress={onOpen}
        variant='light'
      >
        <LucideUserPlus />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            Create Invite
          </ModalHeader>
          <ModalBody>
            {code && (
              <p className='text-gray-500'>Invite link created successfully!</p>
            )}
            {!code && (
              <p className='text-gray-500'>
                Click "Create" to generate an invite link for this channel.
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color='danger'
              onPress={onClose}
              variant='light'
            >
              Close
            </Button>
            {!code && (
              <StyledButton onPress={handleSubmit}>Create</StyledButton>
            )}
            {code && (
              <Popover placement='top'>
                <PopoverTrigger>
                  <StyledButton onPress={handleCopy}>Copy</StyledButton>
                </PopoverTrigger>
                <PopoverContent>
                  <div className='px-1 py-2'>
                    <div className='text-small font-bold'>Copied</div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
