import type React from "react";

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
  message: React.ReactNode;
  onConfirm: () => void;
}

export default function ConfirmModal(props: ConfirmModalProps) {
  const { isOpen, message, onClose, onConfirm, onOpenChange } = props;

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
            Cancel
          </Button>
          <StyledButton
            color='primary'
            onPress={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </StyledButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
