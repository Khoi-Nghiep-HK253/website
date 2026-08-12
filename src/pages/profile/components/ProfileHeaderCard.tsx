import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import EmailIcon from '@mui/icons-material/Email';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslation } from 'react-i18next';
import type { UserResponse } from '@/services/authService';
import { useEntityAttachments } from '@/hooks/query/useMediaQuery';
import { MediaGalleryContainer, MediaUploaderContainer } from '@/containers';

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
  const { t } = useTranslation();
  const [openCoverModal, setOpenCoverModal] = useState(false);
  const [openAvatarModal, setOpenAvatarModal] = useState(false);

  const userId = user?.id;

  // Fetch cover & avatar image attachments for current user
  const { data: coverAttachments = [] } = useEntityAttachments('USER_COVER', userId);
  const { data: avatarAttachments = [] } = useEntityAttachments('USER_AVATAR', userId);

  const latestCover = coverAttachments[coverAttachments.length - 1];
  const coverUrl = latestCover?.fileUrl;

  const latestAvatar = avatarAttachments[avatarAttachments.length - 1];
  const avatarUrl = latestAvatar?.fileUrl;

  return (
    <>
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 3,
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        {/* Cover Photo Banner */}
        <Box
          sx={{
            height: { xs: 130, sm: 170, md: 210 },
            width: '100%',
            position: 'relative',
            backgroundImage: coverUrl
              ? `url("${coverUrl}")`
              : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #4338ca 100%)',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            p: 2,
          }}
        >
          {userId && (
            <Button
              startIcon={<CameraAltIcon />}
              onClick={() => setOpenCoverModal(true)}
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                zIndex: 2,
                bgcolor: '#ffffff',
                color: '#050505',
                fontWeight: 600,
                fontSize: '0.8rem',
                textTransform: 'none',
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#f2f2f2',
                  transform: 'scale(1.02)',
                },
              }}
            >
              {t('media.manageUserCoverTooltip') || 'Chỉnh sửa ảnh bìa'}
            </Button>
          )}
        </Box>

        {/* Profile Content Container */}
        <Box sx={{ px: { xs: 2.5, sm: 4 }, pb: 3, pt: 0 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 2.5,
            }}
          >
            {/* Avatar (Overlapping cover photo) */}
            <Box
              sx={{
                position: 'relative',
                mt: { xs: -3, sm: -5, md: -6 },
                flexShrink: 0,
              }}
            >
              <Avatar
                src={avatarUrl}
                sx={{
                  bgcolor: 'primary.main',
                  width: { xs: 84, sm: 106, md: 124 },
                  height: { xs: 84, sm: 106, md: 124 },
                  border: '4px solid',
                  borderColor: 'background.paper',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                  fontSize: { xs: '2.2rem', sm: '2.8rem' },
                  fontWeight: 'bold',
                  cursor: userId ? 'pointer' : 'default',
                }}
                onClick={() => userId && setOpenAvatarModal(true)}
              >
                {!avatarUrl && (userInitial || <PersonIcon sx={{ fontSize: 50 }} />)}
              </Avatar>

              {userId && (
                <Tooltip title={t('media.manageUserAvatarTooltip') || 'Chỉnh sửa ảnh đại diện'}>
                  <IconButton
                    onClick={() => setOpenAvatarModal(true)}
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      right: 2,
                      bgcolor: '#e4e6eb',
                      color: '#050505',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      p: 0.8,
                      '&:hover': {
                        bgcolor: '#d8dadf',
                      },
                    }}
                  >
                    <PhotoCameraIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* Profile User Info */}
            <Box
              sx={{
                flex: 1,
                mt: { xs: 0, sm: 1.5 },
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
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
                  <Chip
                    label={user.role}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 700, borderRadius: 2 }}
                  />
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
          </Box>
        </Box>
      </Card>

      {/* User Cover Photo Manager Dialog */}
      {userId && (
        <Dialog open={openCoverModal} onClose={() => setOpenCoverModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            {t('media.uploadUserCoverTitle') || 'Chỉnh sửa ảnh bìa cá nhân'}
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
            <MediaGalleryContainer entityType="USER_COVER" entityId={userId} />
            <MediaUploaderContainer
              entityType="USER_COVER"
              entityId={userId}
              label={t('media.uploadUserCoverLabel') || 'Tải ảnh bìa cá nhân mới lên'}
              buttonLabel={t('media.selectFile')}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenCoverModal(false)} variant="outlined">
              {t('common.close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* User Avatar Photo Manager Dialog */}
      {userId && (
        <Dialog open={openAvatarModal} onClose={() => setOpenAvatarModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            {t('media.uploadUserAvatarTitle') || 'Chỉnh sửa ảnh đại diện cá nhân'}
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
            <MediaGalleryContainer entityType="USER_AVATAR" entityId={userId} />
            <MediaUploaderContainer
              entityType="USER_AVATAR"
              entityId={userId}
              label={t('media.uploadUserAvatarLabel') || 'Tải ảnh đại diện mới lên'}
              buttonLabel={t('media.selectFile')}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenAvatarModal(false)} variant="outlined">
              {t('common.close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
