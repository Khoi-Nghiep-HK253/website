import { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/common';
import {
  useGroupPreview,
  useJoinGroupViaLinkMutation,
} from '@/hooks/query/useGroupShareLinkQuery';
import { useToast } from '@/hooks/common/useToast';
import { PATHS } from '@/router/routes';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';

export default function JoinGroupPage() {
  const { t } = useTranslation();
  const { inviteCode = '' } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

  const { data: preview, isPending: loading } = useGroupPreview(inviteCode);
  const joinGroupMutation = useJoinGroupViaLinkMutation();

  useDocumentTitle(preview?.groupName ? `Tham gia ${preview.groupName}` : 'Divvy – Join Group');

  const handleJoinGroup = useCallback(() => {
    if (!isAuthenticated) {
      navigate(`${PATHS.LOGIN}?returnUrl=${encodeURIComponent(PATHS.INVITATION.JOIN(inviteCode))}`);
      return;
    }

    joinGroupMutation.mutate(inviteCode, {
      onSuccess: (res) => {
        showSuccess(t('joinGroup.joinSuccess'));
        navigate(PATHS.GROUPS.DETAIL(res.groupId));
      },
      onError: (err) => {
        showError(err.message || 'Failed to join group');
      },
    });
  }, [isAuthenticated, inviteCode, joinGroupMutation, navigate, showError, showSuccess, t]);

  const handleBackToHome = useCallback(() => {
    navigate(PATHS.HOME);
  }, [navigate]);

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
            disabled={joinGroupMutation.isPending}
            startIcon={
              joinGroupMutation.isPending ? <CircularProgress size={22} color="inherit" /> : <CheckCircleIcon />
            }
            sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: '1.05rem' }}
          >
            {joinGroupMutation.isPending ? t('joinGroup.joining') : t('joinGroup.joinBtn')}
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
