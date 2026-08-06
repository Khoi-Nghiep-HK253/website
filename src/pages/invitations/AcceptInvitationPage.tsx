import React, { useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Stack,
  Divider,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LoginIcon from '@mui/icons-material/Login';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';

import { useInvitationByToken, useAcceptInvitationByTokenMutation } from '@/hooks/query/useInvitationQuery';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import { useAuth } from '@/hooks/common';
import { useToast } from '@/hooks/common/useToast';
import { PATHS } from '@/constants/routes';

export const AcceptInvitationPage: React.FC = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('invitation.acceptTitle'));

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

  const { data: invitation, isLoading, isError, error } = useInvitationByToken(token);
  const acceptMutation = useAcceptInvitationByTokenMutation();

  const handleAccept = useCallback(() => {
    if (!token) return;
    acceptMutation.mutate(token, {
      onSuccess: (res) => {
        showSuccess(t('invitation.acceptSuccess'));
        const groupId = res.invitation?.group?.id || invitation?.group?.id;
        if (groupId) {
          navigate(PATHS.GROUPS.DETAIL(groupId), { replace: true });
        } else {
          navigate(PATHS.GROUPS.LIST, { replace: true });
        }
      },
      onError: (err: Error) => {
        showError(err.message || t('invitation.acceptError'));
      },
    });
  }, [token, acceptMutation, showSuccess, t, invitation?.group?.id, navigate, showError]);

  const handleLoginRedirect = useCallback(() => {
    const returnUrl = encodeURIComponent(`${location.pathname}${location.search}`);
    navigate(`${PATHS.LOGIN}?returnUrl=${returnUrl}`);
  }, [location.pathname, location.search, navigate]);

  const handleBackHome = useCallback(() => {
    navigate(PATHS.HOME);
  }, [navigate]);

  const inviterName = useMemo(() => {
    if (!invitation?.inviter) return 'User';
    const fullname = `${invitation.inviter.firstname || ''} ${invitation.inviter.lastname || ''}`.trim();
    return fullname || invitation.inviter.username;
  }, [invitation?.inviter]);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: '#4f46e5',
            mx: 'auto',
            mb: 2,
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
          }}
        >
          <EmailIcon sx={{ fontSize: 36, color: '#ffffff' }} />
        </Avatar>

        <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
          {t('invitation.acceptHeader')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('invitation.acceptSub')}
        </Typography>

        {/* Loading state */}
        {isLoading && (
          <Box sx={{ py: 4 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {t('invitation.loadingInfo')}
            </Typography>
          </Box>
        )}

        {/* Error state */}
        {isError && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="error" sx={{ borderRadius: 2, textAlign: 'left' }}>
              {error?.message || t('invitation.fetchError')}
            </Alert>
            <Button variant="outlined" color="primary" startIcon={<ArrowBackIcon />} onClick={handleBackHome} sx={{ mt: 2 }}>
              {t('common.backToHome')}
            </Button>
          </Box>
        )}

        {/* Invitation detail content */}
        {!isLoading && !isError && invitation && (
          <Box>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                mb: 3,
                borderRadius: 2,
                bgcolor: '#f1f5f9',
                textAlign: 'left',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ mb: 1.5, alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#3b82f6', width: 40, height: 40 }}>
                  <GroupIcon />
                </Avatar>

                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }} color="text.primary">
                    {invitation.group?.name || t('common.user')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('invitation.invitedBy')}: <strong>{inviterName}</strong>
                  </Typography>
                </Box>
              </Stack>

              {invitation.message && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    "{invitation.message}"
                  </Typography>
                </>
              )}

              <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`Trạng thái: ${invitation.status}`}
                  color={invitation.status === 'PENDING' ? 'warning' : 'default'}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Paper>

            {/* If not logged in, prompt user to log in first */}
            {!isAuthenticated ? (
              <Box>
                <Alert severity="info" sx={{ mb: 2, textAlign: 'left', borderRadius: 2 }}>
                  {t('invitation.loginPromptInfo')}
                </Alert>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  startIcon={<LoginIcon />}
                  onClick={handleLoginRedirect}
                  sx={{ py: 1.3, borderRadius: 2.5, fontWeight: 700 }}
                >
                  {t('invitation.loginToAcceptBtn')}
                </Button>
              </Box>
            ) : (
              /* Logged in: Accept button */
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={acceptMutation.isPending || invitation.status !== 'PENDING'}
                startIcon={
                  acceptMutation.isPending ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <CheckCircleIcon />
                  )
                }
                onClick={handleAccept}
                sx={{ py: 1.3, borderRadius: 2.5, fontWeight: 700 }}
              >
                {acceptMutation.isPending
                  ? t('invitation.acceptingBtn')
                  : invitation.status === 'PENDING'
                  ? t('invitation.acceptSubmitBtn')
                  : `${t('invitation.statusLabel')}: ${invitation.status}`}
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AcceptInvitationPage;
