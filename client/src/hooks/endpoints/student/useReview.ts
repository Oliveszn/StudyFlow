import { Review } from "@/api/endpoints/courses";
import { PaginatedReviews, reviewsApi } from "@/api/endpoints/student/review";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Get my reviews
export const useMyReviews = (page = 1, limit = 10) =>
  useQuery<PaginatedReviews>({
    queryKey: ["my-reviews", page, limit],
    queryFn: () => reviewsApi.getMyReviews(page, limit),
  });

// Get my review for a specific course
export const useMyReviewForCourse = (courseId: string) =>
  useQuery<Review | null>({
    queryKey: ["my-review", courseId],
    queryFn: () => reviewsApi.getMyReviewForCourse(courseId),
    staleTime: 5 * 60 * 1000,
  });

// Create review
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      rating,
      comment,
    }: {
      courseId: string;
      rating: number;
      comment: string;
    }) => reviewsApi.createReview(courseId, rating, comment),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["my-review", courseId] });
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
    },
  });
};

// Update review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reviewId,
      rating,
      comment,
    }: {
      reviewId: string;
      rating: number;
      comment: string;
    }) => reviewsApi.updateReview(reviewId, rating, comment),
    onSuccess: (_, { reviewId }) => {
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
    },
  });
};

// Delete review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => reviewsApi.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
    },
  });
};
