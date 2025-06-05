import type { useDisclosure } from "@heroui/react";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea
} from "@heroui/react";

import type { MessageWithAuthor } from "~/types";

import { StyledButton } from "~/components/styled-button";
import { handleError, http } from "~/lib/http";

interface EditMessageProps extends ReturnType<typeof useDisclosure> {
  message: MessageWithAuthor;
}

export default function EditMessage(props: EditMessageProps) {
  const { isOpen, message, onClose, onOpenChange } = props;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget),
      data = Object.fromEntries(formData.entries());

    try {
      await http.patch(`/messages/${message.id}`, data);
      onClose?.();
    } catch (error) {
      handleError(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = (e.currentTarget as HTMLElement).closest("form");
      console.log("Submitting form:", form);
      form?.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>Edit Message</ModalHeader>
        <ModalBody>
          <form
            className='grid gap-3'
            onSubmit={handleSubmit}
          >
            <Textarea
              defaultValue={message.content}
              fullWidth
              name='content'
              onKeyDown={handleKeyDown}
              placeholder='Edit your message...'
            />
            <StyledButton type='submit'>Save Changes</StyledButton>
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
  );
}
