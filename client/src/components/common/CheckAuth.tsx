"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { type ReactNode } from "react";
import { useAuthState } from "@/hooks/endpoints/useAuth";

interface CheckAuthProps {
  children: ReactNode;
}

const CheckAuth = ({ children }: CheckAuthProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthState();
  useEffect(() => {
    const protectedRoutes = ["/dashboard"];
    const authRoutes = ["/auth", "/login", "/register"];

    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    if (!isAuthenticated && isProtectedRoute) {
      router.replace("/auth/login");
      return;
    }

    if (isAuthenticated && isAuthRoute) {
      router.replace("/dashboard");
      return;
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
};

export default CheckAuth;
