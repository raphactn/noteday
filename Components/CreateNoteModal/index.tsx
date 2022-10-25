import { AddIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

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
  const { isOpen, onClose } = useDisclosure({
    isOpen: open,
    onClose() {
      setOpen(!open);
    },
  });
  const [note, setNote] = useState<Array<any>>([]);

  useEffect(() => {
    let notesLocal: any = localStorage.getItem("notes");
    if(notesLocal){
        setNote(JSON.parse(notesLocal).filter((item: any) => item.id !== data?.id));
    }
  }, [isOpen]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      color: ""
    },
    onSubmit: (values) => {
      handleAddNote(values);
    },
  });

  useEffect(() => {
    if (data?.id) {
      formik.setValues({
        title: data?.title,
        description: data?.description,
        color: data?.color
      });
    } else {
      formik.setValues({
        title: "",
        description: "",
        color: ""
      });
    }
  }, [isOpen]);

  const handleAddNote = (value: any) => {
    const notes = [];
    notes.push(...note, {
      id: Math.floor(Date.now() * Math.random()).toString(36),
      title: value.title,
      description: value.description,
      color: value.color
    });
    localStorage.setItem("notes", JSON.stringify(notes));
    onClose();
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
                    onChange={formik.handleChange}
                    value={formik.values.title}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Cor</FormLabel>
                  <Input
                    type="color"
                    name="color"
                    onChange={formik.handleChange}
                    value={formik.values.color}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Descrição</FormLabel>
                  <Textarea
                    name="description"
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
