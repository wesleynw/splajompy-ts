"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { User } from "@/db/schema";

type UserContextType = {
  user: User;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type Props = {
  user: User;
  children: ReactNode;
};

export default function UserProvider({ user, children }: Readonly<Props>) {
  const value = useMemo(() => ({ user }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context.user;
}
