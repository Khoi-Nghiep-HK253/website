import React, { useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import EmailIcon from '@mui/icons-material/Email';

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
import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { CustomTabPanel } from '@/components';
import { PATHS } from '@/constants/routes';
import {
  PersonalInfoTabContent,
  MyGroupsTabContent,
  InvitationsTabContent,
} from './components';

export default function ProfilePage() {
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

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* ── HEADER USER PROFILE CARD ─────────────────────────────────────── */}
      <Card
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 4,
          boxShadow: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: 3,
          background: 'linear-gradient(135deg, rgba(79,70,229,0.05) 0%, rgba(99,102,241,0.12) 100%)',
        }}
      >
        <Avatar
          sx={{
            width: { xs: 72, md: 88 },
            height: { xs: 72, md: 88 },
            bgcolor: 'primary.main',
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 'bold',
            boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
          }}
        >
          {userInitial}
        </Avatar>

        <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
              {displayName}
            </Typography>
            {user?.role && (
              <Chip
                label={user.role}
                color="primary"
                size="small"
                sx={{ fontWeight: 700, borderRadius: 2 }}
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <EmailIcon fontSize="small" /> {user?.email}
          </Typography>

          {user?.username && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Username: <strong>@{user.username}</strong>
            </Typography>
          )}
        </Box>
      </Card>

      {/* ── TABS NAVIGATION ─────────────────────────────────────────────── */}
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            color="primary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab icon={<PersonIcon />} label={t('profile.tabPersonalInfo')} iconPosition="start" />
            <Tab icon={<GroupIcon />} label={`${t('profile.tabMyGroups')} (${groupsList.length})`} iconPosition="start" />
            <Tab icon={<MarkEmailUnreadIcon />} label={`${t('profile.tabInvitations')} (${invitations.length})`} iconPosition="start" />
          </Tabs>
        </Box>

        {/* TAB 1: THÔNG TIN CÁ NHÂN & ĐỔI MẬT KHẨU */}
        <CustomTabPanel value={activeTab} index={0}>
          <PersonalInfoTabContent
            user={user}
            firstname={firstname}
            setFirstname={setFirstname}
            lastname={lastname}
            setLastname={setLastname}
            phone={phone}
            setPhone={setPhone}
            onUpdateProfile={handleUpdateProfile}
            isUpdatingProfile={updateProfileMutation.isPending}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            onChangePassword={handleChangePassword}
            isChangingPassword={changePasswordMutation.isPending}
          />
        </CustomTabPanel>

        {/* TAB 2: DANH SÁCH NHÓM CỦA TÔI */}
        <CustomTabPanel value={activeTab} index={1}>
          <MyGroupsTabContent groupsList={groupsList} onNavigateToGroup={handleNavigateToGroup} />
        </CustomTabPanel>

        {/* TAB 3: DANH SÁCH LỜI MỜI THAM GIA NHÓM */}
        <CustomTabPanel value={activeTab} index={2}>
          <InvitationsTabContent
            invitations={invitations}
            isInvitationsPending={isInvitationsPending}
            invitationFilter={invitationFilter}
            setInvitationFilter={setInvitationFilter}
            onAcceptInvite={handleAcceptInvite}
            onDeclineInvite={handleDeclineInvite}
            isAcceptPending={acceptInvitationMutation.isPending}
            isDeclinePending={declineInvitationMutation.isPending}
          />
        </CustomTabPanel>
      </Paper>
    </Container>
  );
}
