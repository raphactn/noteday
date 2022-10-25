import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  useColorModeValue,
  Divider,
  Center,
  Text,
  HStack,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ConfirmationModal } from "../ConfirmationModal";
import { CreateNoteModal } from "../CreateNoteModal";

interface CardProps {
  note: any;
  setChangeNote: (changeNote: boolean) => void;
  changeNote: boolean;
  notes: any;
}

export const CardNote = (props: CardProps) => {
  const { setChangeNote, changeNote, notes, note } = props;
  const [modalOpen, setModalOpen] = useState(false);

  const handleDeletNote = () => {
    let arr = notes.filter((e: any) => e.id !== note.id);
    localStorage.setItem("notes", JSON.stringify(arr));
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
        data={{
          description: note.description,
          id: note.id,
          title: note.title,
          color: note.color,
        }}
      />
      <Flex
        bg={useColorModeValue("gray.100", "gray.900")}
        direction="column"
        p={5}
        rounded={"xl"}
        borderBottom={`7px solid ${note.color}`}
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
