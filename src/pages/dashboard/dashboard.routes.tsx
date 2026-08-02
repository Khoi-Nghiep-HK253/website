import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { PATHS } from '@/constants';
import { withSuspense, ProtectedRoute } from '@/hocs';

const DashboardPage = lazy(() => import('./DashboardPage'));

export const dashboardRoutes: RouteObject[] = [
  {
    path: PATHS.DASHBOARD,
    element: (
      <ProtectedRoute>
        {withSuspense(DashboardPage)}
      </ProtectedRoute>
    ),
  },
];

export default dashboardRoutes;
