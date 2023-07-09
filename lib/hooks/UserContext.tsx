import { ReactNode, createContext, useContext, useState } from "react";
import { UserInfo } from "../types";

interface UserContextProps {
  user: UserInfo;
  setUser: (user: UserInfo | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const value = {
    get user() {
      if (!user) {
        throw new Error("User is not set");
      }
      return user;
    },
    setUser,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a CountProvider");
  }
  return context;
};

export { UserProvider, useUser };
