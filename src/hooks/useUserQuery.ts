import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  userService,
  type SystemStats,
  type UserRoleData,
  type UpdateUserPayload,
  type ChangePasswordPayload,
} from '@/services/userService';
import type { UserResponse } from '@/services/authService';
import { AUTH_QUERY_KEYS } from './useAuthQuery';

export const USER_QUERY_KEYS = {
  systemStats: ['systemStats'] as const,
  allUsers: ['users', 'list'] as const,
  userDetail: (id: number) => ['users', 'detail', id] as const,
};

/**
 * Custom hook to fetch system stats
 */
export function useSystemStats() {
  return useQuery<SystemStats, Error>({
    queryKey: USER_QUERY_KEYS.systemStats,
    queryFn: userService.fetchSystemStats,
    staleTime: 1000 * 30,
  });
}

/**
 * Custom hook to update user role demo
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation<UserRoleData, Error, string>({
    mutationFn: (newRole: string) => userService.updateUserRole(newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.systemStats });
    },
  });
}

/**
 * Custom hook to fetch all users list
 */
export function useAllUsers() {
  return useQuery<UserResponse[], Error>({
    queryKey: USER_QUERY_KEYS.allUsers,
    queryFn: userService.getAllUsers,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Custom hook to fetch specific user by ID
 */
export function useUserById(id: number) {
  return useQuery<UserResponse, Error>({
    queryKey: USER_QUERY_KEYS.userDetail(id),
    queryFn: () => userService.getUserById(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

/**
 * Custom hook to update user profile information
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation<UserResponse, Error, { id: number; payload: UpdateUserPayload }>({
    mutationFn: ({ id, payload }) => userService.updateProfile(id, payload),
    onSuccess: (updatedUser, { id }) => {
      queryClient.setQueryData(USER_QUERY_KEYS.userDetail(id), updatedUser);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.allUsers });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.session });
    },
  });
}

/**
 * Custom hook to change user password
 */
export function useChangePasswordMutation() {
  return useMutation<string, Error, { id: number; payload: ChangePasswordPayload }>({
    mutationFn: ({ id, payload }) => userService.changePassword(id, payload),
  });
}
