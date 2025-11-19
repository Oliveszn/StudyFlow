export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isEmailVerified: boolean;
}
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}
export interface AuthState {
  status: "idle";
  isAuthenticated: boolean;
  error: String | null;
  user: User | null;
  accessToken?: String | null;
  refreshToken?: String | null;
}
