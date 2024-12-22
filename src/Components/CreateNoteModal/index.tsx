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
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{data ? "Editar Nota" : "Nova Nota"}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={formik.handleSubmit}>
            <ModalBody>
              <Flex gap={5} direction="column">
                <FormControl>
                  <FormLabel>Titulo</FormLabel>
                  <Input
                    type="text"
                    name="title"
                    required
                    onChange={formik.handleChange}
                    value={formik.values.title}
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
                        size="sm"
                        bg={item.color}
                        aria-label={""}
                      />
                    ))}
                  </Center>
                </FormControl>
                <FormControl>
                  <FormLabel>Descrição</FormLabel>
                  <Textarea
                    name="description"
                    required
                    onChange={formik.handleChange}
                    value={formik.values.description}
                  />
                </FormControl>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="blue" type="submit">
                {data ? "Editar" : "Salvar"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
