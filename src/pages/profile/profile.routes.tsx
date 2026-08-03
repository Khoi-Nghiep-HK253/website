import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { PATHS } from '@/constants';
import { withSuspense, ProtectedRoute } from '@/hocs';

const ProfilePage = lazy(() => import('./ProfilePage'));

export const profileRoutes: RouteObject[] = [
  {
    path: PATHS.PROFILE,
    element: (
      <ProtectedRoute>
        {withSuspense(ProfilePage)}
      </ProtectedRoute>
    ),
  },
];

export default profileRoutes;
