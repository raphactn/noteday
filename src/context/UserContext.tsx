import { User } from "firebase/auth";
import { createContext, useState } from "react";

const UserContext = createContext({});

const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>({} as User);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export {UserContext, UserProvider}