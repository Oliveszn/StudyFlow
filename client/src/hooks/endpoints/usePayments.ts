import {
  paymentApi,
  PaymentVerificationResponse,
  Transaction,
  TransactionHistoryResponse,
} from "@/api/endpoints/payments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInitializePayment = () => {
  return useMutation({
    mutationFn: (courseId: string) => paymentApi.initializePayment(courseId),
    onError: (error: any) => {
      toast.error(error?.message || "Payment initialization failed");
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reference: string) => paymentApi.verifyPayment(reference),
    onSuccess: (data: PaymentVerificationResponse) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Payment verification failed");
    },
  });
};

export const useTransactionHistory = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  return useQuery<TransactionHistoryResponse>({
    queryKey: ["transactions", params],
    queryFn: () => paymentApi.getTransactionHistory(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useTransactionDetails = (id: string) => {
  return useQuery<{ success: boolean; data: Transaction }>({
    queryKey: ["transaction", id],
    queryFn: () => paymentApi.getTransactionDetails(id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
