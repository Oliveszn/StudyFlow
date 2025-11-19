"use client";

import { useCheckAuth } from "@/hooks/endpoints/useAuth";
import { useAppSelector } from "@/store/hooks";
import { ReactNode, useEffect } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading } = useCheckAuth();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}
