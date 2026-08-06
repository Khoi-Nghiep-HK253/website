import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import type { PageLoaderProps } from './PageLoader.types';

export const PageLoader: React.FC<PageLoaderProps> = ({ label, minHeight = '60vh' }) => {
  const { t } = useTranslation();
  const displayLabel = label || t('common.pageLoading');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        gap: 2,
        width: '100%',
      }}
    >
      <CircularProgress size={48} />
      {displayLabel && (
        <Typography variant="body2" color="text.secondary">
          {displayLabel}
        </Typography>
      )}
    </Box>
  );
};
