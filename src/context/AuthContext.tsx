import React, { createContext, useContext } from 'react';
import { useCurrentUser, useLoginMutation, useRegisterMutation, useLogoutMutation } from '@/hooks/useAuthQuery';
import type { UserResponse, LoginPayload, RegisterPayload } from '@/services/authService';

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user, isPending: isAuthLoading } = useCurrentUser();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  const login = (payload: LoginPayload, onSuccess?: () => void, onError?: (err: Error) => void) => {
    loginMutation.mutate(payload, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
      onError: (err) => {
        if (onError) onError(err);
      },
    });
  };

  const register = (payload: RegisterPayload, onSuccess?: () => void, onError?: (err: Error) => void) => {
    registerMutation.mutate(payload, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
      onError: (err) => {
        if (onError) onError(err);
      },
    });
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated: !!user,
        isAuthLoading,
        login,
        register,
        logout,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
        loginError: loginMutation.error,
        registerError: registerMutation.error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
