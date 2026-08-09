import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupIcon from '@mui/icons-material/Group';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import type { GroupResponse } from '@/services/groupService';
import { useEntityAttachments } from '@/hooks/query/useMediaQuery';
import { useCategories } from '@/hooks/query/useMasterQuery';
import { MediaGalleryContainer, MediaUploaderContainer } from '@/containers';
import { EditGroupModal } from './EditGroupModal';

interface GroupDetailHeaderProps {
  group: GroupResponse;
  isOwner?: boolean;
  onBackToList: () => void;
  onOpenCreateExpense?: () => void;
  onOpenAddMember?: () => void;
}

export const GroupDetailHeader: React.FC<GroupDetailHeaderProps> = ({
  group,
  isOwner = false,
  onBackToList,
}) => {
  const { t } = useTranslation();
  const [openCoverModal, setOpenCoverModal] = useState(false);
  const [openAvatarModal, setOpenAvatarModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const { data: categories = [] } = useCategories();

  // Fetch cover image attachments for this group (GROUP_COVER or GROUP_AVATAR fallback)
  const { data: coverAttachments = [] } = useEntityAttachments('GROUP_COVER', group.id);
  const { data: avatarAttachments = [] } = useEntityAttachments('GROUP_AVATAR', group.id);

  const latestCover = coverAttachments[coverAttachments.length - 1];
  const coverUrl = latestCover?.fileUrl;

  const latestAvatar = avatarAttachments[avatarAttachments.length - 1];
  const avatarUrl = latestAvatar?.fileUrl;

  return (
    <>
      {/* Group Header Card with Cover Background */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 3,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Cover Banner */}
        <Box
          sx={{
            height: { xs: 110, sm: 160, md: 200 },
            width: '100%',
            position: 'relative',
            backgroundImage: coverUrl
              ? `url("${coverUrl}")`
              : 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            p: 2,
          }}
        >
          {/* Back Button on Cover Banner (Clean text icon button without background) */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBackToList}
            sx={{
              position: 'absolute',
              top: 14,
              left: 14,
              zIndex: 2,
              color: '#ffffff',
              filter: 'drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.7))',
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                transform: 'scale(1.03)',
              },
            }}
          >
            {t('groupDetail.backToList')}
          </Button>

          {/* Subtle overlay for contrast */}
          {coverUrl && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)',
              }}
            />
          )}

          {/* Change Cover Button (Owner only - Bottom Right) */}
          {isOwner && (
            <Tooltip title={t('media.manageCoverTooltip')}>
              <IconButton
                onClick={() => setOpenCoverModal(true)}
                sx={{
                  position: 'absolute',
                  bottom: 14,
                  right: 14,
                  zIndex: 2,
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  boxShadow: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'scale(1.08)',
                  },
                }}
              >
                <CameraAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Content Below Cover */}
        <Box sx={{ p: { xs: 2.5, md: 3.5 }, pt: 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mt: { xs: -4, sm: -5 },
              mb: 1,
            }}
          >
            {/* Avatar & Title */}
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={avatarUrl}
                  sx={{
                    bgcolor: 'primary.main',
                    width: { xs: 72, sm: 88 },
                    height: { xs: 72, sm: 88 },
                    border: '4px solid',
                    borderColor: 'background.paper',
                    boxShadow: 3,
                    cursor: isOwner ? 'pointer' : 'default',
                  }}
                  onClick={() => isOwner && setOpenAvatarModal(true)}
                >
                  {!avatarUrl && <GroupIcon sx={{ fontSize: { xs: 40, sm: 48 } }} />}
                </Avatar>

                {isOwner && (
                  <Tooltip title={t('media.manageAvatarTooltip')}>
                    <IconButton
                      size="small"
                      onClick={() => setOpenAvatarModal(true)}
                      sx={{
                        position: 'absolute',
                        bottom: 4,
                        right: -2,
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        boxShadow: 3,
                        border: '2px solid',
                        borderColor: 'background.paper',
                        p: 0.6,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <PhotoCameraIcon fontSize="small" style={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              <Box sx={{ pb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    {group.name}
                  </Typography>
                  {isOwner && (
                    <Tooltip title={t('editGroupModal.title')}>
                      <IconButton
                        size="small"
                        onClick={() => setOpenEditModal(true)}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { color: 'primary.main', bgcolor: 'action.hover' },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {group.note || t('groups.noNote')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Cover Image Manager Dialog */}
      <Dialog open={openCoverModal} onClose={() => setOpenCoverModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{t('media.uploadCoverTitle')}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
          <MediaGalleryContainer entityType="GROUP_COVER" entityId={group.id} />
          <MediaUploaderContainer
            entityType="GROUP_COVER"
            entityId={group.id}
            label={t('media.uploadCoverLabel')}
            buttonLabel={t('media.selectFile')}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenCoverModal(false)} variant="outlined">
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Avatar Image Manager Dialog */}
      <Dialog open={openAvatarModal} onClose={() => setOpenAvatarModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{t('media.uploadAvatarTitle')}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
          <MediaGalleryContainer entityType="GROUP_AVATAR" entityId={group.id} />
          <MediaUploaderContainer
            entityType="GROUP_AVATAR"
            entityId={group.id}
            label={t('media.uploadAvatarLabel')}
            buttonLabel={t('media.selectFile')}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenAvatarModal(false)} variant="outlined">
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Group Info Modal */}
      {openEditModal && (
        <EditGroupModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          group={group}
          categories={categories}
        />
      )}
    </>
  );
};
