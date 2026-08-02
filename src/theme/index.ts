import { createTheme } from '@mui/material/styles';
import type { ThemeOptions, Theme } from '@mui/material/styles';
import { primaryBrandColor, secondaryBrandColor } from './brand';

const commonSettings: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
};

export const customLightTheme: Theme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'light',
    primary: {
      main: primaryBrandColor,
      light: '#34d399',
      dark: '#047857',
      contrastText: '#ffffff',
    },
    secondary: {
      main: secondaryBrandColor,
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
});

export const customDarkTheme: Theme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: '#34d399',
      light: '#6ee7b7',
      dark: '#059669',
      contrastText: '#022c22',
    },
    secondary: {
      main: '#818cf8',
      light: '#a5b4fc',
      dark: '#6366f1',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
  },
});

export { primaryBrandColor, secondaryBrandColor } from './brand';
