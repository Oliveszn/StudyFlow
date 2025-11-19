import { AuthResponse } from "@/utils/types/authTypes";
import { LoginSchema, RegisterSchema } from "@/utils/validationSchema";
import apiClient from "../client";

export const authApi = {
  registerUser: async (form: RegisterSchema) => {
    const response = await apiClient.post<AuthResponse>(
      `/api/auth/register`,
      form,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  loginUser: async (form: LoginSchema) => {
    const response = await apiClient.post<AuthResponse>(
      `/api/auth/login`,
      form,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  logoutUser: async () => {
    const response = await apiClient.post(
      `/api/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post(`/api/auth/refresh-token`);
    return response.data;
  },

  checkAuthStatus: async () => {
    const response = await apiClient.get(`/api/auth/me`, {
      withCredentials: true,
    });

    return response.data;
  },
};
