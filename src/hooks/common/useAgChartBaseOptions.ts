import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { CHART_PALETTE } from '@/constants';

interface UseAgChartBaseOptionsParams {
  /** Color palette for chart series (default: CHART_PALETTE) */
  fills?: string[];
}

/**
 * Returns the shared AG Charts base options (background, theme, palette, legend colors)
 * synced with the current MUI theme (dark/light aware).
 *
 * Usage:
 * ```ts
 * const { baseOptions, palette, textPrimary, textSecondary, divider } = useAgChartBaseOptions();
 * const options = useMemo(() => ({ ...baseOptions, series: [...] }), [baseOptions]);
 * ```
 */
export function useAgChartBaseOptions({ fills }: UseAgChartBaseOptionsParams = {}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const palette = fills ?? (CHART_PALETTE as string[]);

  const baseOptions = useMemo(
    () => ({
      /** Transparent so the MUI Paper background shows through */
      background: { fill: 'transparent' },
      theme: {
        baseTheme: (isDark ? 'ag-default-dark' : 'ag-default') as
          | 'ag-default-dark'
          | 'ag-default',
        palette: {
          fills: palette,
          strokes: palette,
        },
      },
      legend: {
        item: {
          label: { color: theme.palette.text.primary },
        },
      },
    }),
    [isDark, palette, theme.palette.text.primary]
  );

  return {
    /** Spread into AgChartOptions: background + theme + legend base */
    baseOptions,
    /** isDark flag for conditional logic */
    isDark,
    /** The resolved fill palette */
    palette,
    // Convenience palette token shortcuts
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    divider: theme.palette.divider,
  };
}
