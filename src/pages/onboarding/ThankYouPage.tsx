import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';

import { PATHS } from '@/constants/routes';

export default function ThankYouPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigate = useCallback(
    (path: string) => () => {
      navigate(path);
    },
    [navigate]
  );

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Card
        sx={{
          p: { xs: 4, md: 6 },
          textAlign: 'center',
          borderRadius: 5,
          boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25)',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)'
              : 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
          border: '1px solid',
          borderColor: 'primary.light',
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 3,
            bgcolor: 'success.light',
            color: 'success.main',
            boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)',
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 50 }} />
        </Avatar>

        <Typography variant="h3" component="h1" color="primary.main" sx={{ fontWeight: 800, mb: 2 }}>
          {t('thankYou.title')}
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 650, mx: 'auto', mb: 4, fontWeight: 400, lineHeight: 1.6 }}
        >
          {t('thankYou.sub')}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            startIcon={<GroupAddIcon />}
            onClick={handleNavigate(PATHS.GROUPS.LIST)}
            sx={{ px: 4, py: 1.5, borderRadius: 3, fontSize: '1.05rem', fontWeight: 700 }}
          >
            {t('thankYou.btnCreateGroup')}
          </Button>

          <Button
            variant="outlined"
            size="large"
            color="primary"
            startIcon={<DashboardIcon />}
            onClick={handleNavigate(PATHS.DASHBOARD)}
            sx={{ px: 3, py: 1.5, borderRadius: 3, fontSize: '1.05rem', fontWeight: 700 }}
          >
            {t('thankYou.btnDashboard')}
          </Button>

          <Button
            variant="text"
            size="large"
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={handleNavigate(PATHS.HOME)}
            sx={{ px: 3, py: 1.5, borderRadius: 3, fontSize: '1.05rem', fontWeight: 600 }}
          >
            {t('thankYou.btnHome')}
          </Button>
        </Box>
      </Card>
    </Container>
  );
}
