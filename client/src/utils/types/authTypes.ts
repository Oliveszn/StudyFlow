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
  user: User;
}
export interface AuthState {
  status: "idle";
  isAuthenticated: false;
  error: null;
  user: null;
}
