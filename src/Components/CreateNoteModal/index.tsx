import { CheckIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Flex,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Center,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { auth, database } from "../../services/firebase";
import { User } from "firebase/auth";
import { colors } from "../../utils/colors";

interface NoteProps {
  title: string;
  description: string;
  id: string;
  color: string;
}

interface ModalProps {
  setOpen: (open: boolean) => void;
  open: boolean;
  data?: NoteProps;
}

export const CreateNoteModal = (props: ModalProps) => {
  const { open, data, setOpen } = props;
  const [color, setColor] = useState("");
  const currentUser: User | null = auth.currentUser;
  const databaseRef = collection(database, `notes/${currentUser?.uid}/data`);
  const toast = useToast();
  const { isOpen, onClose } = useDisclosure({
    isOpen: open,
    onClose() {
      setOpen(!open);
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    onSubmit: (values: any) => {
      if (data) {
        handleUpdateNote(values);
      } else {
        handleAddNote(values);
      }
    },
  });

  useEffect(() => {
    if (data?.id) {
      formik.setValues({
        title: data?.title,
        description: data?.description,
      });
      setColor(data.color);
    } else {
      formik.setValues(formik.initialValues);
      setColor("");
    }
  }, [isOpen]);

  const handleAddNote = (value: any) => {
    const note = {
      title: value.title,
      description: value.description,
      color: color,
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
    onClose();
  };

  const handleUpdateNote = async (value: NoteProps) => {
    if (data) {
      let fieldToEdit = doc(
        database,
        `notes/${currentUser?.uid}/data`,
        data.id
      );
      await updateDoc(fieldToEdit, {
        title: value.title,
        description: value.description,
        color: color,
      })
        .then(() => {
          toast({
            title: `Nota editada com sucesso!`,
            position: "top-right",
            status: "success",
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: `Erro ao editar a nota :(`,
            position: "top-right",
            status: "error",
            isClosable: true,
          });
        });
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{data ? "Editar Nota" : "Nova Nota"}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={formik.handleSubmit}>
            <ModalBody>
              <Stack spacing={5}>
                <FormControl isRequired>
                  <FormLabel>Titulo</FormLabel>
                  <Input
                    type="text"
                    name="title"
                    variant={"filled"}
                    onChange={formik.handleChange}
                    value={formik.values.title}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Descrição</FormLabel>
                  <Textarea
                    name="description"
                    variant={"filled"}
                    rows={5}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Cor</FormLabel>
                  <Center gap={3} mt={5} mb={2}>
                    {colors.map((item, i) => (
                      <IconButton
                        key={i}
                        icon={color === item.color ? <CheckIcon /> : <></>}
                        colorScheme={item.color}
                        onClick={() => setColor(item.color)}
                        rounded={"full"}
                        bg={item.color}
                        aria-label={""}
                      />
                    ))}
                  </Center>
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter gap={5}>
              <Button variant="solid" w={"full"} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="blue" w={"full"} type="submit">
                {data ? "Editar" : "Salvar"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
