import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaymentsIcon from '@mui/icons-material/Payments';
import { useTranslation } from 'react-i18next';
import type { SettlementSummaryResponse } from '@/services/settlementService';
import type { DebtUserInfo } from '@/services/debtService';
import { useAuth } from '@/hooks/common/useAuth';
import { MediaGalleryContainer, MediaUploaderContainer } from '@/containers';

interface SettlementsTabContentProps {
  settlements: SettlementSummaryResponse[];
}

const getUserDisplayName = (u?: DebtUserInfo, fallbackId?: number, fallbackName?: string): string => {
  if (u?.username) return u.username;
  if (u?.fullname) return u.fullname;
  if (fallbackName) return fallbackName;
  if (fallbackId) return `User #${fallbackId}`;
  return 'Member';
};

export const SettlementsTabContent: React.FC<SettlementsTabContentProps> = ({ settlements }) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <Box sx={{ px: 3, pb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        {t('groupDetail.tabSettlements')} ({settlements.length})
      </Typography>

      {settlements.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
          <PaymentsIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
          <Typography variant="body1">{t('groups.noSettlements')}</Typography>
        </Box>
      ) : (
        <List disablePadding>
          {settlements.map((st, idx) => {
            const fromName = getUserDisplayName(st.fromUser, st.fromUserId, st.fromUsername);
            const toName = getUserDisplayName(st.toUser, st.toUserId, st.toUsername);

            const payerId = st.fromUserId || st.fromUser?.id;
            const payerUsername = st.fromUsername || st.fromUser?.username;
            const isPayer = Boolean(
              user &&
              ((payerId && payerId === user.id) ||
                (payerUsername && payerUsername === user.username))
            );

            return (
              <React.Fragment key={st.id}>
                {idx > 0 && <Divider component="li" />}
                <ListItem sx={{ py: 1.8, flexDirection: 'column', alignItems: 'stretch' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <CheckCircleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {fromName} ➔ {toName}
                        </Typography>
                      }
                      secondary={`${st.method || 'CASH'} • ${st.note || ''}`}
                    />
                    <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                      +{(st.amount || 0).toLocaleString()} {st.currencyCode || 'VND'}
                    </Typography>
                  </Box>

                  {/* Settlement proof attachments */}
                  <Box sx={{ mt: 1.5, pl: 7 }}>
                    <MediaGalleryContainer
                      entityType="SETTLEMENT"
                      entityId={st.id}
                      currentUsername={user?.username}
                      allowDelete={isPayer}
                    />
                    {isPayer && (
                      <Box sx={{ mt: 1 }}>
                        <MediaUploaderContainer
                          entityType="SETTLEMENT"
                          entityId={st.id}
                          label={t('media.uploadProof')}
                        />
                      </Box>
                    )}
                  </Box>
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Box>
  );
};
