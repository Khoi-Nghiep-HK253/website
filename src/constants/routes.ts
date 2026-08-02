/**
 * Centralized Route Paths & Navigation Constants
 */
export const PATHS = {
  HOME: '/',
  GROUPS: '/groups',
  GROUP_DETAIL: '/groups/:groupId',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOT_FOUND: '*',
} as const;

export type RoutePath = (typeof PATHS)[keyof typeof PATHS];

export interface NavigationItem {
  path: string;
  label: string;
  isProtected?: boolean;
}

export const NAV_ITEMS: NavigationItem[] = [
  { path: PATHS.HOME, label: 'Trang chủ' },
  { path: PATHS.GROUPS, label: 'Danh sách nhóm', isProtected: true },
];
