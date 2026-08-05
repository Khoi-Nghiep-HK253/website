import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import WorkIcon from '@mui/icons-material/Work';
import CategoryIcon from '@mui/icons-material/Category';
import { useTranslation } from 'react-i18next';
import type { GroupResponse } from '@/services/groupService';

interface GroupCardItemProps {
  group: GroupResponse;
  onNavigateDetail: (groupId: number) => void;
}

export const GroupCardItem: React.FC<GroupCardItemProps> = ({ group, onNavigateDetail }) => {
  const { t } = useTranslation();
  const categoryName = group.category?.name || group.categoryName;

  const getCategoryIcon = (name?: string) => {
    if (!name) return <CategoryIcon />;
    if (name.includes('Trọ') || name.includes('Sinh hoạt')) return <HomeWorkIcon />;
    if (name.includes('Thể thao') || name.includes('Bóng')) return <SportsSoccerIcon />;
    if (name.includes('Làm việc') || name.includes('Dự án')) return <WorkIcon />;
    return <FlightTakeoffIcon />;
  };

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
            {getCategoryIcon(categoryName || group.name)}
          </Avatar>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {group.name}
        </Typography>

        {categoryName && (
          <Chip label={categoryName} size="small" color="secondary" sx={{ mb: 1, fontSize: '0.75rem' }} />
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
          {group.note || t('groups.noNote')}
        </Typography>
      </Box>

      <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            {t('groups.createdBy')}: {group.createdBy?.username || '—'}
          </Typography>
        </Box>
        <Button
          size="small"
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => onNavigateDetail(group.id)}
          sx={{ borderRadius: 2 }}
        >
          {t('groups.enterGroup')}
        </Button>
      </Box>
    </Card>
  );
};
