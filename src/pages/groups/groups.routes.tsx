import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { PATHS } from '@/constants';
import { withSuspense, ProtectedRoute } from '@/hocs';

const GroupsListPage = lazy(() => import('./GroupsListPage'));
const GroupDetailPage = lazy(() => import('./GroupDetailPage'));
const JoinGroupPage = lazy(() => import('./JoinGroupPage'));

export const groupsRoutes: RouteObject[] = [
  {
    path: PATHS.GROUPS.LIST,
    element: (
      <ProtectedRoute>
        {withSuspense(GroupsListPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: PATHS.GROUPS.DETAIL(),
    element: (
      <ProtectedRoute>
        {withSuspense(GroupDetailPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: PATHS.INVITATION.JOIN(),
    element: withSuspense(JoinGroupPage),
  },
];

export default groupsRoutes;
