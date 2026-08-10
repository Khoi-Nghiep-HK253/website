import { AgChartsCommunityModule } from 'ag-charts-community';

// AG Charts v14: call .setup() to register all community series/axes/themes
AgChartsCommunityModule.setup();

export { AgBarChart } from './AgBarChart';
export { AgDonutChart } from './AgDonutChart';
export type {
  AgBarChartProps,
  AgBarChartSeries,
  AgDonutChartProps,
  AgChartWrapperProps,
} from './AgChart.types';

