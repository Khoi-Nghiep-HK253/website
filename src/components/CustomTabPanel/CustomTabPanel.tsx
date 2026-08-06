import React from 'react';
import Box from '@mui/material/Box';
import type { CustomTabPanelProps } from './CustomTabPanel.types';

export const CustomTabPanel: React.FC<CustomTabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};
