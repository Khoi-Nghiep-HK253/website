import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { PATHS } from '@/constants';
import { withSuspense, ProtectedRoute } from '@/hocs';

const GroupsListPage = lazy(() => import('./GroupsListPage'));
const GroupDetailPage = lazy(() => import('./GroupDetailPage'));

export const groupsRoutes: RouteObject[] = [
  {
    path: PATHS.GROUPS,
    element: (
      <ProtectedRoute>
        {withSuspense(GroupsListPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: PATHS.GROUP_DETAIL,
    element: (
      <ProtectedRoute>
        {withSuspense(GroupDetailPage)}
      </ProtectedRoute>
    ),
  },
];

export default groupsRoutes;
