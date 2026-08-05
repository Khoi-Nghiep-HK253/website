import React from 'react';
import { useCurrentUser, useLoginMutation, useRegisterMutation, useLogoutMutation } from '@/hooks/query/useAuthQuery';
import { AuthContext, type AuthContextType } from './createAuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user, isPending: isAuthLoading } = useCurrentUser();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  const login = (payload: Parameters<AuthContextType['login']>[0], onSuccess?: () => void, onError?: (err: Error) => void) => {
    loginMutation.mutate(payload, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
      onError: (err) => {
        if (onError) onError(err);
      },
    });
  };

  const register = (payload: Parameters<AuthContextType['register']>[0], onSuccess?: () => void, onError?: (err: Error) => void) => {
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

export type { AuthContextType };
