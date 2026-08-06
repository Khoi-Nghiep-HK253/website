import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useTranslation } from 'react-i18next';
import type { GroupResponse } from '@/services/groupService';

interface GroupDetailHeaderProps {
  group: GroupResponse;
  isOwner?: boolean;
  onBackToList: () => void;
  onOpenCreateExpense: () => void;
  onOpenAddMember: () => void;
}

export const GroupDetailHeader: React.FC<GroupDetailHeaderProps> = ({
  group,
  isOwner = false,
  onBackToList,
  onOpenCreateExpense,
  onOpenAddMember,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Header Back Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={onBackToList} color="inherit">
          {t('groupDetail.backToList')}
        </Button>
      </Box>

      {/* Group Detail Card */}
      <Card sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, boxShadow: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <GroupIcon sx={{ fontSize: 32 }} />
            </Avatar>

            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                {group.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {group.note || t('groups.noNote')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Quick Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onOpenCreateExpense}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            {t('groupDetail.addExpenseBtn')}
          </Button>

          {isOwner && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={onOpenAddMember}
              sx={{ borderRadius: 3, fontWeight: 700 }}
            >
              {t('groupDetail.inviteMemberBtn')}
            </Button>
          )}
        </Box>
      </Card>
    </>
  );
};
