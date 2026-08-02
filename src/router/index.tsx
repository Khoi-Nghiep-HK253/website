import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import ErrorPage from '@/pages/error/ErrorPage';
import { registeredRoutes } from './registry';

/**
 * Main Application Router Shell
 * Zero-maintenance file: All feature routes are auto-discovered from *.routes.tsx files!
 */
export const createAppRouter = (isDarkTheme?: boolean, onToggleTheme?: () => void) => {
  const rootChildrenRoutes: RouteObject[] = [];
  const standaloneRoutes: RouteObject[] = [];

  registeredRoutes.forEach((route) => {
    // If a route defines its own top-level layout container (like AuthLayout with children), keep standalone
    if (route.children && route.element) {
      standaloneRoutes.push(route);
    } else {
      // Main page routes belong inside RootLayout (which renders the top Header & Nav bar)
      rootChildrenRoutes.push(route);
    }
  });

  const routes: RouteObject[] = [
    {
      element: <RootLayout isDarkTheme={isDarkTheme} onToggleTheme={onToggleTheme} />,
      errorElement: <ErrorPage />,
      children: rootChildrenRoutes,
    },
    ...standaloneRoutes,
  ];

  return createBrowserRouter(routes);
};
