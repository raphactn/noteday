import { useContext } from "react";
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../services/firebase";
import { AuthContext } from "../../context/AuthContext";
import { CiLogout } from "react-icons/ci";
import { ExportNotes } from "../ExportNotes";

interface Notes {
  id: string;
  title: string;
  color: string;
  description: string;
  userId: string;
}

interface NavProps {
  notes: Array<Notes>;
}

export default function Nav(props: NavProps) {
  const { notes } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const { currentUser, setCurrentUser }: any = useContext(AuthContext);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        setCurrentUser(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logout = () => {
    auth.signOut();
    setCurrentUser({});
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Box p={3}>
            <Image src="/logo.png" w="110px" />
          </Box>
          <Flex alignItems={"center"} zIndex={99}>
            <Stack direction={"row"} alignItems="center" spacing={5}>
              <ExportNotes notes={notes} />
              <IconButton
                onClick={toggleColorMode}
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                aria-label={""}
              />
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"md"}
                    bg={"#5271ff"}
                    name={(currentUser?.displayName as string) || "Notes Day"}
                    src={currentUser?.photoURL as string}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      bg={"#5271ff"}
                      size={"2xl"}
                      name={(currentUser?.displayName as string) || "Notes Day"}
                      src={currentUser?.photoURL as string}
                    />
                  </Center>
                  <br />
                  <Center>{currentUser?.displayName as string}</Center>
                  <br />
                  <MenuDivider />
                  {!currentUser?.providerId ? (
                    <Center p={2}>
                      <Button
                        w={"full"}
                        variant={"outline"}
                        leftIcon={<FcGoogle />}
                        onClick={handleGoogleSignIn}
                      >
                        <Text>Sign in with Google</Text>
                      </Button>
                    </Center>
                  ) : (
                    <MenuItem onClick={logout}>
                      <Center gap={2}>
                        {" "}
                        <CiLogout fontSize={"25px"} /> Logout
                      </Center>
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
