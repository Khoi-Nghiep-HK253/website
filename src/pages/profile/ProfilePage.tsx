import React, { useState } from 'react';
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

import { useAuth } from '@/hooks/common/useAuth';
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

  const groupsList = myGroupsData?.content || [];

  const handleUpdateProfile = (e: React.FormEvent) => {
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
  };

  const handleChangePassword = (e: React.FormEvent) => {
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
  };

  const handleAcceptInvite = (invitationId: number, groupName: string) => {
    acceptInvitationMutation.mutate(invitationId, {
      onSuccess: () => {
        showSuccess(`${t('profile.acceptInviteSuccess')} ("${groupName}")`);
      },
      onError: (err) => {
        showError(`Error: ${err.message}`);
      },
    });
  };

  const handleDeclineInvite = (invitationId: number) => {
    declineInvitationMutation.mutate(invitationId, {
      onSuccess: () => {
        showSuccess(t('profile.declineInviteSuccess'));
      },
      onError: (err) => {
        showError(`Error: ${err.message}`);
      },
    });
  };

  const handleNavigateToGroup = (groupId: number) => {
    if (groupId > 0) {
      navigate(`/groups/${groupId}`);
    } else {
      navigate('/groups');
    }
  };

  const getUserInitial = (): string => {
    if (user?.username) return user.username.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const getDisplayName = (): string => {
    if (firstname || lastname) {
      return `${lastname} ${firstname}`.trim();
    }
    return user?.username || 'Member';
  };

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* ── HEADER USER PROFILE CARD ─────────────────────────────────────── */}
      <Card
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 5,
          boxShadow: '0 8px 24px -8px rgba(16, 185, 129, 0.15)',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(16, 185, 129, 0.08)'
              : 'rgba(16, 185, 129, 0.06)',
          border: 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 2.5 }, justifyContent: 'space-between', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
          {/* Left: Avatar */}
          <Avatar
            sx={{
              width: 70,
              height: 70,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px -4px rgba(16, 185, 129, 0.3)',
              flexShrink: 0,
            }}
          >
            {getUserInitial()}
          </Avatar>

          {/* Center: User Info */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.75 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {getDisplayName()}
              </Typography>
              <Chip
                label={user?.role || 'MEMBER'}
                color="primary"
                size="small"
                sx={{ fontWeight: 700, borderRadius: 1.5, height: 24, fontSize: '0.75rem' }}
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <span>{user?.email}</span>
              {user?.username && <span>• @{user.username}</span>}
            </Typography>
          </Box>

          {/* Right: Stats */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, minWidth: 'fit-content', flexShrink: 0 }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 800, lineHeight: 1 }}>
              {groupsList.length}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
              {t('profile.joinedGroupsCount')}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* ── MAIN PROFILE NAVIGATION TABS ─────────────────────────────────── */}
      <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            color="primary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab icon={<PersonIcon />} label={t('profile.personalInfoTab')} iconPosition="start" />
            <Tab icon={<GroupIcon />} label={t('profile.myGroupsTab')} iconPosition="start" />
            <Tab icon={<MarkEmailUnreadIcon />} label={t('profile.invitationsTab')} iconPosition="start" />
          </Tabs>
        </Box>

        {/* TAB 0: THÔNG TIN CÁ NHÂN & BẢO MẬT */}
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

        {/* TAB 1: NHÓM CỦA TÔI */}
        <CustomTabPanel value={activeTab} index={1}>
          <MyGroupsTabContent
            groupsList={groupsList}
            onNavigateToGroup={handleNavigateToGroup}
          />
        </CustomTabPanel>

        {/* TAB 2: LỜI MỜI VÀO NHÓM */}
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
