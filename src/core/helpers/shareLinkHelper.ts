/**
 * Helper utilities for Share Links & QR Code generation.
 */

import { PATHS } from '@/constants/routes';

/**
 * Returns the full absolute URL for joining a group given its invite code.
 */
export const getFullShareUrl = (inviteCode: string): string => {
  if (!inviteCode) return '';
  return `${window.location.origin}${PATHS.INVITATION.JOIN(inviteCode)}`;
};

/**
 * Generates a public QR Code image URL for a given invite code.
 */
export const generateQrCodeUrl = (inviteCode: string, size = 200): string => {
  if (!inviteCode) return '';
  const fullUrl = getFullShareUrl(inviteCode);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(fullUrl)}`;
};
