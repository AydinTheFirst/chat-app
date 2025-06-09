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
import { LucideEdit } from "lucide-react";
import React from "react";
import { useRevalidator } from "react-router";
import { toast } from "sonner";

import { StyledButton } from "~/components/styled-button";
import { handleError, http, uploadFiles } from "~/lib/http";

export default function UpdateAvatar() {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const revalitor = useRevalidator();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setIsLoading(true);

    try {
      const files = [formData.get("file") as File];
      const uploadedFiles = await uploadFiles(files);
      console.log("Uploaded files:", uploadedFiles);

      const avatarUrl = uploadedFiles[0];
      console.log("Avatar URL:", avatarUrl);

      await http.patch("/profiles/me", {
        avatarUrl
      });
      console.log("Avatar updated successfully!");

      toast.success("Avatar updated successfully!");
      onClose();
      revalitor.revalidate();
    } catch (error) {
      handleError(error);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Button
        isIconOnly
        onPress={onOpen}
        size='sm'
        variant='light'
      >
        <LucideEdit size={16} />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            Update Avatar
          </ModalHeader>
          <ModalBody>
            <form
              className='grid gap-3'
              onSubmit={handleSubmit}
            >
              <Input
                accept='image/*'
                isRequired
                label='Select an image'
                name='file'
                type='file'
              />
              <StyledButton
                isLoading={isLoading}
                type='submit'
              >
                Update
              </StyledButton>
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
