// pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { UserProvider } from "../context/UserContext";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { auth } from "../services/firebase";

function MyApp({ Component, pageProps }: AppProps) {
  const { user, setUser }: any = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (user?.uid) {
      router.push("/");
    } else {
      router.push("/login");
    }
  }, [user]);

  return (
    <ChakraProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ChakraProvider>
  );
}

export default MyApp;
