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
import { LucidePlus } from "lucide-react";
import React from "react";
import { useNavigate, useRevalidator } from "react-router";
import { toast } from "sonner";
import { handleError } from "utils/handleError";

import { StyledButton } from "~/components/styled-button";
import dactoly from "~/lib/dactoly";

export default function CreateChannelModal() {
  const props = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  const revalidator = useRevalidator();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget),
      data: Record<string, unknown> = Object.fromEntries(formData.entries());

    try {
      const channel = await dactoly.channels.create(data);
      toast.success("Channel created successfully!");
      props.onClose();
      revalidator.revalidate();
      navigate(`/app/channels/${channel.id}`);
    } catch (error) {
      handleError(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Button
        aria-label='Create Channel'
        isIconOnly
        onPress={props.onOpen}
        size='sm'
        variant='light'
      >
        <LucidePlus size={20} />
      </Button>

      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>New Channel</ModalHeader>
          <ModalBody>
            <form
              className='grid gap-3'
              onSubmit={handleSubmit}
            >
              <Input
                isRequired
                label='Channel Name'
                name='name'
              />

              <Textarea
                label='Description'
                name='description'
                placeholder='Enter a brief description of the channel'
              />

              <StyledButton
                isLoading={isLoading}
                type='submit'
              >
                Create Channel
              </StyledButton>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              color='danger'
              onPress={props.onClose}
              variant='light'
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
