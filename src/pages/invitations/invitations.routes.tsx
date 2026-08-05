import type { RouteObject } from 'react-router-dom';
import { PATHS } from '@/constants';
import AcceptInvitationPage from './AcceptInvitationPage';

export const routes: RouteObject[] = [
  {
    path: PATHS.INVITATION_ACCEPT,
    element: <AcceptInvitationPage />,
  },
];

export default routes;
