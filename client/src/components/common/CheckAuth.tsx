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
  const { user, isAuthenticated } = useAuthState();

  // Public routes
  const isPublicRoute =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname.startsWith("/become-instructor");

  // Protected route prefixes
  const isStudentRoute =
    pathname.startsWith("/dashboard") ||
    // pathname.startsWith("/courses") ||
    pathname.startsWith("/my-learning");
  const isInstructorRoute = pathname.startsWith("/instructor");
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    //// redirect to login if accessing protected route and no auth
    if (
      !isAuthenticated &&
      (isStudentRoute || isInstructorRoute || isAdminRoute)
    ) {
      router.replace("/auth/login");
      return;
    }

    if (!isAuthenticated || !user) return;

    /////block public routes if logged in
    if (isPublicRoute) {
      if (user.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else if (user.role === "INSTRUCTOR") {
        router.replace("/instructor/dashboard");
      } else {
        router.replace("/dashboard");
      }
      return;
    }

    ////STUDENT trying to access instructor/admin
    if (isInstructorRoute && user.role !== "INSTRUCTOR") {
      router.replace("/dashboard");
      return;
    }

    if (isAdminRoute && user.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    ////INSTRUCTOR trying to access student/admin
    if (isStudentRoute && user.role !== "STUDENT") {
      router.replace("/instructor/dashboard");
      return;
    }
  }, [isAuthenticated, router, pathname, user]);

  return <>{children}</>;
};

export default CheckAuth;
