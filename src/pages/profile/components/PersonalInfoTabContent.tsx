import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { useTranslation } from 'react-i18next';

import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import SaveIcon from '@mui/icons-material/Save';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import type { UserResponse } from '@/services/authService';

interface PersonalInfoTabContentProps {
  user: UserResponse | null;
  firstname: string;
  setFirstname: (val: string) => void;
  lastname: string;
  setLastname: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  onUpdateProfile: (e: React.FormEvent) => void;
  isUpdatingProfile: boolean;
  currentPassword: string;
  setCurrentPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  onChangePassword: (e: React.FormEvent) => void;
  isChangingPassword: boolean;
}

export const PersonalInfoTabContent: React.FC<PersonalInfoTabContentProps> = ({
  user,
  firstname,
  setFirstname,
  lastname,
  setLastname,
  phone,
  setPhone,
  onUpdateProfile,
  isUpdatingProfile,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onChangePassword,
  isChangingPassword,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Grid container spacing={3}>
        {/* Left Form: Edit Profile Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon color="primary" />
              {t('profile.updateProfileTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('profile.updateProfileSub')}
            </Typography>

            <Box component="form" onSubmit={onUpdateProfile} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label={t('auth.username')}
                value={user?.username || ''}
                disabled
                size="small"
                fullWidth
                helperText={t('profile.usernameHelper')}
              />

              <TextField
                label={t('auth.email')}
                value={user?.email || ''}
                disabled
                size="small"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label={t('auth.lastname')}
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="..."
                />
                <TextField
                  label={t('auth.firstname')}
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="..."
                />
              </Box>

              <TextField
                label={t('auth.phone')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                size="small"
                fullWidth
                placeholder="0912345678"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={isUpdatingProfile ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={isUpdatingProfile}
                sx={{ mt: 1, borderRadius: 2.5, fontWeight: 700 }}
              >
                {t('profile.saveProfileBtn')}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Form: Change Password */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <VpnKeyIcon color="secondary" />
              {t('profile.changePasswordTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('profile.changePasswordSub')}
            </Typography>

            <Box component="form" onSubmit={onChangePassword} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label={t('profile.currentPassword')}
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                size="small"
                fullWidth
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label={t('profile.newPassword')}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                size="small"
                fullWidth
                required
                placeholder={t('profile.newPasswordPlaceholder')}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label={t('profile.confirmNewPassword')}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                size="small"
                fullWidth
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                startIcon={isChangingPassword ? <CircularProgress size={20} color="inherit" /> : <VpnKeyIcon />}
                disabled={isChangingPassword}
                sx={{ mt: 1, borderRadius: 2.5, fontWeight: 700 }}
              >
                {t('profile.changePasswordBtn')}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
