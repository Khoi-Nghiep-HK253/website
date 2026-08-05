import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { WarningAmber as WarningAmberIcon, Refresh as RefreshIcon, Home as HomeIcon } from '@mui/icons-material';
import { PATHS } from '@/router/routes';

export default function ErrorPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('common.error'));
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = t('errorPages.errorSub');
  let statusCode = t('common.error');

  if (isRouteErrorResponse(error)) {
    statusCode = `Error ${error.status}`;
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, textAlign: 'center' }}>
      <Card
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          boxShadow: 4,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: '50%',
            bgcolor: 'error.light',
            color: 'error.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WarningAmberIcon sx={{ fontSize: 48 }} />
        </Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          {statusCode}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {errorMessage}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('errorPages.errorTitle')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
          >
            {t('errorPages.reloadBtn')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={() => navigate(PATHS.HOME)}
          >
            {t('errorPages.backToHome')}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
