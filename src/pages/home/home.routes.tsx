import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { PATHS } from '@/constants';
import { withSuspense } from '@/hocs';

const HomePage = lazy(() => import('./HomePage'));

export const homeRoutes: RouteObject[] = [
  {
    path: PATHS.HOME,
    element: withSuspense(HomePage),
  },
];

export default homeRoutes;
