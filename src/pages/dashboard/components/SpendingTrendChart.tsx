import React from 'react';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useTranslation } from 'react-i18next';
import { AgBarChart } from '@/components/AgChart';
import type { TimePeriodStatResponse } from '@/services/analyticsService';

interface SpendingTrendChartProps {
  timeTrendStats: TimePeriodStatResponse[];
  loading?: boolean;
}

const yAxisFormatter = (val: number) => `${(val / 1000).toLocaleString()}k`;
const tooltipFormatter = (val: number) =>
  `${(val || 0).toLocaleString('vi-VN')} đ`;

export const SpendingTrendChart: React.FC<SpendingTrendChartProps> = React.memo(
  ({ timeTrendStats, loading }) => {
    const { t } = useTranslation();

    return (
      <AgBarChart
        data={timeTrendStats ?? []}
        xKey="periodLabel"
        series={[
          {
            yKey: 'totalAmount',
            yName: t('dashboard.trendSeriesName', 'Chi tiêu'),
            fill: '#6366f1',
            cornerRadius: 6,
          },
        ]}
        title={t('dashboard.trendTitle')}
        subtitle={t('dashboard.trendSub')}
        headerIcon={<ShowChartIcon color="secondary" />}
        height={300}
        loading={loading}
        emptyMessage={t('dashboard.noData')}
        yAxisFormatter={yAxisFormatter}
        tooltipFormatter={tooltipFormatter}
      />
    );
  }
);

SpendingTrendChart.displayName = 'SpendingTrendChart';
