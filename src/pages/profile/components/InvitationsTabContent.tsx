import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import GroupIcon from '@mui/icons-material/Group';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MailIcon from '@mui/icons-material/Mail';
import { useTranslation } from 'react-i18next';
import type { InvitationResponse } from '@/services/invitationService';

interface InvitationsTabContentProps {
  invitations: InvitationResponse[];
  isInvitationsPending: boolean;
  invitationFilter: 'PENDING' | 'ACCEPTED' | 'DECLINED' | undefined;
  setInvitationFilter: (val: 'PENDING' | 'ACCEPTED' | 'DECLINED' | undefined) => void;
  onAcceptInvite: (invitationId: number, groupName: string) => void;
  onDeclineInvite: (invitationId: number) => void;
  isAcceptPending: boolean;
  isDeclinePending: boolean;
}

export const InvitationsTabContent: React.FC<InvitationsTabContentProps> = ({
  invitations,
  isInvitationsPending,
  invitationFilter,
  setInvitationFilter,
  onAcceptInvite,
  onDeclineInvite,
  isAcceptPending,
  isDeclinePending,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <MarkEmailUnreadIcon color="primary" />
          {t('profile.invitationsTab')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={t('invitation.pending')}
            color={invitationFilter === 'PENDING' ? 'warning' : 'default'}
            onClick={() => setInvitationFilter('PENDING')}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            label={t('invitation.accepted')}
            color={invitationFilter === 'ACCEPTED' ? 'success' : 'default'}
            onClick={() => setInvitationFilter('ACCEPTED')}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            label={t('invitation.declined')}
            color={invitationFilter === 'DECLINED' ? 'error' : 'default'}
            onClick={() => setInvitationFilter('DECLINED')}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            label={t('common.all')}
            color={invitationFilter === undefined ? 'primary' : 'default'}
            onClick={() => setInvitationFilter(undefined)}
            sx={{ fontWeight: 700 }}
          />
        </Box>
      </Box>

      {isInvitationsPending ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <CircularProgress size={36} />
        </Box>
      ) : invitations.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <MailIcon sx={{ fontSize: 44, opacity: 0.4, mb: 1 }} />
          <Typography variant="body1" color="text.secondary">
            {t('invitation.noInvitations')}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {invitations.map((inv) => (
            <Grid size={{ xs: 12, md: 6 }} key={inv.id}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  borderLeft: 4,
                  borderColor:
                    inv.status === 'ACCEPTED'
                      ? 'success.main'
                      : inv.status === 'DECLINED'
                      ? 'error.main'
                      : 'warning.main',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
                      <GroupIcon fontSize="small" color="primary" />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {inv.group?.name || 'Group'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('invitation.inviterName')}: {inv.inviter?.username || 'Admin'}
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={t(`invitation.${inv.status.toLowerCase()}`)}
                    size="small"
                    color={
                      inv.status === 'ACCEPTED'
                        ? 'success'
                        : inv.status === 'DECLINED'
                        ? 'error'
                        : 'warning'
                    }
                    sx={{ fontWeight: 700 }}
                  />
                </Box>

                {inv.message && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', bgcolor: 'action.hover', p: 1.2, borderRadius: 2 }}>
                    "{inv.message}"
                  </Typography>
                )}

                <Divider />

                {inv.status === 'PENDING' ? (
                  <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => onDeclineInvite(inv.id)}
                      disabled={isDeclinePending}
                    >
                      {t('invitation.declineBtn')}
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => onAcceptInvite(inv.id, inv.group?.name || t('invitation.groupName'))}
                      disabled={isAcceptPending}
                    >
                      {t('invitation.acceptBtn')}
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right' }}>
                    {inv.createdAt || ''}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
