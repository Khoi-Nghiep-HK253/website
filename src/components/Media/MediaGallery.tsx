import React, { useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CollectionsIcon from '@mui/icons-material/Collections';
import { useTranslation } from 'react-i18next';
import type { MediaAttachmentResponse } from '@/services/mediaService';
import { Alert } from '@/components/Alert';

export interface MediaGalleryProps {
  attachments: MediaAttachmentResponse[];
  isPending?: boolean;
  error?: Error | null;
  currentUsername?: string;
  allowDelete?: boolean;
  onDeleteAttachment?: (id: number) => void;
  isDeleting?: boolean;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  attachments = [],
  isPending = false,
  error = null,
  currentUsername,
  allowDelete,
  onDeleteAttachment,
  isDeleting = false,
}) => {
  const { t } = useTranslation();

  const [selectedImage, setSelectedImage] = useState<MediaAttachmentResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaAttachmentResponse | null>(null);

  const attachmentCount = useMemo(() => attachments.length, [attachments]);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget || !onDeleteAttachment) return;
    onDeleteAttachment(deleteTarget.id);
    setDeleteTarget(null);
    if (selectedImage?.id === deleteTarget.id) {
      setSelectedImage(null);
    }
  }, [deleteTarget, onDeleteAttachment, selectedImage?.id]);

  const handleCloseLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  if (isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert intent="error" title={t('common.error')}>
        {error.message}
      </Alert>
    );
  }

  if (attachments.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          textAlign: 'center',
          borderRadius: 3,
          bgcolor: 'action.hover',
          borderColor: 'divider',
        }}
      >
        <CollectionsIcon sx={{ fontSize: 36, color: 'text.secondary', mb: 0.5, opacity: 0.6 }} />
        <Typography variant="body2" color="text.secondary">
          {t('media.noAttachments')}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 'bold', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <CollectionsIcon fontSize="small" color="primary" />
        {t('media.title')} ({attachmentCount})
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: 1.5,
        }}
      >
        {attachments.map((item) => {
          const isOwner = allowDelete !== undefined ? allowDelete : (!currentUsername || item.uploadedBy === currentUsername);

          return (
            <Paper
              key={item.id}
              variant="outlined"
              sx={{
                position: 'relative',
                borderRadius: 2.5,
                overflow: 'hidden',
                aspectRatio: '1',
                cursor: 'pointer',
                '&:hover .overlay': {
                  opacity: 1,
                },
              }}
              onClick={() => setSelectedImage(item)}
            >
              <Box
                component="img"
                src={item.fileUrl}
                alt={item.fileName || 'Attachment'}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Hover Overlay */}
              <Box
                className="overlay"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  opacity: 0,
                  transition: 'opacity 0.2s ease-in-out',
                }}
              >
                <Tooltip title={t('media.viewAttachment')}>
                  <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {isOwner && onDeleteAttachment && (
                  <Tooltip title={t('common.delete')}>
                    <IconButton
                      size="small"
                      color="error"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(item);
                      }}
                    >
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Paper>
          );
        })}
      </Box>

      {/* Lightbox Preview Dialog */}
      <Dialog
        open={Boolean(selectedImage)}
        onClose={handleCloseLightbox}
        maxWidth="md"
        slotProps={{
          paper: { sx: { bgcolor: 'background.paper', borderRadius: 3, overflow: 'hidden' } },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {selectedImage?.fileName || t('media.title')}
          </Typography>
          <IconButton size="small" onClick={handleCloseLightbox}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2, textAlign: 'center', bgcolor: 'black', display: 'flex', justifyContent: 'center' }}>
          {selectedImage && (
            <Box
              component="img"
              src={selectedImage.fileUrl}
              alt={selectedImage.fileName || 'Attachment'}
              sx={{
                maxHeight: '70vh',
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 1.5, justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            {selectedImage?.uploadedBy ? `${t('media.uploadedBy')}: ${selectedImage.uploadedBy}` : ''}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {selectedImage && (
              <Button
                component="a"
                href={selectedImage.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                startIcon={<DownloadIcon />}
              >
                Download
              </Button>
            )}
            <Button size="small" onClick={handleCloseLightbox}>
              {t('common.close')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={Boolean(deleteTarget)} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{t('media.deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{t('media.deleteConfirmMsg')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={isDeleting}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
