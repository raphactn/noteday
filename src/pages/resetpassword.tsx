import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { auth } from "../services/firebase";
import Link from "next/link";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";

const resetpassword = () => {
  const [email, setEmail] = useState("");

  const [sendPasswordResetEmail, loading, error] =
    useSendPasswordResetEmail(auth);

  const handleSignIn = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if(!email){
        return
    }
    sendPasswordResetEmail(email);
  };

  return (
    <>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
          <Image src="/logo.png" w="50%" />
            <Text fontSize={"lg"} color={"gray.600"}>
            Não consegue entrar?
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Enviaremos um link de recuperação para</FormLabel>
                <Input
                  type="email"
                  placeholder="Digite seu email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <Stack spacing={10} pt={2}>
                <Button
                  size="lg"
                  bg={"#5271ff"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  isLoading={Boolean(loading)}
                  loadingText="Enviando"
                  onClick={handleSignIn}
                >
                  Enviar link de recuperação
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  <Link color={"blue.400"} href="/login">
                    Voltar à página de entrada
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
};
export default resetpassword;
