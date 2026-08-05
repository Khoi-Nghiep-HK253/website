import { createContext } from 'react';
import type { AlertColor } from '@mui/material/Alert';

export interface ToastContextType {
  showToast: (message: string, severity?: AlertColor) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
