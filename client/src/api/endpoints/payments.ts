import apiClient from "../client";

export interface PaymentInitializationResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    reference: string;
    authorizationUrl: string;
    accessCode: string;
    amount: number;
    currency: string;
  };
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  data: {
    transaction: Transaction;
    enrolled: boolean;
  };
}

export interface Transaction {
  id: string;
  courseId: string;
  courseName: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  providerTransactionId: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface TransactionHistoryResponse {
  success: boolean;
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const paymentApi = {
  initializePayment: async (
    courseId: string,
  ): Promise<PaymentInitializationResponse> => {
    const { data } = await apiClient.post<PaymentInitializationResponse>(
      "/api/payments/initialize",
      { courseId },
    );
    return data;
  },

  verifyPayment: async (
    reference: string,
  ): Promise<PaymentVerificationResponse> => {
    const { data } = await apiClient.get<PaymentVerificationResponse>(
      `/api/payments/verify/${reference}`,
    );
    return data;
  },

  getTransactionHistory: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<TransactionHistoryResponse> => {
    const { data } = await apiClient.get<TransactionHistoryResponse>(
      "/api/payments/transactions",
      { params },
    );
    return data;
  },

  getTransactionDetails: async (
    id: string,
  ): Promise<{ success: boolean; data: Transaction }> => {
    const { data } = await apiClient.get<{
      success: boolean;
      data: Transaction;
    }>(`/api/payments/transactions/${id}`);
    return data;
  },
};
