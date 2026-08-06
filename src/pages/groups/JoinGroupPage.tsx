import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import GroupIcon from '@mui/icons-material/Group';
import { ErrorOutlined } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LoginIcon from '@mui/icons-material/Login';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useJoinGroupStore } from './hooks/useJoinGroupStore';

export default function JoinGroupPage() {
  const {
    t,
    preview,
    loading,
    isAuthenticated,
    handleJoinGroup,
    handleBackToHome,
    isJoinPending,
  } = useJoinGroupStore();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={44} />
      </Box>
    );
  }

  if (!preview || !preview.isValid) {
    return (
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 6, px: 2, textAlign: 'center' }}>
        <Card sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
          <Avatar sx={{ bgcolor: 'error.light', color: 'error.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
            <ErrorOutlined sx={{ fontSize: 36 }} />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {t('joinGroup.invalidTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {preview?.invalidReason || t('joinGroup.invalidMsg')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToHome}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            {t('common.backToHome')}
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto', mt: 6, px: 2 }}>
      <Card
        sx={{
          p: { xs: 3, sm: 5 },
          textAlign: 'center',
          borderRadius: 5,
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            color: '#fff',
            width: 72,
            height: 72,
            mx: 'auto',
            mb: 2,
            boxShadow: 3,
          }}
        >
          <GroupIcon sx={{ fontSize: 40 }} />
        </Avatar>

        <Chip label={t('joinGroup.previewTitle')} color="primary" size="small" sx={{ mb: 1.5, fontWeight: 700 }} />

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          {preview.groupName}
        </Typography>

        {preview.note && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            "{preview.note}"
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
          {preview.categoryName && (
            <Chip label={preview.categoryName} variant="outlined" size="small" sx={{ fontWeight: 600 }} />
          )}
          <Chip
            label={t('joinGroup.memberCount', { count: preview.memberCount || 1 })}
            color="info"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />
          {preview.createdByUsername && (
            <Chip
              label={t('joinGroup.createdBy', { name: preview.createdByUsername })}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>

        {isAuthenticated ? (
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleJoinGroup}
            disabled={isJoinPending}
            startIcon={
              isJoinPending ? <CircularProgress size={22} color="inherit" /> : <CheckCircleIcon />
            }
            sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: '1.05rem' }}
          >
            {isJoinPending ? t('joinGroup.joining') : t('joinGroup.joinBtn')}
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            fullWidth
            color="primary"
            onClick={handleJoinGroup}
            startIcon={<LoginIcon />}
            sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: '1.05rem' }}
          >
            {t('joinGroup.loginToJoin')}
          </Button>
        )}
      </Card>
    </Box>
  );
}
