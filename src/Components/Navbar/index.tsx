import { useEffect, useContext } from "react";
import {
  Box,
  Flex,
  Avatar,
  Link,
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
  Heading,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FcGoogle } from "react-icons/fc";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../services/firebase";
import { AuthContext } from "../../context/AuthContext";

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { currentUser, setCurrentUser }: any = useContext(AuthContext)

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
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <Heading fontSize="larger">Notes Day</Heading>
          </Box>

          <Flex alignItems={"center"} zIndex={99}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    name={currentUser?.displayName as string}
                    src={currentUser?.photoURL as string}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      name={currentUser?.displayName as string}
                      src={currentUser?.photoURL as string}
                    />
                  </Center>
                  <br />
                  <Center>{currentUser?.displayName as string}</Center>
                  <br />
                  <MenuDivider />
                  <Center p={2}>
                    {!currentUser?.providerId ? (
                      <Button
                        w={"full"}
                        variant={"outline"}
                        leftIcon={<FcGoogle />}
                        onClick={handleGoogleSignIn}
                      >
                        <Text>Sign in with Google</Text>
                      </Button>
                    ) : (
                      <MenuItem onClick={logout}>
                        Logout
                      </MenuItem>
                    )}
                  </Center>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
