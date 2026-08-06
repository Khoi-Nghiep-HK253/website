import React, { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/common/useAuth';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import { PATHS } from '@/router/routes';
import { Alert } from '@/components';

export default function RegisterPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('nav.register'));
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, isAuthenticated, isRegistering, registerError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg(null);

      if (!username.trim()) {
        setErrorMsg(t('auth.valUsernameRequired'));
        return;
      }

      if (!email.trim()) {
        setErrorMsg(t('auth.valEmailRequired'));
        return;
      }

      if (!password) {
        setErrorMsg(t('auth.valPasswordRequired'));
        return;
      }

      if (password.length < 6) {
        setErrorMsg(t('auth.valPasswordMinLength'));
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg(t('auth.valPasswordMismatch'));
        return;
      }

      register(
        {
          username,
          email,
          password,
          firstname: firstname.trim() || undefined,
          lastname: lastname.trim() || undefined,
          phone: phone.trim() || undefined,
        },
        () => {
          navigate(PATHS.GROUPS.LIST, { replace: true });
        },
        (err) => {
          setErrorMsg(err.message || t('auth.regFailed'));
        }
      );
    },
    [username, email, password, confirmPassword, firstname, lastname, phone, register, navigate, t]
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
    <Card sx={{ maxWidth: 480, mx: 'auto', mt: 4, p: 4, boxShadow: 6, borderRadius: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', color: '#fff' }}>
          <PersonAddIcon sx={{ fontSize: 32 }} />
        </Avatar>
      </Box>

      <Typography variant="h5" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        {t('auth.registerTitle')}
      </Typography>
      <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
        {t('auth.registerSub')}
      </Typography>

      {(errorMsg || registerError) && (
        <Box sx={{ mb: 2 }}>
          <Alert intent="error" title={t('auth.regErrorAlertTitle')}>
            {errorMsg || registerError?.message || t('auth.regFailed')}
          </Alert>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="dense"
          required
          fullWidth
          id="username"
          label={t('auth.usernameLabel')}
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isRegistering}
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
          margin="dense"
          required
          fullWidth
          id="email"
          label={t('auth.emailLabel')}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isRegistering}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <MailIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
          <TextField
            margin="dense"
            fullWidth
            id="lastname"
            label={t('auth.lastnameLabel')}
            name="lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            disabled={isRegistering}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            margin="dense"
            fullWidth
            id="firstname"
            label={t('auth.firstnameLabel')}
            name="firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            disabled={isRegistering}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <TextField
          margin="dense"
          fullWidth
          id="phone"
          label={t('auth.phoneLabel')}
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isRegistering}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          margin="dense"
          required
          fullWidth
          name="password"
          label={t('auth.passwordLabel')}
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isRegistering}
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

        <TextField
          margin="dense"
          required
          fullWidth
          name="confirmPassword"
          label={t('auth.confirmPasswordLabel')}
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isRegistering}
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
          disabled={isRegistering}
          sx={{ mt: 3, mb: 2, py: 1.2, borderRadius: 3, fontWeight: 700 }}
        >
          {isRegistering ? <CircularProgress size={24} color="inherit" /> : t('auth.regSubmit')}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t('auth.alreadyHaveAccountPrompt')}{' '}
            <Button
              color="primary"
              onClick={() => navigate(PATHS.AUTH.LOGIN)}
              sx={{ fontWeight: 'bold', p: 0, minWidth: 'auto', textTransform: 'none' }}
            >
              {t('auth.loginNowLink')}
            </Button>
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
