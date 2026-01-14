import apiClient from "@/api/client";

export interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UserResponse {
  success: boolean;
  data: UserProfile;
}

export const userApi = {
  getUserProfile: async () => {
    const { data } = await apiClient.get<UserResponse>(`/api/users/profile`);

    return data.data;
  },
};
