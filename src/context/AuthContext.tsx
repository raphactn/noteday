import React, { useEffect, useState, createContext } from "react";
import { auth } from "../services/firebase";
import { User } from "firebase/auth";
import { useRouter } from "next/router";

export interface IAuthContext {
  user: User;
}

const AuthContext = createContext<any>(null);
const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<IAuthContext | null | User>(
    null
  );
  const router = useRouter()

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        router.replace('/home')
      }else{
        router.replace('/login')
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
