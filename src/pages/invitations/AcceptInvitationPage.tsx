import React from 'react';
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
import { useAuth } from '@/hooks/common/useAuth';
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

  const handleAccept = () => {
    if (!token) return;
    acceptMutation.mutate(token, {
      onSuccess: (res) => {
        showSuccess(t('invitation.acceptSuccess'));
        const groupId = res.invitation?.group?.id || invitation?.group?.id;
        if (groupId) {
          navigate(`/groups/${groupId}`, { replace: true });
        } else {
          navigate(PATHS.GROUPS, { replace: true });
        }
      },
      onError: (err: Error) => {
        showError(err.message || t('invitation.acceptError'));
      },
    });
  };

  const inviterName = invitation?.inviter
    ? `${invitation.inviter.firstname || ''} ${invitation.inviter.lastname || ''}`.trim() || invitation.inviter.username
    : 'User';

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
          {t('invitation.acceptTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('invitation.appSubtitle')}
        </Typography>

        {isLoading && (
          <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress color="primary" />
            <Typography variant="body2" color="text.secondary">
              {t('invitation.verifyingLoading')}
            </Typography>
          </Box>
        )}

        {(!token || isError) && !isLoading && (
          <Box sx={{ py: 2 }}>
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              {error?.message || t('invitation.tokenInvalid')}
            </Alert>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(PATHS.HOME)}
            >
              {t('invitation.goHome')}
            </Button>
          </Box>
        )}

        {invitation && !isLoading && (
          <Box>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                bgcolor: '#ffffff',
                textAlign: 'left',
              }}
            >
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#e0e7ff', color: '#4f46e5' }}>
                  <GroupIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    {t('invitation.groupName')}
                  </Typography>
                  <Typography variant="h6" color="#1e1b4b" sx={{ fontWeight: 'bold' }}>
                    {invitation.group?.name || 'Group'}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              <Typography variant="body2" color="text.secondary">
                {t('invitation.inviterName')}: <strong>{inviterName}</strong>
              </Typography>

              {invitation.message && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 1.5,
                    bgcolor: '#f9fafb',
                    borderLeft: '4px solid #4f46e5',
                    fontStyle: 'italic',
                    color: '#374151',
                  }}
                >
                  "{invitation.message}"
                </Box>
              )}

              {invitation.status && invitation.status !== 'PENDING' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }} gutterBottom>
                    {t('invitation.statusLabel')}
                  </Typography>
                  {invitation.status === 'ACCEPTED' && (
                    <Chip label={t('invitation.accepted')} color="success" icon={<CheckCircleIcon />} />
                  )}
                  {invitation.status === 'EXPIRED' && (
                    <Chip label={t('invitation.expired')} color="error" />
                  )}
                  {invitation.status === 'DECLINED' && (
                    <Chip label={t('invitation.declined')} color="default" />
                  )}
                  {invitation.status === 'REVOKED' && (
                    <Chip label={t('invitation.revoked')} color="warning" />
                  )}
                </Box>
              )}
            </Paper>

            {/* Actions depending on status & auth */}
            {invitation.status === 'ACCEPTED' && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate(`/groups/${invitation.group.id}`)}
                sx={{
                  bgcolor: '#4f46e5',
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#4338ca' },
                }}
              >
                {t('invitation.enterGroupDetail')}
              </Button>
            )}

            {invitation.status !== 'PENDING' && invitation.status !== 'ACCEPTED' && (
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={() => navigate(PATHS.GROUPS)}
                sx={{ py: 1.5 }}
              >
                {t('invitation.backToGroups')}
              </Button>
            )}

            {invitation.status === 'PENDING' && (
              <Box>
                {!isAuthenticated ? (
                  <Box>
                    <Alert severity="info" sx={{ mb: 2, textAlign: 'left' }}>
                      {t('invitation.loginAlertMsg')}
                    </Alert>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<LoginIcon />}
                      onClick={() => navigate(PATHS.LOGIN, { state: { from: location } })}
                      sx={{
                        bgcolor: '#4f46e5',
                        py: 1.5,
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: '#4338ca' },
                      }}
                    >
                      {t('invitation.loginToAcceptBtn')}
                    </Button>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={acceptMutation.isPending}
                      onClick={handleAccept}
                      sx={{
                        bgcolor: '#4f46e5',
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: '#4338ca' },
                      }}
                    >
                      {acceptMutation.isPending ? t('invitation.processing') : t('invitation.acceptBtn')}
                    </Button>
                    <Button
                      variant="text"
                      color="inherit"
                      onClick={() => navigate(PATHS.GROUPS)}
                    >
                      {t('invitation.declineBtn')}
                    </Button>
                  </Stack>
                )}
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AcceptInvitationPage;
