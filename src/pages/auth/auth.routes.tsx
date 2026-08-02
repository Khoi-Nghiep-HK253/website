import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { PATHS } from '@/constants';
import { withSuspense } from '@/hocs';
import { AuthLayout } from '@/layouts/AuthLayout';
import ErrorPage from '@/pages/error/ErrorPage';

const LoginPage = lazy(() => import('./LoginPage'));
const RegisterPage = lazy(() => import('./RegisterPage'));

export const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: PATHS.LOGIN,
        element: withSuspense(LoginPage),
      },
      {
        path: PATHS.REGISTER,
        element: withSuspense(RegisterPage),
      },
    ],
  },
];

export default authRoutes;
