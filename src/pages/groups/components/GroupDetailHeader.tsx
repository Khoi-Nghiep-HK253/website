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
import GroupIcon from '@mui/icons-material/Group';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UpdateIcon from '@mui/icons-material/Update';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslation } from 'react-i18next';
import type { GroupResponse } from '@/services/groupService';
import { useEntityAttachments } from '@/hooks/query/useMediaQuery';
import { useCategories } from '@/hooks/query/useMasterQuery';
import { MediaGalleryContainer, MediaUploaderContainer } from '@/containers';
import { formatDate } from '@/core/helpers';
import { EditGroupModal } from './EditGroupModal';

interface GroupDetailHeaderProps {
  group: GroupResponse;
  isOwner?: boolean;
  onBackToList?: () => void;
  onOpenCreateExpense?: () => void;
  onOpenAddMember?: () => void;
}

export const GroupDetailHeader: React.FC<GroupDetailHeaderProps> = ({
  group,
  isOwner = false,
}) => {
  const { t, i18n } = useTranslation();
  const [openCoverModal, setOpenCoverModal] = useState(false);
  const [openAvatarModal, setOpenAvatarModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const { data: categories = [] } = useCategories();
  const categoryName = group.category?.name || group.categoryName;

  // Fetch cover & avatar image attachments for this group
  const { data: coverAttachments = [] } = useEntityAttachments('GROUP_COVER', group.id);
  const { data: avatarAttachments = [] } = useEntityAttachments('GROUP_AVATAR', group.id);

  const latestCover = coverAttachments[coverAttachments.length - 1];
  const coverUrl = latestCover?.fileUrl;

  const latestAvatar = avatarAttachments[avatarAttachments.length - 1];
  const avatarUrl = latestAvatar?.fileUrl;

  return (
    <>
      {/* Group Header Card in Facebook Profile style */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 3,
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        {/* Cover Banner */}
        <Box
          sx={{
            height: { xs: 120, sm: 160, md: 190 },
            width: '100%',
            position: 'relative',
            backgroundImage: coverUrl
              ? `url("${coverUrl}")`
              : 'linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            p: 2,
          }}
        >
          {/* Edit Cover Photo Button (Facebook style) */}
          {isOwner && (
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
              {t('media.uploadCoverTitle') || 'Chỉnh sửa ảnh bìa'}
            </Button>
          )}
        </Box>

        {/* Profile Details Container */}
        <Box sx={{ px: { xs: 2.5, sm: 4 }, pb: 2.5, pt: 0 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-start' },
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* Left Section: Avatar + Main Info */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' },
                gap: 2.5,
                width: '100%',
              }}
            >
              {/* Avatar Image (Overlapping cover photo) */}
              <Box
                sx={{
                  position: 'relative',
                  mt: { xs: -2.5, sm: -4, md: -5 },
                  flexShrink: 0,
                }}
              >
                <Avatar
                  src={avatarUrl}
                  sx={{
                    bgcolor: 'primary.main',
                    width: { xs: 80, sm: 100, md: 116 },
                    height: { xs: 80, sm: 100, md: 116 },
                    border: '4px solid',
                    borderColor: 'background.paper',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                    cursor: isOwner ? 'pointer' : 'default',
                  }}
                  onClick={() => isOwner && setOpenAvatarModal(true)}
                >
                  {!avatarUrl && <GroupIcon sx={{ fontSize: { xs: 44, sm: 54, md: 62 } }} />}
                </Avatar>

                {isOwner && (
                  <Tooltip title={t('media.manageAvatarTooltip')}>
                    <IconButton
                      onClick={() => setOpenAvatarModal(true)}
                      sx={{
                        position: 'absolute',
                        bottom: 4,
                        right: 2,
                        bgcolor: '#e4e6eb',
                        color: '#050505',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        border: '2px solid',
                        borderColor: 'background.paper',
                        p: 0.6,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: '#d8dadf',
                          transform: 'scale(1.08)',
                        },
                      }}
                    >
                      <PhotoCameraIcon fontSize="small" style={{ fontSize: 15 }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              {/* Group Info Section */}
              <Box
                sx={{
                  pb: 0.5,
                  pt: { xs: 0, sm: 1.5 },
                  textAlign: { xs: 'center', sm: 'left' },
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {/* Title */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    gap: 1,
                    mb: 0.4,
                    minWidth: 0,
                    maxWidth: '100%',
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h1"
                    title={group.name}
                    sx={{
                      fontWeight: 800,
                      color: 'text.primary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                    }}
                  >
                    {group.name}
                  </Typography>

                  {categoryName && (
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 500,
                        color: 'text.secondary',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      ({categoryName})
                    </Typography>
                  )}

                  {isOwner && (
                    <Tooltip title={t('editGroupModal.title') || t('common.edit')}>
                      <IconButton
                        size="small"
                        onClick={() => setOpenEditModal(true)}
                        sx={{
                          color: 'text.secondary',
                          bgcolor: 'action.hover',
                          p: 0.8,
                          flexShrink: 0,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            color: 'primary.main',
                            bgcolor: 'action.selected',
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                {/* Subtitle / Note */}
                <Typography
                  variant="body1"
                  color="text.secondary"
                  title={group.note || t('groups.noNote')}
                  sx={{
                    fontWeight: 500,
                    mb: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {group.note || t('groups.noNote')}
                </Typography>

                {/* Metadata items list with icons */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    gap: { xs: 1.5, sm: 2.5 },
                    rowGap: 1,
                    color: 'text.secondary',
                  }}
                >
                  {group.createdBy?.username && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                      <PersonIcon style={{ fontSize: 16 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.825rem' }}>
                        {t('groups.createdBy')}: @{group.createdBy.username}
                      </Typography>
                    </Box>
                  )}

                  {group.createdAt && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                      <CalendarTodayIcon style={{ fontSize: 15 }} />
                      <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.825rem' }}>
                        {t('groupDetail.createdAt')}: {formatDate(group.createdAt, i18n.language)}
                      </Typography>
                    </Box>
                  )}

                  {group.updatedAt && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                      <UpdateIcon style={{ fontSize: 16 }} />
                      <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.825rem' }}>
                        {t('groupDetail.updatedAt')}: {formatDate(group.updatedAt, i18n.language)}
                      </Typography>
                    </Box>
                  )}
                </Box>
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
