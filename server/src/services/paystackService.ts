import axios from "axios";
import logger from "../utils/logger";

interface InitializeTransactionParams {
  email: string;
  amount: number;
  reference: string;
  callback_url?: string;
  metadata?: any;
}

interface PaystackResponse {
  status: boolean;
  message: string;
  data: any;
}

export const PaystackService = () => {
  const getHeaders = () => ({
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  });
  async function initializeTransaction(params: InitializeTransactionParams) {
    try {
      const response = await axios.post(
        `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`,
        params,
        { headers: getHeaders() }
      );

      if (!response.data.status) {
        throw new Error(
          response.data.message || "Failed to initialize transaction"
        );
      }

      return response.data.data;
    } catch (error: any) {
      logger.error(
        "Paystack initialization error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to initialize payment"
      );
    }
  }

  async function verifyTransaction(
    reference: string
  ): Promise<PaystackResponse> {
    try {
      const response = await axios.get(
        `${process.env.PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        { headers: getHeaders() }
      );

      return response.data;
    } catch (error: any) {
      logger.error(
        "Paystack verification error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to verify payment"
      );
    }
  }

  async function listTransactions(params?: {
    perPage?: number;
    page?: number;
  }): Promise<PaystackResponse> {
    try {
      const response = await axios.get(
        `${process.env.PAYSTACK_BASE_URL}/transaction`,
        {
          headers: getHeaders(),
          params,
        }
      );

      return response.data;
    } catch (error: any) {
      logger.error(
        "Paystack list error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to fetch transactions");
    }
  }

  return {
    initializeTransaction,
    verifyTransaction,
    listTransactions,
  };
};
