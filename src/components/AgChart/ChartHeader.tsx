import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ChartHeaderProps {
  headerIcon?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function ChartHeader({ headerIcon, title, subtitle }: ChartHeaderProps) {
  if (!title && !subtitle) return null;
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        {headerIcon && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>{headerIcon}</Box>
        )}
        {title && (
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
            {title}
          </Typography>
        )}
      </Box>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
