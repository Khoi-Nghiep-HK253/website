import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  authService,
  type UserResponse,
  type LoginPayload,
  type RegisterPayload,
  type ForgotPasswordPayload,
  type ResetPasswordPayload,
  type VerifyTokenResponse,
} from '@/services/authService';

export const AUTH_QUERY_KEYS = {
  session: ['auth', 'session'] as const,
};

/**
 * Hook to manage server-state current user session
 */
export function useCurrentUser() {
  return useQuery<UserResponse | null, Error>({
    queryKey: AUTH_QUERY_KEYS.session,
    queryFn: authService.getCurrentUser,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    retry: false,
  });
}

/**
 * Mutation hook for login API call
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation<UserResponse, Error, LoginPayload>({
    mutationFn: (payload: LoginPayload) => authService.loginApi(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, user);
    },
  });
}

/**
 * Mutation hook for register API call
 */
export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation<UserResponse, Error, RegisterPayload>({
    mutationFn: (payload: RegisterPayload) => authService.registerApi(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, user);
    },
  });
}

/**
 * Mutation hook for forgot password API call
 */
export function useForgotPasswordMutation() {
  return useMutation<string, Error, ForgotPasswordPayload>({
    mutationFn: (payload: ForgotPasswordPayload) => authService.forgotPassword(payload),
  });
}

/**
 * Mutation hook for reset password API call
 */
export function useResetPasswordMutation() {
  return useMutation<string, Error, ResetPasswordPayload>({
    mutationFn: (payload: ResetPasswordPayload) => authService.resetPassword(payload),
  });
}

/**
 * Query hook for verifying password reset token
 */
export function useVerifyResetToken(token: string) {
  return useQuery<VerifyTokenResponse, Error>({
    queryKey: ['auth', 'reset-token', token],
    queryFn: () => authService.verifyResetToken(token),
    enabled: !!token,
    retry: false,
  });
}

/**
 * Mutation hook for logout API call
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: authService.logoutApi,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, null);
      queryClient.invalidateQueries();
    },
  });
}
