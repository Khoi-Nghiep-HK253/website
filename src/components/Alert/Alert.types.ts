import type { ReactNode, ReactElement, CSSProperties } from 'react';

export type AlertIntent = 'info' | 'success' | 'warning' | 'error' | 'danger';

export interface AlertProps {
  intent?: AlertIntent;
  title?: string;
  children: ReactNode;
  icon?: ReactElement;
  onDismiss?: () => void;
  className?: string;
  style?: CSSProperties;
}
