import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const WelcomePage = lazy(() => import('./WelcomePage'));
const ThankYouPage = lazy(() => import('./ThankYouPage'));

export const onboardingRoutes: RouteObject[] = [
  {
    path: '/welcome',
    element: <WelcomePage />,
  },
  {
    path: '/thank-you',
    element: <ThankYouPage />,
  },
];

export default onboardingRoutes;
