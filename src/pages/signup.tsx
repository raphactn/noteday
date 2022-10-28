import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Image,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../services/firebase";
import { FcGoogle } from "react-icons/fc";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

const signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser, setCurrentUser }: any = useContext(AuthContext);

  const [createUserWithEmailAndPassword, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const handleSignIn = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    createUserWithEmailAndPassword(email, password);
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
    <>
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
            <Heading fontSize={"2xl"} textAlign={"center"}>
              Crie sua conta
            </Heading>
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
              <HStack></HStack>
              <FormControl id="email" isRequired>
                <FormLabel>Inserir Email</FormLabel>
                <Input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Inserir Senha</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  size="lg"
                  bg={"#5271ff"}
                  color={"white"}
                  _hover={{
                    opacity: 0.9,
                  }}
                  isLoading={Boolean(loading)}
                  loadingText="Criando conta"
                  onClick={handleSignIn}
                >
                  Criar conta
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
                <Text align={"center"}>
                  Já é um usuário?{" "}
                  <Link color={"blue.400"} href="/login">
                    Login
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

export default signup;
