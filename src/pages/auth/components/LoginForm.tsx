import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PersonIcon from '@mui/icons-material/Person';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useTranslation } from 'react-i18next';
import { Alert } from '@/components';

interface LoginFormProps {
  usernameOrEmail: string;
  setUsernameOrEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  errorMsg: string | null;
  loginError: Error | null;
  isLoggingIn: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onRegisterNowLink: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  usernameOrEmail,
  setUsernameOrEmail,
  password,
  setPassword,
  errorMsg,
  loginError,
  isLoggingIn,
  onSubmit,
  onRegisterNowLink,
}) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ maxWidth: 420, mx: 'auto', mt: 4, p: 4, boxShadow: 6, borderRadius: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', color: '#fff' }}>
          <AccountBalanceWalletIcon sx={{ fontSize: 32 }} />
        </Avatar>
      </Box>

      <Typography variant="h5" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        {t('auth.loginTitle')}
      </Typography>
      <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
        {t('auth.loginSub')}
      </Typography>

      {(errorMsg || loginError) && (
        <Box sx={{ mb: 2 }}>
          <Alert intent="error" title={t('auth.errorAlertTitle')}>
            {errorMsg || loginError?.message || t('auth.loginFailed')}
          </Alert>
        </Box>
      )}

      <Box component="form" onSubmit={onSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="usernameOrEmail"
          label={t('auth.usernameOrEmail')}
          name="usernameOrEmail"
          autoComplete="username"
          autoFocus
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          disabled={isLoggingIn}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label={t('auth.password')}
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoggingIn}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoggingIn}
          sx={{ mt: 3, mb: 2, py: 1.2, borderRadius: 3, fontWeight: 700 }}
        >
          {isLoggingIn ? <CircularProgress size={24} color="inherit" /> : t('auth.loginSubmit')}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {t('auth.noAccountPrompt')}{' '}
            <Button
              color="primary"
              onClick={onRegisterNowLink}
              sx={{ fontWeight: 'bold', p: 0, minWidth: 'auto', textTransform: 'none' }}
            >
              {t('auth.registerNowLink')}
            </Button>
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
