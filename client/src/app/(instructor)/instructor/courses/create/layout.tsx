"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { resetForm } from "@/store/CreateCourseSlice";

export default function CreateCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
