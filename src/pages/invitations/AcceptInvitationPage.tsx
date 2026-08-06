import React from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Avatar,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useAcceptInvitationStore } from './hooks/useAcceptInvitationStore';
import { InvitationDetailCard } from './components';

export const AcceptInvitationPage: React.FC = () => {
  const {
    t,
    invitation,
    isLoading,
    isError,
    error,
    isAuthenticated,
    inviterName,
    handleAccept,
    handleLoginRedirect,
    handleBackHome,
    isAcceptPending,
  } = useAcceptInvitationStore();

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
          <InvitationDetailCard
            invitation={invitation}
            inviterName={inviterName}
            isAuthenticated={isAuthenticated}
            isAcceptPending={isAcceptPending}
            onAccept={handleAccept}
            onLoginRedirect={handleLoginRedirect}
          />
        )}
      </Paper>
    </Container>
  );
};

export default AcceptInvitationPage;
