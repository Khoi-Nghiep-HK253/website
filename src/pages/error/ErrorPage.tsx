import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { WarningAmber as WarningAmberIcon, Refresh as RefreshIcon, Home as HomeIcon } from '@mui/icons-material';
import { PATHS } from '@/router/routes';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = 'Đã xảy ra lỗi không xác định.';
  let statusCode = 'Lỗi Ứng Dụng';

  if (isRouteErrorResponse(error)) {
    statusCode = `Lỗi ${error.status}`;
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
          Ứng dụng đã bắt được ngoại lệ thông qua React Router Error Boundary.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
          >
            Tải lại trang
          </Button>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={() => navigate(PATHS.HOME)}
          >
            Về Trang Chủ
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
