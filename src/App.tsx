import { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { QueryProvider } from '@/providers/QueryProvider';
import { CustomThemeProvider, useAppTheme } from '@/theme/ThemeProvider';
import { createAppRouter } from '@/router';

function AppRouterContainer() {
  const { isDark, toggleTheme } = useAppTheme();

  const router = useMemo(
    () => createAppRouter(isDark, toggleTheme),
    [isDark, toggleTheme]
  );

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <QueryProvider>
      <CustomThemeProvider>
        <AuthProvider>
          <AppRouterContainer />
        </AuthProvider>
      </CustomThemeProvider>
    </QueryProvider>
  );
}