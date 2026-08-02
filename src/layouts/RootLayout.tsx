import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import {
  AccountBalanceWallet as WalletIcon,
  Home as HomeIcon,
  HomeOutlined as HomeOutlinedIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  GroupOutlined as GroupOutlinedIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { PATHS } from '@/router/routes';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/theme/ThemeProvider';

interface RootLayoutProps {
  isDarkTheme?: boolean;
  onToggleTheme?: () => void;
}

export const RootLayout: React.FC<RootLayoutProps> = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useAppTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        color: 'text.primary',
        transition: 'background-color 200ms ease, color 200ms ease',
      }}
    >
      {/* Header Bar */}
      <AppBar
        position="sticky"
        color="default"
        elevation={1}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box
              onClick={() => navigate(PATHS.HOME)}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
              }}
            >
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WalletIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" component="span" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  Divvy
                </Typography>
                <Chip
                  label="Sổ quỹ thông minh"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600, display: { xs: 'none', sm: 'inline-flex' } }}
                />
              </Box>
            </Box>

            <Box component="nav" sx={{ display: 'flex', gap: 1, ml: 2 }}>
              <NavLink to={PATHS.HOME} style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <Button
                    startIcon={isActive ? <HomeIcon /> : <HomeOutlinedIcon />}
                    sx={{
                      color: isActive ? 'primary.main' : 'text.secondary',
                      fontWeight: isActive ? 700 : 500,
                      borderBottom: isActive ? 2 : 0,
                      borderColor: 'primary.main',
                      borderRadius: 0,
                    }}
                  >
                    Trang chủ
                  </Button>
                )}
              </NavLink>

              <NavLink to={PATHS.DASHBOARD} style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <Button
                    startIcon={<TrendingUpIcon />}
                    sx={{
                      color: isActive ? 'primary.main' : 'text.secondary',
                      fontWeight: isActive ? 700 : 500,
                      borderBottom: isActive ? 2 : 0,
                      borderColor: 'primary.main',
                      borderRadius: 0,
                    }}
                  >
                    Bảng điều khiển
                  </Button>
                )}
              </NavLink>

              <NavLink to={PATHS.GROUPS} style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <Button
                    startIcon={isActive ? <GroupIcon /> : <GroupOutlinedIcon />}
                    sx={{
                      color: isActive ? 'primary.main' : 'text.secondary',
                      fontWeight: isActive ? 700 : 500,
                      borderBottom: isActive ? 2 : 0,
                      borderColor: 'primary.main',
                      borderRadius: 0,
                    }}
                  >
                    Quản lý nhóm
                  </Button>
                )}
              </NavLink>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              size="small"
              startIcon={isDark ? <LightModeIcon /> : <DarkModeIcon />}
              onClick={toggleTheme}
              color="inherit"
              sx={{ textTransform: 'none' }}
            >
              {isDark ? 'Giao diện Sáng' : 'Giao diện Tối'}
            </Button>

            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                  <PersonIcon color="primary" fontSize="small" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user?.username || user?.email}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={() => {
                    logout();
                    navigate(PATHS.LOGIN);
                  }}
                >
                  Đăng xuất
                </Button>
              </Box>
            ) : (
              <Button
                size="small"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate(PATHS.LOGIN)}
                sx={{ borderRadius: 3, fontWeight: 700 }}
              >
                Đăng nhập / Đăng ký
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content View */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          px: { xs: 2, sm: 4 },
          boxSizing: 'border-box',
        }}
      >
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: { xs: 2, sm: 4 },
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'text.secondary',
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Divvy – Sổ quỹ thông minh cho nhóm
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Quản lý chi tiêu chung minh bạch, tự động chia tiền & cấn trừ công nợ © 2026
        </Typography>
      </Box>
    </Box>
  );
};
