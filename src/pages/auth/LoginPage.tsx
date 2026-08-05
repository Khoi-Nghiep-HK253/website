import React, { useState } from 'react';
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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/common/useAuth';
import { useToast } from '@/hooks/common/useToast';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import { PATHS } from '@/router/routes';
import { Alert } from '@/components';

export default function LoginPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('nav.login'));
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { login, isAuthenticated, isLoggingIn, loginError } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || PATHS.GROUPS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!usernameOrEmail.trim()) {
      setErrorMsg(t('auth.valUsernameOrEmailRequired'));
      return;
    }
    if (!password) {
      setErrorMsg(t('auth.valPasswordRequired'));
      return;
    }

    login(
      { usernameOrEmail, password },
      () => {
        showSuccess(t('auth.loginSuccess'));
        navigate(from, { replace: true });
      },
      (err) => {
        const msg = err.message || t('auth.loginFailed');
        setErrorMsg(msg);
        showError(msg);
      }
    );
  };

  if (isAuthenticated) {
    return (
      <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 4, textAlign: 'center', borderRadius: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {t('auth.alreadyLoggedIn')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ my: 2 }}>
          {t('auth.goToGroupsMsg')}
        </Typography>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate(PATHS.GROUPS)}
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          {t('auth.goToGroupsBtn')}
        </Button>
      </Card>
    );
  }

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
          <Alert intent="error">{errorMsg || loginError?.message}</Alert>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          id="username-or-email-input"
          label={t('auth.usernameOrEmail')}
          type="text"
          variant="outlined"
          fullWidth
          required
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          placeholder={t('auth.usernameOrEmailPlaceholder')}
          disabled={isLoggingIn}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          id="password-input"
          label={t('auth.password')}
          type="password"
          variant="outlined"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.passwordPlaceholder')}
          disabled={isLoggingIn}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon color="primary" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={isLoggingIn ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
          disabled={isLoggingIn}
          sx={{ mt: 1, borderRadius: 3, fontWeight: 700 }}
        >
          {isLoggingIn ? t('auth.loggingIn') : t('auth.loginBtn')}
        </Button>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center', fontSize: '0.875rem', color: 'text.secondary' }}>
        {t('auth.noAccount')}{' '}
        <Typography
          component="span"
          variant="body2"
          color="primary"
          sx={{ fontWeight: 'bold', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          onClick={() => navigate(PATHS.REGISTER)}
        >
          {t('auth.registerBtn')}
        </Typography>
      </Box>
    </Card>
  );
}
