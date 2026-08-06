import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import WorkIcon from '@mui/icons-material/Work';
import { useTranslation } from 'react-i18next';
import type { UserResponse } from '@/services/authService';

interface HomeHeroBannerProps {
  isAuthenticated: boolean;
  user: UserResponse | null;
  onNavigateGroups: () => void;
  onNavigateRegister: () => void;
}

export const HomeHeroBanner: React.FC<HomeHeroBannerProps> = ({
  isAuthenticated,
  user,
  onNavigateGroups,
  onNavigateRegister,
}) => {
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        p: { xs: 3, md: 6 },
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
      <Chip
        icon={<StarIcon sx={{ color: '#f59e0b !important' }} />}
        label={t('home.badge')}
        color="primary"
        variant="outlined"
        sx={{ mb: 2, fontWeight: 700, px: 1, py: 0.5 }}
      />

      <Typography variant="h2" component="h1" color="primary.main" sx={{ fontSize: { xs: '2rem', md: '3.25rem' }, mb: 2, fontWeight: 800 }}>
        {t('home.heroTitle')}
      </Typography>

      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ maxWidth: 800, mx: 'auto', mb: 4, fontWeight: 400, lineHeight: 1.6 }}
      >
        {t('home.heroSub')}
      </Typography>

      {isAuthenticated && (
        <Box sx={{ mb: 3 }}>
          <Chip
            icon={<CheckCircleIcon color="success" />}
            label={t('home.welcomeUser', { username: user?.username || user?.email })}
            color="success"
            variant="outlined"
            sx={{ fontWeight: 'bold', fontSize: '0.95rem', py: 2, px: 1 }}
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          size="large"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={onNavigateGroups}
          sx={{ px: 4, py: 1.5, borderRadius: 3, fontSize: '1.05rem', fontWeight: 700 }}
        >
          {isAuthenticated ? t('home.enterGroups') : t('home.exploreGroups')}
        </Button>

        {!isAuthenticated && (
          <Button
            variant="outlined"
            size="large"
            color="primary"
            onClick={onNavigateRegister}
            sx={{ px: 4, py: 1.5, borderRadius: 3, fontSize: '1.05rem', fontWeight: 700 }}
          >
            {t('home.registerFree')}
          </Button>
        )}
      </Box>

      {/* Feature Highlights Tags */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
          gap: 2,
          mt: 4,
          pt: 3,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <FlightTakeoffIcon color="primary" />
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {t('home.tagTravel')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <HomeWorkIcon color="primary" />
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {t('home.tagHome')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <SportsSoccerIcon color="primary" />
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {t('home.tagSports')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <WorkIcon color="primary" />
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {t('home.tagWork')}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
