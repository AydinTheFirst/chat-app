import {
  Button,
  Checkbox,
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

export default function CreateAppModal(props: UseDisclosureProps) {
  const revalidator = useRevalidator();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget),
      data = Object.fromEntries(formData.entries());

    try {
      await http.post("/applications", data);
      toast.success("Application created successfully!");
      revalidator.revalidate();
      props.onClose?.();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>Create App</ModalHeader>
        <ModalBody>
          <form
            className='grid gap-5'
            onSubmit={handleSubmit}
          >
            <Input
              isRequired
              label='Application Name'
              name='name'
            />

            <Checkbox>I agree to the TOS and Privacy Policy</Checkbox>

            <StyledButton type='submit'>Submit</StyledButton>
          </form>
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
  );
}
