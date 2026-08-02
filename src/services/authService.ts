import { axiosClient, type ApiResponse } from '@/services/api/axiosClient';
import { STORAGE_KEYS } from '@/constants';

export interface UserResponse {
  id: number;
  username: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: UserResponse;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyTokenResponse {
  maskedEmail: string;
  expiresAt: string;
}

export const authService = {
  /**
   * Fetch current authenticated user session from backend /api/auth/me
   */
  async getCurrentUser(): Promise<UserResponse | null> {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      return null;
    }

    try {
      const response = await axiosClient.get<unknown, ApiResponse<UserResponse>>('/auth/me');
      if (response && response.data) {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(response.data));
        return response.data;
      }
      return null;
    } catch (error) {
      console.warn('Failed to fetch authenticated user session:', error);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      return null;
    }
  },

  /**
   * Login user via API mutation POST /api/auth/login
   */
  async loginApi(payload: LoginPayload): Promise<UserResponse> {
    const response = await axiosClient.post<unknown, ApiResponse<AuthResponse>>('/auth/login', payload);
    if (response && response.data) {
      const { accessToken, user } = response.data;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      return user;
    }
    throw new Error(response.message || 'Login failed. Please check your credentials.');
  },

  /**
   * Register new user via API mutation POST /api/auth/register
   */
  async registerApi(payload: RegisterPayload): Promise<UserResponse> {
    const response = await axiosClient.post<unknown, ApiResponse<AuthResponse>>('/auth/register', payload);
    if (response && response.data) {
      const { accessToken, user } = response.data;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      return user;
    }
    throw new Error(response.message || 'Registration failed. Please check your input.');
  },

  /**
   * Request password reset email POST /api/auth/forgot-password
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<string> {
    const response = await axiosClient.post<unknown, ApiResponse<void>>('/auth/forgot-password', payload);
    return response.message || 'Reset link sent successfully';
  },

  /**
   * Verify password reset token GET /api/auth/reset-password/verify?token=...
   */
  async verifyResetToken(token: string): Promise<VerifyTokenResponse> {
    const response = await axiosClient.get<unknown, ApiResponse<VerifyTokenResponse>>(
      `/auth/reset-password/verify?token=${encodeURIComponent(token)}`
    );
    return response.data;
  },

  /**
   * Reset password POST /api/auth/reset-password
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<string> {
    const response = await axiosClient.post<unknown, ApiResponse<void>>('/auth/reset-password', payload);
    return response.message || 'Password has been reset successfully.';
  },

  /**
   * Logout user and clear local session storage
   */
  async logoutApi(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  },
};
