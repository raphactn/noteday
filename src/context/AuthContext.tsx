// context-fb.tsx
import React, { useEffect, useState, createContext } from "react";
import { auth } from "../services/firebase";
import { User } from "firebase/auth";

export interface IAuthContext {
  user: User;
}

const AuthContext = createContext<any>(null);
const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<IAuthContext | null | any>(
    null
  );

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
