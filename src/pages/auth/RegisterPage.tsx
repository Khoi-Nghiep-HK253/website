import React, { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
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
        navigate(PATHS.GROUPS, { replace: true });
      },
      (err) => {
        setErrorMsg(err.message || t('auth.regFailed'));
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
          <Alert intent="error">{errorMsg || registerError?.message}</Alert>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          id="username-input"
          label={t('auth.username')}
          type="text"
          variant="outlined"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t('auth.usernamePlaceholder')}
          disabled={isRegistering}
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
          id="register-email-input"
          label={t('auth.email')}
          type="email"
          variant="outlined"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.emailPlaceholder')}
          disabled={isRegistering}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <MailIcon color="primary" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            id="firstname-input"
            label={t('auth.firstname')}
            type="text"
            variant="outlined"
            fullWidth
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="..."
            disabled={isRegistering}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="primary" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            id="lastname-input"
            label={t('auth.lastname')}
            type="text"
            variant="outlined"
            fullWidth
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="..."
            disabled={isRegistering}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="primary" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <TextField
          id="phone-input"
          label={t('auth.phone')}
          type="tel"
          variant="outlined"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0912345678"
          disabled={isRegistering}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="primary" />
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
          placeholder={t('auth.passwordMinPlaceholder')}
          disabled={isRegistering}
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

        <TextField
          id="confirm-password-input"
          label={t('auth.confirmPassword')}
          type="password"
          variant="outlined"
          fullWidth
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t('auth.confirmPasswordPlaceholder')}
          disabled={isRegistering}
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
          endIcon={isRegistering ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
          disabled={isRegistering}
          sx={{ mt: 1, borderRadius: 3, fontWeight: 700 }}
        >
          {isRegistering ? t('auth.registering') : t('auth.registerBtn')}
        </Button>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center', fontSize: '0.875rem', color: 'text.secondary' }}>
        {t('auth.hasAccount')}{' '}
        <Typography
          component="span"
          variant="body2"
          color="primary"
          sx={{ fontWeight: 'bold', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          onClick={() => navigate(PATHS.LOGIN)}
        >
          {t('auth.loginBtn')}
        </Typography>
      </Box>
    </Card>
  );
}
