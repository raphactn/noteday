import { ReactNode, useEffect, useState, useContext } from "react";
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
import { auth } from "../../services/firebase";
import { UserContext } from "../../context/UserContext";
import { useRouter } from "next/router";

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, setUser }: any = useContext(UserContext);
  const router = useRouter()

  const logout = () => {
    auth.signOut();
    setUser({});
    router.push('/login')
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
                    <MenuItem onClick={logout}>
                      <Text>Logout</Text>
                    </MenuItem>
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
