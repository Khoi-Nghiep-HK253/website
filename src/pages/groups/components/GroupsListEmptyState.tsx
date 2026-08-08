import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { useTranslation } from 'react-i18next';

interface GroupsListEmptyStateProps {
  isFiltered: boolean;
  onClearFilters: () => void;
  onCreateGroup: () => void;
}

export const GroupsListEmptyState: React.FC<GroupsListEmptyStateProps> = ({
  isFiltered,
  onClearFilters,
  onCreateGroup,
}) => {
  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: 4,
        bgcolor: 'action.hover',
        border: '2px dashed',
        borderColor: 'divider',
      }}
    >
      <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.light', mx: 'auto', mb: 2 }}>
        <GroupAddIcon sx={{ fontSize: 36, color: 'primary.main' }} />
      </Avatar>

      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
        {isFiltered
          ? t('groups.noGroupFound') || 'Không tìm thấy nhóm phù hợp'
          : t('groups.emptyTitle')}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {isFiltered
          ? t('groups.tryAnotherSearch') || 'Thử thay đổi từ khóa hoặc bộ lọc danh mục / người tạo'
          : t('groups.emptySub')}
      </Typography>

      {isFiltered ? (
        <Button
          variant="outlined"
          color="primary"
          onClick={onClearFilters}
          startIcon={<FilterAltOffIcon />}
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          {t('groups.clearFilters')}
        </Button>
      ) : (
        <Button
          variant="contained"
          startIcon={<GroupAddIcon />}
          onClick={onCreateGroup}
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          {t('groups.createBtn') || t('groups.createGroup')}
        </Button>
      )}
    </Paper>
  );
};
