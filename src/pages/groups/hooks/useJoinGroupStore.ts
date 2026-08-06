import { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/common';
import {
  useGroupPreview,
  useJoinGroupViaLinkMutation,
} from '@/hooks/query/useGroupShareLinkQuery';
import { useToast } from '@/hooks/common/useToast';
import { PATHS } from '@/router/routes';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';

export function useJoinGroupStore() {
  const { t } = useTranslation();
  const { inviteCode = '' } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

  const { data: preview, isPending: loading } = useGroupPreview(inviteCode);
  const joinGroupMutation = useJoinGroupViaLinkMutation();

  useDocumentTitle(preview?.groupName ? `Tham gia ${preview.groupName}` : 'Divvy – Join Group');

  const handleJoinGroup = useCallback(() => {
    if (!isAuthenticated) {
      navigate(`${PATHS.LOGIN}?returnUrl=${encodeURIComponent(PATHS.INVITATION.JOIN(inviteCode))}`);
      return;
    }

    joinGroupMutation.mutate(inviteCode, {
      onSuccess: (res) => {
        showSuccess(t('joinGroup.joinSuccess'));
        navigate(PATHS.GROUPS.DETAIL(res.groupId));
      },
      onError: (err) => {
        showError(err.message || 'Failed to join group');
      },
    });
  }, [isAuthenticated, inviteCode, joinGroupMutation, navigate, showError, showSuccess, t]);

  const handleBackToHome = useCallback(() => {
    navigate(PATHS.HOME);
  }, [navigate]);

  return {
    t,
    preview,
    loading,
    isAuthenticated,
    handleJoinGroup,
    handleBackToHome,
    isJoinPending: joinGroupMutation.isPending,
  };
}
