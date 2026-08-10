import React from 'react';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import type { GroupResponse } from '@/services/groupService';

interface DashboardFilterToolbarProps {
  selectedGroupId: number | '';
  onSelectGroup: (groupId: number | '') => void;
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  groupsList: GroupResponse[];
}

export const DashboardFilterToolbar: React.FC<DashboardFilterToolbarProps> = React.memo(({
  selectedGroupId,
  onSelectGroup,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  groupsList,
}) => {
  const { t } = useTranslation();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        mb: 4,
        borderRadius: 3,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        bgcolor: 'background.paper',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel>{t('dashboard.filterScopeAll')}</InputLabel>
        <Select
          value={selectedGroupId}
          label={t('dashboard.filterScopeAll')}
          onChange={(e) => onSelectGroup(e.target.value as number | '')}
        >
          <MenuItem value="">
            <em>{t('dashboard.filterScopeAll')}</em>
          </MenuItem>
          {groupsList.map((g) => (
            <MenuItem key={g.id} value={g.id}>
              {g.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label={t('dashboard.startDateLabel')}
        type="datetime-local"
        size="small"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 230 }}
      />

      <TextField
        label={t('dashboard.endDateLabel')}
        type="datetime-local"
        size="small"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 230 }}
      />
    </Paper>
  );
});

DashboardFilterToolbar.displayName = 'DashboardFilterToolbar';
