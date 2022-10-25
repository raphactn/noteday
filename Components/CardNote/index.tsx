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
import { CreateNoteModal } from "../CreateNoteModal";

interface CardProps {
  note: any;
  index: number;
  setChangeNote: (changeNote: boolean) => void;
  changeNote: boolean;
  notes: any;
}

export const CardNote = (props: CardProps) => {
  const { index, setChangeNote, changeNote, notes, note } = props;
  const [modalOpen, setModalOpen] = useState(false);

  const handleDeletNote = (value: any) => {
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
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
              <IconButton
                size="sm"
                onClick={handleDeletNote}
                icon={<DeleteIcon color="red.500" />}
                aria-label={""}
              />
            </HStack>
          </Center>
        </Box>
        <Divider mt={4} mb={5} />
        <Box>{note.description}</Box>
      </Flex>
    </>
  );
};
