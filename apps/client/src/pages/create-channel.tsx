import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure
} from "@heroui/react";
import { LucideMessageSquarePlus } from "lucide-react";
import { useNavigate, useRevalidator } from "react-router";
import { toast } from "sonner";

import { StyledButton } from "~/components/styled-button";
import { dictoly } from "~/lib/dictoly";
import { handleError } from "~/lib/http";
import { getFormData } from "~/lib/utils";

export default function CreateChannel() {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const revalidator = useRevalidator();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = getFormData(event);

    try {
      const channel = await dictoly.channels.create({
        name: formData.name
      });
      toast.success("Channel created successfully!");
      onClose();
      revalidator.revalidate();
      navigate(`/channels/${channel.id}`);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Button
        isIconOnly
        onPress={onOpen}
        variant='light'
      >
        <LucideMessageSquarePlus />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            Create new Channel
          </ModalHeader>
          <ModalBody>
            <form
              className='grid gap-3'
              onSubmit={handleSubmit}
            >
              <Input
                description='Enter a unique name for your channel.'
                isRequired
                label='Channel Name'
                name='name'
                placeholder='e.g., general, random, etc.'
              />
              <Textarea
                description='Provide a brief description of your channel.'
                label='Channel Description'
                name='description'
                placeholder='Describe the purpose of this channel...'
                rows={3}
              />
              <StyledButton type='submit'>Create Channel</StyledButton>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              color='danger'
              onPress={onClose}
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
