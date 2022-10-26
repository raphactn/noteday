import { ReactNode, useEffect, useState } from "react";
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
  useDisclosure,
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
  User,
  signOut,
} from "firebase/auth";
import { auth } from "../../services/firebase";

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [user, setUser] = useState<User | any>({} as User);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logout = () => {
    auth.signOut();
    setUser({});
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <Heading fontSize="larger">Notes Day</Heading>
          </Box>

          <Flex alignItems={"center"}>
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
                    name={user.displayName as string}
                    src={user.photoURL as string}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      name={user.displayName as string}
                      src={user.photoURL as string}
                    />
                  </Center>
                  <br />
                  <Center>{user.displayName as string}</Center>
                  <br />
                  <MenuDivider />
                  <Center p={2}>
                    {!user.providerId ? (
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
                        <Text>Logout</Text>
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
function then(arg0: (result: any) => void) {
  throw new Error("Function not implemented.");
}
