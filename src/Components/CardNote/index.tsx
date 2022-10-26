import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  useColorModeValue,
  Divider,
  Center,
  useToast,
  HStack,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ConfirmationModal } from "../ConfirmationModal";
import { CreateNoteModal } from "../CreateNoteModal";
import {doc, deleteDoc } from "firebase/firestore";
import { database } from "../../services/firebase";

interface CardProps {
  note?: any;
  setChangeNote: (changeNote: boolean) => void;
  changeNote: boolean;
}

export const CardNote = (props: CardProps) => {
  const { setChangeNote, changeNote, note } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();

  const handleDeletNote = () => {
    let fieldToDelete = doc(database, "notes", note.id);
    deleteDoc(fieldToDelete)
    .then(() => {
      toast({
        title: `Nota excluida com sucesso!`,
        position: "top-right",
        status: "success",
        isClosable: true,
      });
    })
    .catch((err) => {
      toast({
        title: `Erro ao excluir a nota :(`,
        position: "top-right",
        status: "error",
        isClosable: true,
      });
    });
    setChangeNote(!changeNote);
  };

  useEffect(() => {
    setChangeNote(!changeNote);
  }, [modalOpen]);

  return (
    <>
      <CreateNoteModal
        open={modalOpen}
        setOpen={setModalOpen}
        data={note}
      />
      <Flex
        bg={useColorModeValue("gray.100", "gray.900")}
        direction="column"
        p={5}
        rounded={"xl"}
        borderBottom={`7px solid ${note.color}`}
        boxShadow='rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
      >
        <Box>
          <Center justifyContent={"space-between"} gap={5}>
            <Heading wordBreak={"break-word"} fontSize="medium">
              {note.title}
            </Heading>
            <HStack spacing={2}>
              <IconButton
                size="sm"
                icon={<EditIcon />}
                aria-label={""}
                onClick={() => setModalOpen(!modalOpen)}
              />
              <ConfirmationModal
                onConfirm={() => handleDeletNote()}
              />
            </HStack>
          </Center>
        </Box>
        <Divider mt={4} mb={5} />
        <Box
          maxH="300px"
          overflow="auto"
          p={2}
          css={{
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: note.color,
              borderRadius: "24px",
            },
          }}
        >
          {note.description}
        </Box>
      </Flex>
    </>
  );
};
