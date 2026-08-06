import React from 'react';
import MuiAlert from '@mui/material/Alert';
import type { AlertColor } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import type { AlertProps } from './Alert.types';

export const Alert: React.FC<AlertProps> = ({
  intent = 'info',
  title,
  children,
  icon,
  onDismiss,
  className,
  style,
}) => {
  const muiSeverity: AlertColor =
    intent === 'danger' ? 'error' : (intent as AlertColor);

  return (
    <MuiAlert
      severity={muiSeverity}
      icon={icon}
      onClose={onDismiss}
      className={className}
      style={style}
      sx={{ borderRadius: 2 }}
    >
      {title && <AlertTitle sx={{ fontWeight: 'bold' }}>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  );
};
