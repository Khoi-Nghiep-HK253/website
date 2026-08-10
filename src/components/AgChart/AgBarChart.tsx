import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useTranslation } from 'react-i18next';
import { AgCharts } from 'ag-charts-react';
import type { AgBarChartProps } from './AgChart.types';
import { ChartHeader } from './ChartHeader';
import { CHART_PALETTE } from '@/constants';
import { useAgChartBaseOptions } from '@/hooks/common/useAgChartBaseOptions';


export const AgBarChart: React.FC<AgBarChartProps> = ({
  data = [],
  xKey,
  series,
  title,
  subtitle,
  headerIcon,
  height = 320,
  loading = false,
  emptyMessage,
  yAxisFormatter,
  tooltipFormatter,
}) => {
  const { t } = useTranslation();
  const resolvedEmptyMessage = emptyMessage ?? t('chart.noData');
  const { baseOptions, textSecondary, divider } = useAgChartBaseOptions();

  const options = useMemo(() => ({
    ...baseOptions,
    data,
    series: series.map((s, i) => ({
      type: 'bar' as const,
      xKey,
      yKey: s.yKey,
      yName: s.yName,
      fill: s.fill ?? (CHART_PALETTE as string[])[i % CHART_PALETTE.length],
      strokeWidth: 0,
      cornerRadius: s.cornerRadius ?? 6,
      ...(tooltipFormatter
        ? {
            tooltip: {
              renderer: (params: any) => ({
                content: tooltipFormatter(params.datum[s.yKey]),
              }),
            },
          }
        : {}),
    })),
    axes: [
      {
        type: 'category' as const,
        position: 'bottom' as const,
        label: { color: textSecondary },
        line: { enabled: false },
        gridLine: { enabled: false },
      },
      {
        type: 'number' as const,
        position: 'left' as const,
        label: {
          color: textSecondary,
          ...(yAxisFormatter
            ? { formatter: (params: any) => yAxisFormatter(params.value) }
            : {}),
        },
        gridLine: {
          style: [{ stroke: divider, lineDash: [4, 4] }],
        },
        line: { enabled: false },
      },
    ],
    legend: {
      ...baseOptions.legend,
      enabled: series.length > 1,
    },
  }), [baseOptions, data, xKey, series, textSecondary, divider, yAxisFormatter, tooltipFormatter]);

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
      <ChartHeader headerIcon={headerIcon} title={title} subtitle={subtitle} />

      {loading ? (
        <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 2 }} />
      ) : !data.length ? (
        <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
          <Typography variant="body2">{resolvedEmptyMessage}</Typography>
        </Box>
      ) : (
        <Box sx={{ height }}>
          <AgCharts options={options as any} style={{ height: '100%', width: '100%' }} />
        </Box>
      )}
    </Paper>
  );
};

AgBarChart.displayName = 'AgBarChart';
