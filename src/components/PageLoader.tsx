import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

export const PageLoader = ({ label }: { label?: string }) => {
  const { t } = useTranslation();
  const displayLabel = label || t('common.pageLoading');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
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
