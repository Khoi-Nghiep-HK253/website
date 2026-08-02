import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSystemStats, useUpdateUserRole } from '@/hooks/useUserQuery';
import { PATHS } from '@/router/routes';

/**
 * Custom Dashboard Store Hook (Page State & Logic)
 */
export function useDashboardStore() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Queries & Mutations
  const { data: stats, isPending, isFetching, refetch, dataUpdatedAt } = useSystemStats();
  const updateRoleMutation = useUpdateUserRole();
  const [currentRole, setCurrentRole] = useState('Developer');

  const handleRoleChange = (newRole: string) => {
    updateRoleMutation.mutate(newRole, {
      onSuccess: (data) => {
        setCurrentRole(data.role);
      },
    });
  };

  const handleLogout = () => {
    logout();
    navigate(PATHS.LOGIN);
  };

  const handleGoHome = () => {
    navigate(PATHS.HOME);
  };

  return {
    user,
    stats,
    isPending,
    isFetching,
    dataUpdatedAt,
    currentRole,
    isMutatingRole: updateRoleMutation.isPending,
    isMutationSuccess: updateRoleMutation.isSuccess,
    refetchStats: refetch,
    handleRoleChange,
    handleLogout,
    handleGoHome,
  };
}
