import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Center,
  Text,
  useColorModeValue,
  Image,
  FormHelperText,
} from "@chakra-ui/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../services/firebase";
import Link from "next/link";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

export default function SimpleCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser, setCurrentUser }: any = useContext(AuthContext);

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const passwordError = error?.code === "auth/wrong-password";
  const emailError = error?.code === "auth/user-not-found";

  const handleSignIn = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    signInWithEmailAndPassword(email, password);
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        setCurrentUser(result.user);
        localStorage.setItem("token", currentUser.accessToken);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={5} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Center>
          <Image src="/logo.png" w="50%" />
        </Center>
        <Stack align={"center"}>
          <Heading fontSize={"2xl"}>Faça login em sua conta</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            e comece a criar suas notas ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email" isInvalid={emailError}>
              <FormLabel>Inserir Email</FormLabel>
              <Input type="email" onChange={(e) => setEmail(e.target.value)} />
              {emailError ? (
                <FormHelperText>Conta de email não encontrada</FormHelperText>
              ) : null}
            </FormControl>
            <FormControl id="password" isInvalid={passwordError}>
              <FormLabel>Inserir Senha</FormLabel>
              <Input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError ? (
                <FormHelperText>Senha incorreta</FormHelperText>
              ) : null}
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={"#5271ff"}
                color={"white"}
                _hover={{
                  opacity: 0.9
                }}
                onClick={handleSignIn}
                isLoading={loading}
                loadingText="Entrando"
              >
                Fazer login
              </Button>
            </Stack>
            <Text textAlign="center">OU</Text>
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
            <Stack pt={6}>
              <Center gap={3}>
                <Link color={"blue.400"} href="/resetpassword">
                  Não conseguiu entrar?
                </Link>
                |
                <Link color={"blue.400"} href="/signup">
                  Criar conta
                </Link>
              </Center>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
