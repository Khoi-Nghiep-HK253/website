import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { PATHS } from '@/constants';
import { withSuspense } from '@/hocs';

const NotFoundPage = lazy(() => import('./NotFoundPage'));

export const errorRoutes: RouteObject[] = [
  {
    path: PATHS.NOT_FOUND,
    element: withSuspense(NotFoundPage),
  },
];

export default errorRoutes;
