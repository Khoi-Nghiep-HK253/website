import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/common';
import { useToast } from '@/hooks/common/useToast';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import { useUpdateProfileMutation, useChangePasswordMutation } from '@/hooks/query/useUserQuery';
import { useMyGroups } from '@/hooks/query/useGroupQuery';
import {
  useMyInvitations,
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
} from '@/hooks/query/useInvitationQuery';
import { PATHS } from '@/constants/routes';

export function useProfileStore() {
  const { t } = useTranslation();
  useDocumentTitle(t('profile.title'));
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState(0);

  // Form states for profile update
  const [firstname, setFirstname] = useState(user?.firstname || '');
  const [lastname, setLastname] = useState(user?.lastname || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Form states for change password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Invitation filter state
  const [invitationFilter, setInvitationFilter] = useState<'PENDING' | 'ACCEPTED' | 'DECLINED' | undefined>('PENDING');

  // Mutations & Queries
  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const { data: myGroupsData } = useMyGroups();
  const { data: invitations = [], isPending: isInvitationsPending } = useMyInvitations(invitationFilter);
  const acceptInvitationMutation = useAcceptInvitationMutation();
  const declineInvitationMutation = useDeclineInvitationMutation();

  const groupsList = useMemo(() => myGroupsData?.content || [], [myGroupsData]);

  const handleUpdateProfile = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!user?.id) return;

      updateProfileMutation.mutate(
        {
          id: user.id,
          payload: {
            firstname: firstname.trim() || undefined,
            lastname: lastname.trim() || undefined,
            phone: phone.trim() || undefined,
          },
        },
        {
          onSuccess: () => {
            showSuccess(t('profile.profileUpdateSuccess'));
          },
          onError: (err) => {
            showError(`${t('profile.profileUpdateFailed')}: ${err.message || 'Error'}`);
          },
        }
      );
    },
    [user, updateProfileMutation, firstname, lastname, phone, showSuccess, t, showError]
  );

  const handleChangePassword = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!user?.id) return;

      if (!currentPassword) {
        showError(t('profile.valCurrentPasswordReq'));
        return;
      }
      if (!newPassword || newPassword.length < 6) {
        showError(t('profile.valNewPasswordMin'));
        return;
      }
      if (newPassword !== confirmPassword) {
        showError(t('profile.valConfirmMismatch'));
        return;
      }

      changePasswordMutation.mutate(
        {
          id: user.id,
          payload: {
            currentPassword,
            newPassword,
          },
        },
        {
          onSuccess: () => {
            showSuccess(t('profile.changePasswordSuccess'));
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          },
          onError: (err) => {
            showError(`${t('profile.changePasswordFailed')}: ${err.message}`);
          },
        }
      );
    },
    [user, currentPassword, newPassword, confirmPassword, changePasswordMutation, showSuccess, t, showError]
  );

  const handleAcceptInvite = useCallback(
    (invitationId: number, groupName: string) => {
      acceptInvitationMutation.mutate(invitationId, {
        onSuccess: () => {
          showSuccess(`${t('profile.acceptInviteSuccess')} ("${groupName}")`);
        },
        onError: (err) => {
          showError(`Error: ${err.message}`);
        },
      });
    },
    [acceptInvitationMutation, showSuccess, t, showError]
  );

  const handleDeclineInvite = useCallback(
    (invitationId: number) => {
      declineInvitationMutation.mutate(invitationId, {
        onSuccess: () => {
          showSuccess(t('profile.declineInviteSuccess'));
        },
        onError: (err) => {
          showError(`Error: ${err.message}`);
        },
      });
    },
    [declineInvitationMutation, showSuccess, t, showError]
  );

  const handleNavigateToGroup = useCallback(
    (groupId: number) => {
      if (groupId > 0) {
        navigate(PATHS.GROUPS.DETAIL(groupId));
      } else {
        navigate(PATHS.GROUPS.LIST);
      }
    },
    [navigate]
  );

  const userInitial = useMemo(() => {
    if (user?.username) return user.username.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  }, [user]);

  const displayName = useMemo(() => {
    if (firstname || lastname) {
      return `${lastname} ${firstname}`.trim();
    }
    return user?.username || 'Member';
  }, [firstname, lastname, user]);

  return {
    t,
    user,
    activeTab,
    setActiveTab,
    firstname,
    setFirstname,
    lastname,
    setLastname,
    phone,
    setPhone,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    invitationFilter,
    setInvitationFilter,
    groupsList,
    invitations,
    isInvitationsPending,
    userInitial,
    displayName,
    handleUpdateProfile,
    handleChangePassword,
    handleAcceptInvite,
    handleDeclineInvite,
    handleNavigateToGroup,
    isProfilePending: updateProfileMutation.isPending,
    isPasswordPending: changePasswordMutation.isPending,
    isAcceptPending: acceptInvitationMutation.isPending,
    isDeclinePending: declineInvitationMutation.isPending,
  };
}
