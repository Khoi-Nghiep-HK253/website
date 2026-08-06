import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import EmailIcon from '@mui/icons-material/Email';
import type { UserResponse } from '@/services/authService';

interface ProfileHeaderCardProps {
  user: UserResponse | null;
  userInitial: string;
  displayName: string;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  user,
  userInitial,
  displayName,
}) => {
  return (
    <Card
      sx={{
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 4,
        boxShadow: 3,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'center', sm: 'flex-start' },
        gap: 3,
        background: 'linear-gradient(135deg, rgba(79,70,229,0.05) 0%, rgba(99,102,241,0.12) 100%)',
      }}
    >
      <Avatar
        sx={{
          width: { xs: 72, md: 88 },
          height: { xs: 72, md: 88 },
          bgcolor: 'primary.main',
          fontSize: { xs: '2rem', md: '2.5rem' },
          fontWeight: 'bold',
          boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
        }}
      >
        {userInitial}
      </Avatar>

      <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', sm: 'flex-start' },
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
            {displayName}
          </Typography>
          {user?.role && (
            <Chip label={user.role} color="primary" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} />
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            justifyContent: { xs: 'center', sm: 'flex-start' },
          }}
        >
          <EmailIcon fontSize="small" /> {user?.email}
        </Typography>

        {user?.username && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Username: <strong>@{user.username}</strong>
          </Typography>
        )}
      </Box>
    </Card>
  );
};
