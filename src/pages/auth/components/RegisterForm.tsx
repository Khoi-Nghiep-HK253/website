import React from 'react';
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
import { useTranslation } from 'react-i18next';
import { Alert } from '@/components';

interface RegisterFormProps {
  username: string;
  setUsername: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  firstname: string;
  setFirstname: (val: string) => void;
  lastname: string;
  setLastname: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  errorMsg: string | null;
  registerError: Error | null;
  isRegistering: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onLoginNowLink: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  firstname,
  setFirstname,
  lastname,
  setLastname,
  phone,
  setPhone,
  errorMsg,
  registerError,
  isRegistering,
  onSubmit,
  onLoginNowLink,
}) => {
  const { t } = useTranslation();

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

      <Box component="form" onSubmit={onSubmit} noValidate>
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
              onClick={onLoginNowLink}
              sx={{ fontWeight: 'bold', p: 0, minWidth: 'auto', textTransform: 'none' }}
            >
              {t('auth.loginNowLink')}
            </Button>
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
