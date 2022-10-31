import { DeleteIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Tooltip,
  MenuItem,
  Center,
  Text,
} from "@chakra-ui/react";

interface ModalProps {
  onConfirm: () => void;
}

export const ConfirmationModal = (props: ModalProps) => {
  const { onConfirm } = props;
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      <MenuItem onClick={onOpen}>
        <Center gap={2}>
          <DeleteIcon color="red.500" />
          <Text>Excluir Nota</Text>
        </Center>
      </MenuItem>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Excluir Nota</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Tem certeza que deseja excluir ? Essa ação não pode ser desfeita.
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleConfirm}>
              Excluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
