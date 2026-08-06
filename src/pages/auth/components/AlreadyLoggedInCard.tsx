import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';

interface AlreadyLoggedInCardProps {
  onGoToGroups: () => void;
}

export const AlreadyLoggedInCard: React.FC<AlreadyLoggedInCardProps> = ({ onGoToGroups }) => {
  const { t } = useTranslation();

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
        onClick={onGoToGroups}
        sx={{ borderRadius: 3, fontWeight: 700 }}
      >
        {t('auth.goToGroupsBtn')}
      </Button>
    </Card>
  );
};
