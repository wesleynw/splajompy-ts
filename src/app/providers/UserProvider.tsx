"use client";

import { User } from "@/db/schema";
import { usePostHog } from "posthog-js/react";
import { createContext, ReactNode, useContext, useMemo } from "react";

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

  const posthog = usePostHog();
  posthog.identify(String(user.user_id), {
    email: user.email,
    username: user.username,
  });

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context.user;
}
