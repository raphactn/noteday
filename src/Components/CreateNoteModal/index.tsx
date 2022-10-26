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
import { database } from "../../services/firebase";

interface NoteProps {
  title: string;
  description: string;
  id: string;
  color: string;
}

interface ModalProps {
  setOpen: (open: boolean) => void;
  open: boolean;
  data: NoteProps | any;
}

export const CreateNoteModal = (props: ModalProps) => {
  const { open, data, setOpen } = props;
  const [color, setColor] = useState("");
  const databaseRef = collection(database, "notes");
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
    onSubmit: (values) => {
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
      formik.setValues({
        title: "",
        description: "",
      });
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

  const handleUpdateNote = async (value: any) => {
    let fieldToEdit = doc(database, "notes", data.id);
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
  };

  const colors = [
    "#ED8936",
    "#ECC94B",
    "#48BB78",
    "#4299E1",
    "#0BC5EA",
    "#9F7AEA",
    "#ED64A6",
    "#E53E3E",
  ];
  console.log(data);
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
                        icon={color === item ? <CheckIcon /> : <></>}
                        colorScheme={item}
                        onClick={() => setColor(item)}
                        size="sm"
                        bg={item}
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
