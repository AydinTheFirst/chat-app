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
import { LucideUserPlus } from "lucide-react";
import { useRevalidator } from "react-router";
import { toast } from "sonner";

import { StyledButton } from "~/components/styled-button";
import { handleError, http } from "~/lib/http";

export default function AddFriend() {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const revalitor = useRevalidator();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget),
      data: Record<string, unknown> = Object.fromEntries(formData.entries());

    try {
      await http.post("/friendships", data);
      toast.success("Friend request sent successfully!");
      onClose();
      revalitor.revalidate();
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
        <LucideUserPlus />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>Add Friend</ModalHeader>
          <ModalBody>
            <form
              className='grid gap-3'
              onSubmit={handleSubmit}
            >
              <Input
                description='Enter name of your friend.'
                isRequired
                label='User'
                name='to'
              />
              <StyledButton type='submit'>Add Friend</StyledButton>
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
