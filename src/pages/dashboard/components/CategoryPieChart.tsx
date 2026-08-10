import React from 'react';
import CategoryIcon from '@mui/icons-material/Category';
import { useTranslation } from 'react-i18next';
import { AgDonutChart } from '@/components/AgChart';
import type { CategoryExpenseStatResponse } from '@/services/analyticsService';
import { CHART_PALETTE } from '@/constants';

interface CategoryPieChartProps {
  categoryStats: CategoryExpenseStatResponse[];
  loading?: boolean;
}

const tooltipFormatter = (val: number) =>
  `${(val || 0).toLocaleString('vi-VN')} đ`;

export const CategoryPieChart: React.FC<CategoryPieChartProps> = React.memo(
  ({ categoryStats, loading }) => {
    const { t } = useTranslation();

    return (
      <AgDonutChart
        data={categoryStats ?? []}
        angleKey="totalAmount"
        labelKey="categoryName"
        title={t('dashboard.categoryTitle')}
        subtitle={t('dashboard.categorySub')}
        headerIcon={<CategoryIcon color="primary" />}
        height={300}
        loading={loading}
        emptyMessage={t('dashboard.noData')}
        innerRadiusRatio={0.6}
        fills={CHART_PALETTE as string[]}
        tooltipFormatter={tooltipFormatter}
        showLegend
      />
    );
  }
);

CategoryPieChart.displayName = 'CategoryPieChart';
