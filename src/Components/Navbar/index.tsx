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
  Image,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../services/firebase";
import { AuthContext } from "../../context/AuthContext";
import { CiLogout } from "react-icons/ci";

export default function Nav() {
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
            <Stack direction={"row"} alignItems="center" spacing={7}>
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
                    size={"md"}
                    bg={'#5271ff'}
                    name={currentUser?.displayName as string || 'Notes Day'}
                    src={currentUser?.photoURL as string}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      bg={'#5271ff'}
                      size={"2xl"}
                      name={currentUser?.displayName as string || 'Notes Day'}
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
