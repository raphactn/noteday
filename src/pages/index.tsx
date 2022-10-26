import { AddIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Select,
  Container,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Head from "next/head";
import { useEffect, useState, useContext } from "react";
import { CardNote } from "../Components/CardNote";
import { CreateNoteModal } from "../Components/CreateNoteModal";
import Nav from "../Components/Navbar";
import { WarningToast } from "../Components/WarningToast";
import { database } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

interface Notes {
  id: string;
  title: string;
  color: string;
  description: string;
  userId: string;
}

const Home = () => {
  const [notes, setNotes] = useState<Array<any>>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [changeNote, setChangeNote] = useState(false);
  const [color, setColor] = useState("");
  const databaseRef = collection(database, "notes");
  const [filterNotes, setFilterNotes] = useState<Array<Notes>>([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if(!currentUser){
      setNotes([])
    }
    const getData = async () => {
      await getDocs(databaseRef).then((response) => {
        return setNotes(
          response.docs
            .map((data) => {
              return { ...data.data(), id: data.id };
            })
            .filter((note: any) => {
              return note.userId === currentUser?.uid;
            })
        );
      });
    };
    getData();
  }, [modalOpen, changeNote, currentUser]);

  const filterSearch = () => {
    if (search) {
      setFilterNotes(
        notes.filter((item) =>
          String(item.title).toLowerCase().startsWith(search.toLowerCase())
        )
      );
    } else {
      setFilterNotes([]);
    }
  };

  const filterColor = () => {
    if (color) {
      setFilterNotes(notes.filter((item) => item.color === color));
    } else {
      setFilterNotes([]);
    }
  };

  useEffect(() => {
    if (search) {
      filterSearch();
    } else {
      filterColor();
    }
  }, [search, color]);

  const colors = [
    { name: "Laranja", color: "#ED8936" },
    { name: "Amarelo", color: "#ECC94B" },
    { name: "Verde", color: "#48BB78" },
    { name: "Azul", color: "#4299E1" },
    { name: "Teal", color: "#0BC5EA" },
    { name: "Roxo", color: "#9F7AEA" },
    { name: "Rose", color: "#ED64A6" },
    { name: "Vermelho", color: "#E53E3E" },
  ];

  return (
    <div>
      <Head>
        <title>Home - Notes Day</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <Container maxW={"container.xl"} mt={10} mb={10}>
        <CreateNoteModal
          open={modalOpen}
          setOpen={setModalOpen}
          data={undefined}
        />
        <WarningToast />
        <Flex
          justifyContent={"space-between"}
          gap={5}
          flexDirection={{ base: "column", md: "row" }}
        >
          <Box>
            <Button
              rightIcon={<AddIcon />}
              onClick={() => setModalOpen(!modalOpen)}
            >
              Nova Nota
            </Button>
          </Box>
          <Center gap={5}>
            <Box w={"100%"}>
              <Select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder={"Filtre por cor"}
              >
                <option>Todas as cores</option>
                {colors.map((color, i) => (
                  <option key={i} value={color.color}>
                    {color.name}
                  </option>
                ))}
              </Select>
            </Box>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Search2Icon />}
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Procure por Notas"
              />
            </InputGroup>
          </Center>
        </Flex>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
          spacing={5}
          mt={10}
        >
          {filterNotes.length > 0
            ? filterNotes?.map((note, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: "2vw" }}
                  animate={{ opacity: 1, y: "0px" }}
                  transition={{ type: "spring", duration: 1, bounce: 0 }}
                >
                  <Box key={i}>
                    <CardNote
                      note={note}
                      changeNote={changeNote}
                      setChangeNote={setChangeNote}
                    />
                  </Box>
                </motion.div>
              ))
            : notes?.map((note, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: "2vw" }}
                  animate={{ opacity: 1, y: "0px" }}
                  transition={{ type: "spring", duration: 1, bounce: 0 }}
                >
                  <Box>
                    <CardNote
                      note={note}
                      changeNote={changeNote}
                      setChangeNote={setChangeNote}
                    />
                  </Box>
                </motion.div>
              ))}
        </SimpleGrid>
      </Container>
    </div>
  );
};

export default Home;
