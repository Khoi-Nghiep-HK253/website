import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LoginIcon from '@mui/icons-material/Login';
import { useTranslation } from 'react-i18next';
import type { InvitationResponse } from '@/services/invitationService';

interface InvitationDetailCardProps {
  invitation: InvitationResponse;
  inviterName: string;
  isAuthenticated: boolean;
  isAcceptPending: boolean;
  onAccept: () => void;
  onLoginRedirect: () => void;
}

export const InvitationDetailCard: React.FC<InvitationDetailCardProps> = ({
  invitation,
  inviterName,
  isAuthenticated,
  isAcceptPending,
  onAccept,
  onLoginRedirect,
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 2,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f8fafc'),
          borderColor: 'divider',
          textAlign: 'left',
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ mb: 1.5, alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: '#3b82f6', width: 40, height: 40 }}>
            <GroupIcon />
          </Avatar>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }} color="text.primary">
              {invitation.group?.name || t('common.user')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('invitation.invitedBy')}: <strong>{inviterName}</strong>
            </Typography>
          </Box>
        </Stack>

        {invitation.message && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              "{invitation.message}"
            </Typography>
          </>
        )}

        <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`${t('invitation.statusLabel')}: ${t(`invitation.${invitation.status.toLowerCase()}`, { defaultValue: invitation.status })}`}
            color={invitation.status === 'PENDING' ? 'warning' : 'default'}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </Paper>

      {/* If not logged in, prompt user to log in first */}
      {!isAuthenticated ? (
        <Box>
          <Alert severity="info" sx={{ mb: 2, textAlign: 'left', borderRadius: 2 }}>
            {t('invitation.loginPromptInfo')}
          </Alert>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            startIcon={<LoginIcon />}
            onClick={onLoginRedirect}
            sx={{ py: 1.3, borderRadius: 2.5, fontWeight: 700 }}
          >
            {t('invitation.loginToAcceptBtn')}
          </Button>
        </Box>
      ) : (
        /* Logged in: Accept button */
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={isAcceptPending || invitation.status !== 'PENDING'}
          startIcon={
            isAcceptPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <CheckCircleIcon />
            )
          }
          onClick={onAccept}
          sx={{ py: 1.3, borderRadius: 2.5, fontWeight: 700 }}
        >
          {isAcceptPending
            ? t('invitation.acceptingBtn')
            : invitation.status === 'PENDING'
            ? t('invitation.acceptSubmitBtn')
            : `${t('invitation.statusLabel')}: ${invitation.status}`}
        </Button>
      )}
    </Box>
  );
};
