"use client";

import { createContext, useContext } from "react";
import type { UserProfile } from "@/features/auth/types";

const UserContext = createContext<UserProfile | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: UserProfile;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useCurrentUser() {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useCurrentUser must be used within UserProvider");
  }
  return user;
}
