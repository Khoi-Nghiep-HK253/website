import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { themeQuartz } from 'ag-grid-community';

/**
 * Returns an AG Grid v36 theme synced with the current MUI palette (dark/light aware).
 * Use by passing the result to the `theme` prop of <AgGridReact />.
 */
export function useAgGridTheme() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const p = theme.palette;

  return useMemo(() => {
    const bg = p.background.paper;
    // Slightly tinted header & odd-row backgrounds
    const headerBg = isDark
      ? 'rgba(255,255,255,0.04)'
      : 'rgba(0,0,0,0.025)';
    const oddRowBg = isDark
      ? 'rgba(255,255,255,0.025)'
      : 'rgba(0,0,0,0.018)';

    return themeQuartz.withParams({
      // ── Backgrounds ──
      backgroundColor: bg,
      chromeBackgroundColor: headerBg,    // headers, tool panels, menus
      headerBackgroundColor: headerBg,
      oddRowBackgroundColor: oddRowBg,
      menuBackgroundColor: bg,
      // ── Text / Foreground ──
      foregroundColor: p.text.primary,    // main text + derives most semi-transparent colors
      textColor: p.text.primary,
      subtleTextColor: p.text.secondary,  // secondary / muted text
      headerTextColor: p.text.primary,
      // ── Borders ──
      borderColor: p.divider,
      // ── Interaction ──
      rowHoverColor: p.action.hover,
      selectedRowBackgroundColor: p.action.selected,
      accentColor: p.primary.main,
      // ── Typography ──
      fontFamily: 'inherit',
      fontSize: 14,
      dataFontSize: 14,
      // ── Row & Header sizing ──
      headerHeight: 44,
      rowHeight: 48,
    });
  }, [isDark, p]);
}
