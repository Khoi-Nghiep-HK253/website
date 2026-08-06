import { useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInvitationByToken, useAcceptInvitationByTokenMutation } from '@/hooks/query/useInvitationQuery';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import { useAuth } from '@/hooks/common';
import { useToast } from '@/hooks/common/useToast';
import { PATHS } from '@/constants/routes';

export function useAcceptInvitationStore() {
  const { t } = useTranslation();
  useDocumentTitle(t('invitation.acceptTitle'));

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

  const { data: invitation, isLoading, isError, error } = useInvitationByToken(token);
  const acceptMutation = useAcceptInvitationByTokenMutation();

  const handleAccept = useCallback(() => {
    if (!token) return;
    acceptMutation.mutate(token, {
      onSuccess: (res) => {
        showSuccess(t('invitation.acceptSuccess'));
        const groupId = res.invitation?.group?.id || invitation?.group?.id;
        if (groupId) {
          navigate(PATHS.GROUPS.DETAIL(groupId), { replace: true });
        } else {
          navigate(PATHS.GROUPS.LIST, { replace: true });
        }
      },
      onError: (err: Error) => {
        showError(err.message || t('invitation.acceptError'));
      },
    });
  }, [token, acceptMutation, showSuccess, t, invitation?.group?.id, navigate, showError]);

  const handleLoginRedirect = useCallback(() => {
    const returnUrl = encodeURIComponent(`${location.pathname}${location.search}`);
    navigate(`${PATHS.LOGIN}?returnUrl=${returnUrl}`);
  }, [location.pathname, location.search, navigate]);

  const handleBackHome = useCallback(() => {
    navigate(PATHS.HOME);
  }, [navigate]);

  const inviterName = useMemo(() => {
    if (!invitation?.inviter) return 'User';
    const fullname = `${invitation.inviter.firstname || ''} ${invitation.inviter.lastname || ''}`.trim();
    return fullname || invitation.inviter.username;
  }, [invitation?.inviter]);

  return {
    t,
    invitation,
    isLoading,
    isError,
    error,
    isAuthenticated,
    inviterName,
    handleAccept,
    handleLoginRedirect,
    handleBackHome,
    isAcceptPending: acceptMutation.isPending,
  };
}
