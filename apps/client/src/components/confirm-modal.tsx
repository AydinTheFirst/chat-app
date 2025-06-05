import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type useDisclosure
} from "@heroui/react";

import { StyledButton } from "./styled-button";

interface ConfirmModalProps extends ReturnType<typeof useDisclosure> {
  message: string;
  onYes: () => void;
}

export default function ConfirmModal(props: ConfirmModalProps) {
  const { isOpen, message, onClose, onOpenChange, onYes } = props;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>Are you sure?</ModalHeader>
        <ModalBody>
          <p>{message}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color='danger'
            onPress={onClose}
            variant='light'
          >
            Close
          </Button>
          <StyledButton
            color='primary'
            onPress={() => {
              onYes();
              onClose();
            }}
          >
            Yes
          </StyledButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
