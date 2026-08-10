import React, { useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useTranslation } from 'react-i18next';

import { useAnalyticsSummary } from '@/hooks/query/useAnalyticsQuery';
import { useMyGroups } from '@/hooks/query/useGroupQuery';
import type { GroupResponse } from '@/services/groupService';

import {
  DashboardFilterToolbar,
  AnalyticsKpiCards,
  CategoryPieChart,
  SpendingTrendChart,
  CategoryStatsTable,
  TopExpensesList,
} from './components';

const formatDateTimeLocal = (date: Date) => {
  const pad = (n: number) => (n < 10 ? `0${n}` : n);
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();

  const [selectedGroupId, setSelectedGroupId] = useState<number | ''>('');
  
  const [startDate, setStartDate] = useState<string>(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    return formatDateTimeLocal(startOfMonth);
  });

  const [endDate, setEndDate] = useState<string>(() => {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    return formatDateTimeLocal(endOfDay);
  });

  const handleSelectGroup = useCallback((groupId: number | '') => {
    setSelectedGroupId(groupId);
  }, []);

  const handleStartDateChange = useCallback((val: string) => {
    setStartDate(val);
  }, []);

  const handleEndDateChange = useCallback((val: string) => {
    setEndDate(val);
  }, []);

  // Query groups for filter dropdown
  const { data: groupsData } = useMyGroups(0, 100);
  const groupsList: GroupResponse[] = useMemo(() => groupsData?.content || [], [groupsData]);

  // Query analytics summary
  const analyticsParams = useMemo(
    () => ({
      groupId: selectedGroupId !== '' ? selectedGroupId : undefined,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    }),
    [selectedGroupId, startDate, endDate]
  );

  const { data: analyticsData, isLoading } = useAnalyticsSummary(analyticsParams);

  const categoryStats = useMemo(() => analyticsData?.categoryStats || [], [analyticsData]);
  const timeTrendStats = useMemo(() => analyticsData?.timeTrendStats || [], [analyticsData]);
  const topExpenses = useMemo(() => analyticsData?.topExpenses || [], [analyticsData]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 52, height: 52, boxShadow: '0 8px 16px rgba(16,185,129,0.3)' }}>
          <DashboardIcon sx={{ fontSize: 32 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {t('dashboard.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('dashboard.subtitle')}
          </Typography>
        </Box>
      </Box>

      {/* Filter Toolbar */}
      <DashboardFilterToolbar
        selectedGroupId={selectedGroupId}
        onSelectGroup={handleSelectGroup}
        startDate={startDate}
        onStartDateChange={handleStartDateChange}
        endDate={endDate}
        onEndDateChange={handleEndDateChange}
        groupsList={groupsList}
      />

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={48} color="primary" />
        </Box>
      ) : (
        <>
          {/* KPI Stat Cards Grid */}
          <AnalyticsKpiCards
            totalPersonalShare={analyticsData?.totalPersonalShare || 0}
            totalGroupExpense={analyticsData?.totalGroupExpense || 0}
            totalOwedToUser={analyticsData?.totalOwedToUser || 0}
            totalUserOwes={analyticsData?.totalUserOwes || 0}
          />

          {/* Charts Row */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <CategoryPieChart categoryStats={categoryStats} />
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <SpendingTrendChart timeTrendStats={timeTrendStats} />
            </Grid>
          </Grid>

          {/* Tables Row: Category Table & Top Expenses */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <CategoryStatsTable categoryStats={categoryStats} />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <TopExpensesList topExpenses={topExpenses} />
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};
