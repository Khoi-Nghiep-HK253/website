import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { HelpOutlined as HelpOutlineIcon, Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import { PATHS } from '@/router/routes';

export default function NotFoundPage() {
  const { t } = useTranslation();
  useDocumentTitle(`404 — ${t('errorPages.notFoundTitle')}`);
  const navigate = useNavigate();

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
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: 48 }} />
        </Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          {t('errorPages.notFoundTitle')}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {t('errorPages.notFoundSub')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('errorPages.notFoundDesc')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigate(PATHS.HOME)}
          sx={{ mt: 1 }}
        >
          {t('errorPages.backToHome')}
        </Button>
      </Card>
    </Box>
  );
}
