import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import GroupIcon from '@mui/icons-material/Group';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import type { GroupResponse } from '@/services/groupService';

interface MyGroupsTabContentProps {
  groupsList: GroupResponse[];
  onNavigateToGroup: (groupId: number) => void;
}

export const MyGroupsTabContent: React.FC<MyGroupsTabContentProps> = ({
  groupsList,
  onNavigateToGroup,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {t('profile.myGroupsTab')} ({groupsList.length})
      </Typography>

      {groupsList.length === 0 ? (
        <Typography color="text.secondary">{t('groups.emptyGroups')}</Typography>
      ) : (
        <List disablePadding>
          {groupsList.map((g, idx) => (
            <React.Fragment key={g.id}>
              {idx > 0 && <Divider component="li" />}
              <ListItem
                sx={{
                  py: 2,
                  px: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => onNavigateToGroup(g.id)}
                secondaryAction={
                  <Button size="small" variant="outlined" endIcon={<ArrowForwardIcon />}>
                    {t('groups.enterGroup')}
                  </Button>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <GroupIcon color="primary" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {g.name}
                    </Typography>
                  }
                  secondary={`${g.note || t('groups.noNote')} • ${g.categoryName || ''}`}
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};
