import React, { useRef, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import { useTranslation } from 'react-i18next';
import { Alert } from '@/components/Alert';

export interface MediaUploaderProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
  error?: string | null;
  label?: string;
  buttonLabel?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUpload,
  isUploading = false,
  error = null,
  label,
  buttonLabel,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const activeError = error || localError;

  const processFile = useCallback(
    (file: File) => {
      setLocalError(null);

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setLocalError(t('media.fileTooLarge'));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setLocalError(t('media.invalidFileType'));
        return;
      }

      onUpload(file);
    },
    [onUpload, t]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handlePaperClick = useCallback(() => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isUploading]);

  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'text.secondary' }}>
          {label}
        </Typography>
      )}

      {activeError && (
        <Box sx={{ mb: 1.5 }}>
          <Alert intent="error" title={t('common.error')}>
            {activeError}
          </Alert>
        </Box>
      )}

      <Paper
        variant="outlined"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handlePaperClick}
        sx={{
          p: 3,
          textAlign: 'center',
          borderRadius: 3,
          cursor: isUploading ? 'not-allowed' : 'pointer',
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: isDragOver ? 'primary.main' : 'divider',
          bgcolor: isDragOver ? 'action.selected' : 'action.hover',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: isUploading ? 'divider' : 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          disabled={isUploading}
        />

        {isUploading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1 }}>
            <CircularProgress size={36} sx={{ mb: 1.5 }} />
            <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
              {t('media.uploading')}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {t('media.dragDropHint')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('media.supportedFormats')}
            </Typography>

            <Button
              variant="outlined"
              size="small"
              startIcon={<ImageIcon />}
              sx={{ mt: 1.5, borderRadius: 2 }}
            >
              {buttonLabel || t('media.selectFile')}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
