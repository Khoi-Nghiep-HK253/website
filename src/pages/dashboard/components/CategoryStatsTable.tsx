import React, { useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CategoryIcon from '@mui/icons-material/Category';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HotelIcon from '@mui/icons-material/Hotel';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TableChartIcon from '@mui/icons-material/TableChart';
import { useTranslation } from 'react-i18next';
import { DataTable, type DataTableColumn } from '@/components/DataTable';
import type { CategoryExpenseStatResponse } from '@/services/analyticsService';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#14b8a6'];

interface CategoryStatsTableProps {
  categoryStats: CategoryExpenseStatResponse[];
}

export const CategoryStatsTable: React.FC<CategoryStatsTableProps> = React.memo(({ categoryStats }) => {
  const { t } = useTranslation();

  const getCategoryIcon = useCallback((iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'food':
      case 'eating':
        return <RestaurantIcon color="primary" fontSize="small" />;
      case 'transport':
      case 'travel':
        return <DirectionsCarIcon color="secondary" fontSize="small" />;
      case 'hotel':
      case 'housing':
        return <HotelIcon color="warning" fontSize="small" />;
      case 'entertainment':
        return <SportsEsportsIcon color="info" fontSize="small" />;
      case 'shopping':
        return <ShoppingBagIcon color="error" fontSize="small" />;
      default:
        return <CategoryIcon color="action" fontSize="small" />;
    }
  }, []);

  const columns: DataTableColumn<CategoryExpenseStatResponse>[] = useMemo(
    () => [
      {
        id: 'categoryName',
        headerName: t('dashboard.categoryCol'),
        field: 'categoryName',
        sortable: true,
        renderCell: (row) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getCategoryIcon(row.categoryIcon)}
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {row.categoryName}
            </Typography>
          </Box>
        ),
      },
      {
        id: 'expenseCount',
        headerName: t('dashboard.countCol'),
        field: 'expenseCount',
        align: 'center',
        sortable: true,
      },
      {
        id: 'totalAmount',
        headerName: t('dashboard.amountCol'),
        field: 'totalAmount',
        align: 'right',
        sortable: true,
        renderCell: (row) => (
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {row.totalAmount.toLocaleString('vi-VN')} đ
          </Typography>
        ),
      },
      {
        id: 'percentage',
        headerName: t('dashboard.pctCol'),
        field: 'percentage',
        align: 'right',
        sortable: true,
        renderCell: (row, idx) => (
          <Chip
            label={`${row.percentage.toFixed(1)}%`}
            size="small"
            sx={{
              bgcolor: COLORS[idx % COLORS.length],
              color: '#fff',
              fontWeight: 'bold',
            }}
          />
        ),
      },
    ],
    [getCategoryIcon, t]
  );

  return (
    <DataTable
      columns={columns}
      data={categoryStats || []}
      getRowId={(row) => row.categoryId}
      title={t('dashboard.categoryTableTitle')}
      headerIcon={<TableChartIcon color="primary" />}
      searchable
      searchPlaceholder={t('dashboard.categoryCol')}
      pagination={false}
      emptyMessage={t('dashboard.noData')}
    />
  );
});

CategoryStatsTable.displayName = 'CategoryStatsTable';
