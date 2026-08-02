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
import { useAuth } from '@/context/AuthContext';
import { PATHS } from '@/router/routes';
import { Alert } from '@/components';

export default function RegisterPage() {
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
      setErrorMsg('Vui lòng nhập Tên tài khoản (username).');
      return;
    }

    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ Email.');
      return;
    }

    if (!password) {
      setErrorMsg('Vui lòng nhập Mật khẩu.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
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
        setErrorMsg(err.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    );
  };

  if (isAuthenticated) {
    return (
      <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 4, textAlign: 'center', borderRadius: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Bạn đã đăng nhập Divvy!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ my: 2 }}>
          Tài khoản hiện tại của bạn đã sẵn sàng sử dụng trên hệ thống.
        </Typography>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate(PATHS.GROUPS)}
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          Đi tới Danh sách Nhóm
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
        Đăng Ký Tài Khoản Divvy
      </Typography>
      <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
        Tạo tài khoản mới để trải nghiệm Sổ quỹ thông minh cho nhóm
      </Typography>

      {(errorMsg || registerError) && (
        <Box sx={{ mb: 2 }}>
          <Alert intent="error">{errorMsg || registerError?.message}</Alert>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          id="username-input"
          label="Tên đăng nhập (Username)"
          type="text"
          variant="outlined"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập username của bạn..."
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
          label="Địa chỉ Email"
          type="email"
          variant="outlined"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nhap-email@domain.com"
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
            label="Họ (Firstname)"
            type="text"
            variant="outlined"
            fullWidth
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="Họ..."
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
            label="Tên (Lastname)"
            type="text"
            variant="outlined"
            fullWidth
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Tên..."
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
          label="Số điện thoại"
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
          label="Mật khẩu"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)..."
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
          label="Xác nhận mật khẩu"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Nhập lại mật khẩu..."
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
          {isRegistering ? 'Đang tạo tài khoản...' : 'Tạo tài khoản ngay'}
        </Button>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center', fontSize: '0.875rem', color: 'text.secondary' }}>
        Đã có tài khoản Divvy?{' '}
        <Typography
          component="span"
          variant="body2"
          color="primary"
          sx={{ fontWeight: 'bold', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          onClick={() => navigate(PATHS.LOGIN)}
        >
          Đăng nhập ngay
        </Typography>
      </Box>
    </Card>
  );
}
