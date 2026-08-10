import type { ReactNode } from 'react';

// ── Common chart wrapper props ────────────────────────────────────────────────

export interface AgChartWrapperProps {
  /** Chart title shown in the header */
  title?: ReactNode;
  /** Subtitle / description shown below title */
  subtitle?: ReactNode;
  /** Icon shown next to the title */
  headerIcon?: ReactNode;
  /** Chart container height (default: 320) */
  height?: number;
  /** Loading state — shows skeleton */
  loading?: boolean;
  /** Message when data is empty */
  emptyMessage?: string;
}

// ── BarChart ──────────────────────────────────────────────────────────────────

export interface AgBarChartSeries {
  /** Key of the data field to use as the value */
  yKey: string;
  /** Label for this series in legend and tooltip */
  yName?: string;
  /** Fill color for bars */
  fill?: string;
  /** Corner radius on top of bars */
  cornerRadius?: number;
}

export interface AgBarChartProps extends AgChartWrapperProps {
  /** Array of data objects */
  data: Record<string, any>[];
  /** Field used for the category axis (X axis) */
  xKey: string;
  /** Series definitions */
  series: AgBarChartSeries[];
  /** Y-axis label formatter */
  yAxisFormatter?: (val: number) => string;
  /** Tooltip value formatter */
  tooltipFormatter?: (val: number) => string;
}

// ── DonutChart ────────────────────────────────────────────────────────────────

export interface AgDonutChartProps extends AgChartWrapperProps {
  /** Array of data objects */
  data: Record<string, any>[];
  /** Field used as the slice angle (value) */
  angleKey: string;
  /** Field used as the slice label (name) */
  labelKey: string;
  /** Inner radius ratio 0–1 to create a donut (default: 0.6) */
  innerRadiusRatio?: number;
  /** Color palette for slices */
  fills?: string[];
  /** Tooltip value formatter */
  tooltipFormatter?: (val: number) => string;
  /** Whether to show the legend (default: true) */
  showLegend?: boolean;
}
