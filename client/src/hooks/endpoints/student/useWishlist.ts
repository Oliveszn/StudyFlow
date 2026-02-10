// hooks/wishlistHooks.ts
import {
  wishlistApi,
  WishlistCheckResponse,
  WishlistListResponse,
} from "@/api/endpoints/student/wishlist";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Fetch wishlist
export const useWishlist = (params?: { page?: number; limit?: number }) => {
  return useQuery<WishlistListResponse>({
    queryKey: ["wishlist", params],
    queryFn: () => wishlistApi.getWishlist(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Add course to wishlist
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => wishlistApi.addToWishlist(courseId),
    onSuccess: () => {
      toast.success("Course added to wishlist");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add to wishlist");
    },
  });
};

// Remove course from wishlist
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => wishlistApi.removeFromWishlist(courseId),
    onSuccess: () => {
      toast.success("Course removed from wishlist");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to remove from wishlist");
    },
  });
};

// Check if a course is in wishlist
export const useCheckWishlist = (courseId: string) => {
  return useQuery<WishlistCheckResponse>({
    queryKey: ["wishlist-check", courseId],
    queryFn: () => wishlistApi.checkInWishlist(courseId),
    staleTime: 5 * 60 * 1000,
  });
};

// Clear wishlist
export const useClearWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => wishlistApi.clearWishlist(),
    onSuccess: () => {
      toast.success("Wishlist cleared");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to clear wishlist");
    },
  });
};
