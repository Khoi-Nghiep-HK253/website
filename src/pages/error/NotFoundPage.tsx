import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { HelpOutlined as HelpOutlineIcon, Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/router/routes';

export default function NotFoundPage() {
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
          Trang Không Tồn Tại (404)
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Đường dẫn bạn truy cập không tồn tại hoặc đã bị di chuyển.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Vui lòng kiểm tra lại URL hoặc quay về trang chủ.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigate(PATHS.HOME)}
          sx={{ mt: 1 }}
        >
          Quay về Trang Chủ
        </Button>
      </Card>
    </Box>
  );
}
