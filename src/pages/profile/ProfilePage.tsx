import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';

import { CustomTabPanel } from '@/components';
import { useProfileStore } from './hooks/useProfileStore';
import {
  ProfileHeaderCard,
  PersonalInfoTabContent,
  MyGroupsTabContent,
  InvitationsTabContent,
} from './components';

export default function ProfilePage() {
  const {
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
    isProfilePending,
    isPasswordPending,
    isAcceptPending,
    isDeclinePending,
  } = useProfileStore();

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Header User Profile Card */}
      <ProfileHeaderCard user={user} userInitial={userInitial} displayName={displayName} />

      {/* Tabs Navigation */}
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            color="primary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
              },
            }}
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
            isUpdatingProfile={isProfilePending}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            onChangePassword={handleChangePassword}
            isChangingPassword={isPasswordPending}
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
            isAcceptPending={isAcceptPending}
            isDeclinePending={isDeclinePending}
          />
        </CustomTabPanel>
      </Paper>
    </Container>
  );
}
