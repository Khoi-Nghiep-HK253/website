import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import {
  Group as GroupIcon,
  PersonAdd as PersonAddIcon,
  ReceiptLong as ReceiptLongIcon,
  AccountBalance as AccountBalanceIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export const HomeFeaturesGrid: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Chip label={t('home.archBadge')} color="primary" size="small" sx={{ mb: 1, fontWeight: 700 }} />
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
          {t('home.archTitle')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {t('home.archSub')}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 3,
        }}
      >
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
          <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', mb: 2 }}>
            <GroupIcon />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('home.feature1Title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('home.feature1Desc')}
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
          <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText', mb: 2 }}>
            <PersonAddIcon />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('home.feature2Title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('home.feature2Desc')}
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
          <Avatar sx={{ bgcolor: 'info.light', color: 'info.contrastText', mb: 2 }}>
            <ReceiptLongIcon />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('home.feature3Title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('home.feature3Desc')}
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
          <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.contrastText', mb: 2 }}>
            <AccountBalanceIcon />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('home.feature4Title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('home.feature4Desc')}
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
          <Avatar sx={{ bgcolor: 'success.light', color: 'success.contrastText', mb: 2 }}>
            <CheckCircleIcon />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('home.feature5Title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('home.feature5Desc')}
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
          <Avatar sx={{ bgcolor: 'error.light', color: 'error.contrastText', mb: 2 }}>
            <HistoryIcon />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('home.feature6Title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('home.feature6Desc')}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};
