import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

import {
  AccountBalanceWallet as WalletIcon,
  Home as HomeIcon,
  HomeOutlined as HomeOutlinedIcon,
  Group as GroupIcon,
  GroupOutlined as GroupOutlinedIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  ArrowForward as ArrowForwardIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import { useTranslation } from 'react-i18next';
import { PATHS } from '@/router/routes';
import { useAuth } from '@/hooks/common';
import { useAppTheme } from '@/theme/ThemeProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface RootLayoutProps {
  isDarkTheme?: boolean;
  onToggleTheme?: () => void;
}

export const RootLayout: React.FC<RootLayoutProps> = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useAppTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';
  const userDisplayName = user?.username || user?.email || t('common.user');

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
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1.5, sm: 3, md: 4 } }}>
          {/* Logo & Desktop Nav Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
            <Box
              onClick={() => navigate(PATHS.HOME)}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
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
                <WalletIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Box>
              <Typography variant="h6" component="span" sx={{ fontWeight: 800, color: 'primary.main', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                {t('common.appName')}
              </Typography>
            </Box>

            {/* Desktop Navigation Links */}
            <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 2 }}>
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
                      whitespace: 'nowrap',
                    }}
                  >
                    {t('nav.home')}
                  </Button>
                )}
              </NavLink>

              <NavLink to={PATHS.GROUPS.LIST} style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <Button
                    startIcon={isActive ? <GroupIcon /> : <GroupOutlinedIcon />}
                    sx={{
                      color: isActive ? 'primary.main' : 'text.secondary',
                      fontWeight: isActive ? 700 : 500,
                      borderBottom: isActive ? 2 : 0,
                      borderColor: 'primary.main',
                      borderRadius: 0,
                      whitespace: 'nowrap',
                    }}
                  >
                    {t('nav.groups')}
                  </Button>
                )}
              </NavLink>
            </Box>
          </Box>

          {/* Desktop & Mobile Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Toggle Button (Desktop & Tablet) */}
            <Tooltip title={isDark ? t('common.themeLight') : t('common.themeDark')}>
              <IconButton onClick={toggleTheme} color="inherit" size="small">
                {isDark ? <LightModeIcon color="warning" /> : <DarkModeIcon color="primary" />}
              </IconButton>
            </Tooltip>

            {isAuthenticated ? (
              <>
                {/* Desktop User Pill */}
                <Box
                  onClick={() => navigate(PATHS.PROFILE)}
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 0.8,
                    borderRadius: 3,
                    bgcolor: 'action.hover',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    '&:hover': {
                      bgcolor: 'action.selected',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <PersonIcon color="primary" fontSize="small" />
                  <Typography variant="body2" sx={{ fontWeight: 600, maxWidth: 120 }} noWrap>
                    {userDisplayName}
                  </Typography>
                </Box>

                {/* Mobile Profile Icon */}
                <Tooltip title={t('nav.profile')}>
                  <IconButton
                    onClick={() => navigate(PATHS.PROFILE)}
                    size="small"
                    sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                  >
                    <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', fontSize: '0.85rem', fontWeight: 700 }}>
                      {userInitial}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                {/* Desktop Logout Button */}
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={() => {
                    logout();
                    navigate(PATHS.LOGIN);
                  }}
                  sx={{ display: { xs: 'none', md: 'inline-flex' }, whitespace: 'nowrap' }}
                >
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <Button
                size="small"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate(PATHS.LOGIN)}
                sx={{ borderRadius: 3, fontWeight: 700, px: { xs: 1.5, sm: 2 } }}
              >
                {t('nav.login')}
              </Button>
            )}

            {/* Mobile Hamburger Menu Icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' }, ml: 0.5 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        slotProps={{
          paper: {
            sx: { width: 280, bgcolor: 'background.paper' },
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                p: 0.6,
                borderRadius: 1.5,
                bgcolor: 'primary.main',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <WalletIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
              {t('common.appName')}
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {isAuthenticated && (
          <Box
            onClick={() => {
              navigate(PATHS.PROFILE);
              setMobileOpen(false);
            }}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              bgcolor: 'action.hover',
              cursor: 'pointer',
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>
              {userInitial}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                {userDisplayName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                {user?.email || t('nav.viewProfile')}
              </Typography>
            </Box>
          </Box>
        )}

        <Divider />

        <List sx={{ pt: 1 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(PATHS.HOME);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>
                <HomeIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={t('nav.home')}
                slotProps={{ primary: { sx: { fontWeight: 600 } } }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(PATHS.GROUPS.LIST);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>
                <GroupIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={t('nav.groups')}
                slotProps={{ primary: { sx: { fontWeight: 600 } } }}
              />
            </ListItemButton>
          </ListItem>

          {isAuthenticated && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(PATHS.PROFILE);
                  setMobileOpen(false);
                }}
              >
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={t('nav.profileAndInvitations')}
                  slotProps={{ primary: { sx: { fontWeight: 600 } } }}
                />
              </ListItemButton>
            </ListItem>
          )}

          <ListItem disablePadding>
            <ListItemButton onClick={toggleTheme}>
              <ListItemIcon>
                {isDark ? <LightModeIcon color="warning" /> : <DarkModeIcon color="primary" />}
              </ListItemIcon>
              <ListItemText
                primary={isDark ? t('common.themeLight') : t('common.themeDark')}
                slotProps={{ primary: { sx: { fontWeight: 600 } } }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        {isAuthenticated && (
          <Box sx={{ p: 2, mt: 'auto' }}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={() => {
                logout();
                navigate(PATHS.LOGIN);
                setMobileOpen(false);
              }}
            >
              {t('nav.logout')}
            </Button>
          </Box>
        )}
      </Drawer>

      {/* Main Content View */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: { xs: 2.5, sm: 4 },
          px: { xs: 1.5, sm: 3, md: 4 },
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
            {t('common.appName')} – {t('common.appTagline')}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {t('common.footerTagline')}
        </Typography>
      </Box>
    </Box>
  );
};
