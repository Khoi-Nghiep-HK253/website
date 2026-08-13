/**
 * Centralized Route Paths & Navigation Constants
 */
export const PATHS = {
  HOME: '/',
  DASHBOARD: '/dashboard',

  // Group routes
  GROUPS: {
    LIST: '/groups',
    DETAIL: (groupId?: number | string) => (groupId ? `/groups/${groupId}` : '/groups/:groupId'),
  },

  // Auth routes
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },

  // Invitation routes
  INVITATION: {
    ACCEPT: '/invitations/accept',
    JOIN: (inviteCode?: string) => (inviteCode ? `/join/${inviteCode}` : '/join/:inviteCode'),
  },

  PROFILE: '/profile',
  SETTINGS: '/settings',
  WELCOME: '/welcome',
  THANK_YOU: '/thank-you',
  NOT_FOUND: '*',

  // Backward-compatible top-level aliases
  LOGIN: '/login',
  REGISTER: '/register',
  INVITATION_ACCEPT: '/invitations/accept',
};

export type RoutePath = (typeof PATHS)[keyof typeof PATHS];
