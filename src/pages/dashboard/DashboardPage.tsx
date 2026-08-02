import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { VerifiedUser as VerifiedUserIcon } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/router/routes';
import { UserProfileCard, GroupSummaryCard, ActivityLogCard, SystemStatsCard } from './components';
import { useSystemStats } from '@/hooks/useUserQuery';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: stats, isPending, isFetching, refetch, dataUpdatedAt } = useSystemStats();

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Bảng Điều Khiển Divvy
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Tổng quan nhóm chi tiêu, khoản nợ & nhật ký hoạt động
          </Typography>
        </Box>
        <Chip
          icon={<VerifiedUserIcon />}
          label="Phiên Đăng Nhập Hoạt Động"
          color="success"
          variant="outlined"
          sx={{ fontWeight: 'bold' }}
        />
      </Box>

      {/* User Profile Card */}
      <UserProfileCard
        user={user}
        onGoHome={() => navigate(PATHS.HOME)}
        onLogout={() => {
          logout();
          navigate(PATHS.LOGIN);
        }}
      />

      {/* Divvy Groups & Activity Feed Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
          gap: 3,
        }}
      >
        <GroupSummaryCard />
        <ActivityLogCard />
      </Box>

      {/* Backend Live Stats Feed */}
      <Box>
        <SystemStatsCard
          stats={stats}
          isPending={isPending}
          isFetching={isFetching}
          dataUpdatedAt={dataUpdatedAt}
          onRefetch={refetch}
        />
      </Box>
    </Box>
  );
}
