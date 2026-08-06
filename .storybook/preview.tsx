import React from 'react';
import type { Preview } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryProvider } from '../src/core/providers/QueryProvider';
import { AuthProvider } from '../src/context/AuthContext';
import { customLightTheme, customDarkTheme } from '../src/theme';
import '../src/index.css';
import '../src/i18n';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global MUI Theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'MUI Light Theme' },
          { value: 'dark', icon: 'circle', title: 'MUI Dark Theme' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === 'dark';
      const currentTheme = isDark ? customDarkTheme : customLightTheme;

      return (
        <QueryProvider>
          <AuthProvider>
            <MuiThemeProvider theme={currentTheme}>
              <CssBaseline />
              <MemoryRouter>
                <div style={{ padding: '24px', minHeight: '300px' }}>
                  <Story />
                </div>
              </MemoryRouter>
            </MuiThemeProvider>
          </AuthProvider>
        </QueryProvider>
      );
    },
  ],
};

export default preview;
