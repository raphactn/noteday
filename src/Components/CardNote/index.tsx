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
  Button,
  Tooltip,
  Portal,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ConfirmationModal } from "../ConfirmationModal";
import { CreateNoteModal } from "../CreateNoteModal";
import { doc, deleteDoc, addDoc, collection } from "firebase/firestore";
import { auth, database } from "../../services/firebase";
import { MdContentCopy } from "react-icons/md";
import { CgCopy } from "react-icons/cg";
import { SlOptionsVertical } from "react-icons/sl";
import { User } from "firebase/auth";

interface Note {
  id: string;
  title: string;
  description: string;
  color: string;
}

interface CardProps {
  note: Note;
}

export const CardNote = (props: CardProps) => {
  const { note } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();
  const currentUser: User | null = auth.currentUser;
  const databaseRef = collection(database, `notes/${currentUser?.uid}/data`);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      toast({
        title: `Nota copiada!`,
        position: "top-right",
        status: "success",
        isClosable: true,
      });
    });
  };
  const handleCopyFormat = (value: string) => {
    const textSplit = value.split(",");
    const result = [];

    for (const item of textSplit) {
      if (item.includes("+55")) {
        // Remove "+55", caracteres não numéricos e espaços extras
        let formattedNumber = item.replace("+55", "").replace(/\D/g, "").trim();

        // Adiciona o "9" após o DDD se o número tiver 10 dígitos
        if (formattedNumber.length === 10) {
          formattedNumber = formattedNumber.replace(/^(\d{2})(\d+)/, "$19$2");
        }

        result.push(formattedNumber);
      }
    }

    navigator.clipboard.writeText(result.join()).then(() => {
      toast({
        title: `Nota copiada!`,
        position: "top-right",
        status: "success",
        isClosable: true,
      });
    });
  };

  const handleCloneNote = (value: any) => {
    const note = {
      title: value.title,
      description: value.description,
      color: value.color,
      userId: currentUser?.uid,
    };
    addDoc(databaseRef, note)
      .then(() => {
        toast({
          title: `Nota adicionada com sucesso!`,
          position: "top-right",
          status: "success",
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: `Erro ao adicionar a nota :(`,
          position: "top-right",
          status: "error",
          isClosable: true,
        });
      });
  };

  const handleDeletNote = () => {
    let fieldToDelete = doc(
      database,
      `notes/${currentUser?.uid}/data`,
      note.id
    );
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
  };

  return (
    <>
      <CreateNoteModal open={modalOpen} setOpen={setModalOpen} data={note} />
      <Flex
        bg={useColorModeValue("gray.100", "gray.900")}
        direction="column"
        p={5}
        rounded={"md"}
        borderBottom={`7px solid ${note.color}`}
        boxShadow="rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
      >
        <Box>
          <Center justifyContent={"space-between"} gap={5}>
            <Heading wordBreak={"break-word"} fontSize="medium">
              {note.title}
            </Heading>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<SlOptionsVertical />}
                variant="outline"
                size="sm"
              />
              <Portal>
                <MenuList>
                  <MenuItem onClick={() => handleCloneNote(note)}>
                    <Center gap={2}>
                      <CgCopy />
                      <Text>Duplicar Nota</Text>
                    </Center>
                  </MenuItem>
                  <MenuItem onClick={() => setModalOpen(!modalOpen)}>
                    <Center gap={2}>
                      <EditIcon />
                      <Text>Editar Nota</Text>
                    </Center>
                  </MenuItem>
                  <MenuItem onClick={() => handleCopyFormat(note.description)}>
                    <Center gap={2}>
                      <MdContentCopy />
                      <Text>Copiar e formatar</Text>
                    </Center>
                  </MenuItem>
                  <ConfirmationModal onConfirm={() => handleDeletNote()} />
                </MenuList>
              </Portal>
            </Menu>
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
        <Divider mt={5} mb={5} />
        <Button
          rightIcon={<MdContentCopy fontSize={"20px"} />}
          size={"sm"}
          onClick={() => handleCopy(note.description)}
        >
          Copiar
        </Button>
      </Flex>
    </>
  );
};
