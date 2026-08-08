import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import GroupIcon from '@mui/icons-material/Group';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
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
        <Card
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: 3,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Avatar
            sx={{
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'error.light'),
              color: 'error.main',
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2,
            }}
          >
            <ErrorOutlinedIcon sx={{ fontSize: 36 }} />
          </Avatar>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
            {t('joinGroup.invalidTitle')}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {preview?.invalidReason || t('joinGroup.invalidMsg')}
          </Typography>

          <Button
            variant="contained"
            color="primary"
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
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 16px 40px rgba(0, 0, 0, 0.6)'
              : '0 20px 40px -10px rgba(0, 0, 0, 0.12)',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          backgroundImage: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            width: 72,
            height: 72,
            mx: 'auto',
            mb: 2,
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)',
          }}
        >
          <GroupIcon sx={{ fontSize: 40 }} />
        </Avatar>

        <Chip
          label={t('joinGroup.previewTitle')}
          color="primary"
          size="small"
          sx={{ mb: 1.5, fontWeight: 700 }}
        />

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
          {preview.groupName}
        </Typography>

        {preview.note && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
            "{preview.note}"
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
          {preview.categoryName && (
            <Chip
              label={preview.categoryName}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600, borderColor: 'divider' }}
            />
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
              sx={{ fontWeight: 600, borderColor: 'divider' }}
            />
          )}
        </Box>

        {isAuthenticated ? (
          <Button
            variant="contained"
            size="large"
            fullWidth
            color="primary"
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
