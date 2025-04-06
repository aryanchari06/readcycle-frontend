"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    setUser(); // Load user from cookies on mount
  }, []);

  return <>{children}</>;
}
