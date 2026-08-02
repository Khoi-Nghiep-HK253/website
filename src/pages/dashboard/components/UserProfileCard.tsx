import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import {
  Person as PersonIcon,
  Mail as MailIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import type { UserResponse } from '@/services/authService';

interface UserProfileCardProps {
  user: UserResponse | null;
  onGoHome: () => void;
  onLogout: () => void;
}

export function UserProfileCard({ user, onGoHome, onLogout }: UserProfileCardProps) {
  const fullName = [user?.firstname, user?.lastname].filter(Boolean).join(' ');

  return (
    <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Thông tin tài khoản (Backend Session):
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon color="primary" />
          <Typography variant="body1">
            <strong>Username:</strong> {user?.username} {fullName && `(${fullName})`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MailIcon color="primary" />
          <Typography variant="body1">
            <strong>Email:</strong> {user?.email}
          </Typography>
        </Box>
        {user?.phone && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon color="primary" />
            <Typography variant="body1">
              <strong>Số điện thoại:</strong> {user.phone}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BadgeIcon color="primary" />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1">
              <strong>Vai trò hệ thống:</strong>
            </Typography>
            <Chip label={user?.role || 'USER'} color="primary" size="small" />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
        <Button variant="outlined" startIcon={<HomeIcon />} onClick={onGoHome}>
          Về Trang chủ
        </Button>
        <Button
          variant="text"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
        >
          Đăng xuất
        </Button>
      </Box>
    </Card>
  );
}
