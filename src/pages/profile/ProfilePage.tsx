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

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useUpdateProfileMutation, useChangePasswordMutation } from '@/hooks/useUserQuery';
import { useMyGroups } from '@/hooks/useGroupQuery';
import {
  useMyInvitations,
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
} from '@/hooks/useInvitationQuery';
import { useNavigate } from 'react-router-dom';

import { CustomTabPanel } from '@/components';
import {
  PersonalInfoTabContent,
  MyGroupsTabContent,
  InvitationsTabContent,
} from './components';

export default function ProfilePage() {
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
          showSuccess('Cập nhật thông tin cá nhân thành công!');
        },
        onError: (err) => {
          showError(`Cập nhật thất bại: ${err.message || 'Vui lòng kiểm tra lại'}`);
        },
      }
    );
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    if (!currentPassword) {
      showError('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showError('Xác nhận mật khẩu mới không khớp.');
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
          showSuccess('Đổi mật khẩu thành công! Vui lòng dùng mật khẩu mới từ lần đăng nhập sau.');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
        onError: (err) => {
          showError(`Đổi mật khẩu thất bại: ${err.message || 'Mật khẩu hiện tại không đúng'}`);
        },
      }
    );
  };

  const handleAcceptInvite = (invitationId: number, groupName: string) => {
    acceptInvitationMutation.mutate(invitationId, {
      onSuccess: () => {
        showSuccess(`Đã tham gia nhóm "${groupName}" thành công!`);
      },
      onError: (err) => {
        showError(`Không thể tham gia nhóm: ${err.message || 'Lời mời không hợp lệ'}`);
      },
    });
  };

  const handleDeclineInvite = (invitationId: number) => {
    declineInvitationMutation.mutate(invitationId, {
      onSuccess: () => {
        showSuccess('Đã từ chối lời mời vào nhóm.');
      },
      onError: (err) => {
        showError(`Không thể từ chối lời mời: ${err.message}`);
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
    return user?.username || 'Thành viên Divvy';
  };

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* ── HEADER USER PROFILE CARD ─────────────────────────────────────── */}
      <Card
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 5,
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
              : 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: '2.2rem',
              fontWeight: 'bold',
              boxShadow: 3,
            }}
          >
            {getUserInitial()}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {getDisplayName()}
              </Typography>
              <Chip
                label={user?.role || 'MEMBER'}
                color="primary"
                size="small"
                sx={{ fontWeight: 700, borderRadius: 2 }}
              />
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon fontSize="small" color="action" /> {user?.email}
              {user?.username && ` • @${user.username}`}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Paper variant="outlined" sx={{ p: 1.5, px: 2.5, borderRadius: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
                {groupsList.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Nhóm tham gia
              </Typography>
            </Paper>
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
            <Tab icon={<PersonIcon />} label="Thông Tin Cá Nhân & Bảo Mật" iconPosition="start" />
            <Tab icon={<GroupIcon />} label="Nhóm Của Tôi" iconPosition="start" />
            <Tab icon={<MarkEmailUnreadIcon />} label="Lời Mời Vào Nhóm" iconPosition="start" />
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
