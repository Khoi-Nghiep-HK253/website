import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useTranslation } from 'react-i18next';
import { AgCharts } from 'ag-charts-react';
import type { AgDonutChartProps } from './AgChart.types';
import { ChartHeader } from './ChartHeader';
import { CHART_PALETTE } from '@/constants';
import { useAgChartBaseOptions } from '@/hooks/common/useAgChartBaseOptions';

// ── AgDonutChart ──────────────────────────────────────────────────────────────

export const AgDonutChart: React.FC<AgDonutChartProps> = ({
  data = [],
  angleKey,
  labelKey,
  title,
  subtitle,
  headerIcon,
  height = 320,
  loading = false,
  emptyMessage,
  innerRadiusRatio = 0.6,
  fills = CHART_PALETTE as string[],
  tooltipFormatter,
  showLegend = true,
}) => {
  const { t } = useTranslation();
  const resolvedEmptyMessage = emptyMessage ?? t('chart.noData');
  const { baseOptions } = useAgChartBaseOptions({ fills });

  const options = useMemo(() => ({
    ...baseOptions,
    theme: {
      ...baseOptions.theme,
      // Donut slices use transparent strokes between segments
      palette: { fills, strokes: fills.map(() => 'transparent') },
    },
    data,
    series: [
      {
        type: 'donut' as const,
        angleKey,
        calloutLabelKey: labelKey,
        sectorLabelKey: angleKey,
        innerRadiusRatio,
        fills,
        strokes: fills.map(() => 'transparent'),
        ...(tooltipFormatter
          ? {
              tooltip: {
                renderer: (params: any) => ({
                  title: params.datum[labelKey],
                  content: tooltipFormatter(params.datum[angleKey]),
                }),
              },
            }
          : {}),
      },
    ],
    legend: {
      ...baseOptions.legend,
      enabled: showLegend,
    },
  }), [baseOptions, data, angleKey, labelKey, innerRadiusRatio, fills, tooltipFormatter, showLegend]);

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
      <ChartHeader headerIcon={headerIcon} title={title} subtitle={subtitle} />

      {loading ? (
        <Skeleton variant="circular" height={height} width={height} sx={{ mx: 'auto' }} />
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

AgDonutChart.displayName = 'AgDonutChart';
