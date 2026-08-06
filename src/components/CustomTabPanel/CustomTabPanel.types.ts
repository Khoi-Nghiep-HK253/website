import type { ReactNode } from 'react';

export interface CustomTabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}
