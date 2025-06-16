import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type UseDisclosureProps
} from "@heroui/react";
import { useRevalidator } from "react-router";
import { toast } from "sonner";

import { StyledButton } from "~/components/styled-button";
import { handleError, http } from "~/lib/http";

interface AddApplicationModalProps extends UseDisclosureProps {
  channelId: string;
}

export default function AddApplicationModal(props: AddApplicationModalProps) {
  const { channelId, ...rest } = props;

  const revalidator = useRevalidator();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const applicationId = formData.get("applicationId") as string;

    try {
      await http.post(
        `/channels/${channelId}/applications/${applicationId}/join`
      );
      toast.success("Application created successfully!");
      revalidator.revalidate();
      rest.onClose?.();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Modal
      isOpen={rest.isOpen}
      onClose={rest.onClose}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>
          Add Application
        </ModalHeader>
        <ModalBody>
          <form
            className='grid gap-5'
            onSubmit={handleSubmit}
          >
            <Input
              isRequired
              label='Application ID'
              name='applicationId'
            />

            <StyledButton type='submit'>Submit</StyledButton>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            color='danger'
            onPress={rest.onClose}
            variant='light'
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
