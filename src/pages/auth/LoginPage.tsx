import React, { useState, useMemo, useCallback } from 'react';
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
import { useAuth } from '@/hooks/common';
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

  const from = useMemo(() => {
    return (location.state as { from?: { pathname: string } })?.from?.pathname || PATHS.GROUPS.LIST;
  }, [location.state]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
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
    },
    [usernameOrEmail, password, login, showSuccess, t, navigate, from, showError]
  );

  const handleGoToGroups = useCallback(() => {
    navigate(PATHS.GROUPS.LIST);
  }, [navigate]);

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
          onClick={handleGoToGroups}
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
          <Alert intent="error" title={t('auth.errorAlertTitle')}>
            {errorMsg || loginError?.message || t('auth.loginFailed')}
          </Alert>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="usernameOrEmail"
          label={t('auth.usernameOrEmailLabel')}
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
          label={t('auth.passwordLabel')}
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

        <Box sx={{ textAling: 'center', mt: 1 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {t('auth.noAccountPrompt')}{' '}
            <Button
              color="primary"
              onClick={() => navigate(PATHS.AUTH.REGISTER)}
              sx={{ fontWeight: 'bold', p: 0, minWidth: 'auto', textTransform: 'none' }}
            >
              {t('auth.registerNowLink')}
            </Button>
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
