import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PATHS } from '@/router/routes';

export const AuthLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(PATHS.HOME)}
          color="inherit"
        >
          Quay về Trang chủ
        </Button>
      </Box>

      <Box
        sx={{
          width: '100%',
          maxWidth: '440px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
