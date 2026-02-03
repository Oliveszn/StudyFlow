"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { resetForm } from "@/store/CreateCourseSlice";

export default function CreateCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  // Reset form when component unmounts (user navigates away)
  //   useEffect(() => {
  //     return () => {
  //       // Optional: only reset if user is navigating away without completing
  //       dispatch(resetForm());
  //     };
  //   }, [dispatch]);

  return <>{children}</>;
}
