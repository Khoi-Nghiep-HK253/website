import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { useTranslation } from 'react-i18next';

interface HomeCtaBannerProps {
  onNavigateGroups: () => void;
}

export const HomeCtaBanner: React.FC<HomeCtaBannerProps> = ({ onNavigateGroups }) => {
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        p: { xs: 4, md: 6 },
        textAlign: 'center',
        borderRadius: 4,
        bgcolor: 'primary.main',
        color: '#fff',
        boxShadow: 8,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
        {t('home.ctaTitle')}
      </Typography>
      <Typography variant="subtitle1" sx={{ opacity: 0.9, maxWidth: 650, mx: 'auto', mb: 3 }}>
        {t('home.ctaSub')}
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={onNavigateGroups}
        sx={{
          bgcolor: '#ffffff',
          color: 'primary.main',
          fontWeight: 800,
          px: 4,
          py: 1.5,
          borderRadius: 3,
          '&:hover': { bgcolor: '#f0fdf4' },
        }}
      >
        {t('home.ctaBtn')}
      </Button>
    </Card>
  );
};
