import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

import type { MembersTabContentProps } from './MembersTabContent.types';
import { getMemberInitial, getMemberDisplayName } from './MembersTabContent.helpers';

export type * from './MembersTabContent.types';

export const MembersTabContent: React.FC<MembersTabContentProps> = ({
  members,
  onOpenAddMemberModal,
  onOpenShareLinkModal,
  onRemoveMember,
  isOwner = false,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ px: 3, pb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 2.5,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          {t('groupDetail.tabMembers')} ({members.length})
        </Typography>
        {isOwner && (
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {onOpenShareLinkModal && (
              <Button
                size="medium"
                variant="outlined"
                startIcon={<QrCode2Icon />}
                onClick={onOpenShareLinkModal}
                sx={{
                  whiteSpace: 'nowrap',
                  px: 2,
                  py: 0.8,
                  borderRadius: 2.5,
                  fontWeight: 700,
                }}
              >
                {t('shareLink.createBtn')}
              </Button>
            )}
            <Button
              size="medium"
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={onOpenAddMemberModal}
              sx={{
                whiteSpace: 'nowrap',
                px: 2.5,
                py: 0.8,
                borderRadius: 2.5,
                fontWeight: 700,
              }}
            >
              {t('groupDetail.inviteMemberBtn')}
            </Button>
          </Box>
        )}
      </Box>

      <List disablePadding>
        {members.map((m, idx) => {
          const displayName = getMemberDisplayName(m);
          const initial = getMemberInitial(m);
          const email = m.user?.email || m.email || '';

          return (
            <React.Fragment key={m.id}>
              {idx > 0 && <Divider component="li" />}
              <ListItem
                sx={{ py: 1.5 }}
                secondaryAction={
                  isOwner && m.role !== 'OWNER' && (
                    <IconButton color="error" onClick={() => onRemoveMember(m.id)}>
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>{initial}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {displayName}
                      </Typography>
                      {m.role === 'OWNER' && (
                        <Chip label="OWNER" size="small" color="primary" sx={{ fontWeight: 'bold' }} />
                      )}
                    </Box>
                  }
                  secondary={email}
                />
              </ListItem>
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

export default MembersTabContent;
