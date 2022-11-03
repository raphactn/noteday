import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { User } from "firebase/auth";
import { auth } from "../../services/firebase";
import { CiLogout } from "react-icons/ci";
import { ExportNotes } from "../ExportNotes";
import { useRouter } from "next/router";

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
  const currentUser: User | null = auth.currentUser
  const router = useRouter()

  const logout = () => {
    auth.signOut();
    router.push('/login')
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4} p={3}>
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Box>
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
                    name={currentUser?.displayName as string || currentUser?.email as string}
                    src={currentUser?.photoURL as string}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      bg={"#5271ff"}
                      size={"2xl"}
                      name={currentUser?.displayName as string || currentUser?.email as string}
                      src={currentUser?.photoURL as string}
                    />
                  </Center>
                  <br />
                  <Center p={2}>{currentUser?.displayName as string || currentUser?.email as string}</Center>
                  <br />
                  <MenuDivider />
                    <MenuItem onClick={logout}>
                      <Center gap={2}>
                        <CiLogout fontSize={"25px"} /> Logout
                      </Center>
                    </MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
