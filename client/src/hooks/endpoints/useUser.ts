"use client";
import { userApi } from "@/api/endpoints/user";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to get user profile
 */
export const useProfile = () => {
  return useQuery({
    queryKey: ["getProfile"],
    queryFn: () => userApi.getUserProfile(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
