import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupsIcon from '@mui/icons-material/Groups';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import OutboxIcon from '@mui/icons-material/Outbox';
import { useTranslation } from 'react-i18next';

interface AnalyticsKpiCardsProps {
  totalPersonalShare: number;
  totalGroupExpense: number;
  totalOwedToUser: number;
  totalUserOwes: number;
}

export const AnalyticsKpiCards: React.FC<AnalyticsKpiCardsProps> = React.memo(({
  totalPersonalShare,
  totalGroupExpense,
  totalOwedToUser,
  totalUserOwes,
}) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: '0 8px 24px rgba(16,185,129,0.12)',
            borderLeft: 5,
            borderColor: 'primary.main',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {t('dashboard.kpiPersonalShare')}
            </Typography>
            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 36, height: 36 }}>
              <AccountBalanceWalletIcon fontSize="small" />
            </Avatar>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {totalPersonalShare.toLocaleString('vi-VN')} đ
          </Typography>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: '0 8px 24px rgba(99,102,241,0.12)',
            borderLeft: 5,
            borderColor: 'secondary.main',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {t('dashboard.kpiGroupExpense')}
            </Typography>
            <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main', width: 36, height: 36 }}>
              <GroupsIcon fontSize="small" />
            </Avatar>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
            {totalGroupExpense.toLocaleString('vi-VN')} đ
          </Typography>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: '0 8px 24px rgba(245,158,11,0.12)',
            borderLeft: 5,
            borderColor: 'warning.main',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {t('dashboard.kpiOwedToMe')}
            </Typography>
            <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main', width: 36, height: 36 }}>
              <MoveToInboxIcon fontSize="small" />
            </Avatar>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
            {totalOwedToUser.toLocaleString('vi-VN')} đ
          </Typography>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: '0 8px 24px rgba(239,68,68,0.12)',
            borderLeft: 5,
            borderColor: 'error.main',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {t('dashboard.kpiUserOwes')}
            </Typography>
            <Avatar sx={{ bgcolor: 'error.light', color: 'error.main', width: 36, height: 36 }}>
              <OutboxIcon fontSize="small" />
            </Avatar>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'error.main' }}>
            {totalUserOwes.toLocaleString('vi-VN')} đ
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
});

AnalyticsKpiCards.displayName = 'AnalyticsKpiCards';
