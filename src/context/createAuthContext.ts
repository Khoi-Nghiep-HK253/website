import { createContext } from 'react';
import type { UserResponse, LoginPayload, RegisterPayload } from '@/services/authService';

export interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (payload: LoginPayload, onSuccess?: () => void, onError?: (err: Error) => void) => void;
  register: (payload: RegisterPayload, onSuccess?: () => void, onError?: (err: Error) => void) => void;
  logout: () => void;
  isLoggingIn: boolean;
  isRegistering: boolean;
  loginError: Error | null;
  registerError: Error | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
