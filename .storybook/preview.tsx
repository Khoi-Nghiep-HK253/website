import React from 'react';
import type { Preview } from '@storybook/react';
import { FluentProvider } from '@fluentui/react-components';
import { MemoryRouter } from 'react-router-dom';
import { QueryProvider } from '../src/providers/QueryProvider';
import { AuthProvider } from '../src/context/AuthContext';
import { customLightTheme, customDarkTheme } from '../src/theme';

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
      description: 'Global Custom Fluent UI Theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Custom Light Theme' },
          { value: 'dark', icon: 'circle', title: 'Custom Dark Theme' },
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
        <FluentProvider theme={currentTheme}>
          <QueryProvider>
            <AuthProvider>
              <MemoryRouter>
                <div style={{ padding: '24px', minHeight: '300px' }}>
                  <Story />
                </div>
              </MemoryRouter>
            </AuthProvider>
          </QueryProvider>
        </FluentProvider>
      );
    },
  ],
};

export default preview;
