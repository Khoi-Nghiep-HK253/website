import React, { useState, useCallback } from 'react';
import { MediaUploader } from '@/components/Media/MediaUploader';
import { useUploadMediaMutation } from '@/hooks/query/useMediaQuery';
import type { MediaEntityType, MediaAttachmentResponse } from '@/services/mediaService';
import { useTranslation } from 'react-i18next';

export interface MediaUploaderContainerProps {
  entityType: MediaEntityType;
  entityId: number;
  onUploadSuccess?: (attachment: MediaAttachmentResponse) => void;
  label?: string;
  buttonLabel?: string;
}

export const MediaUploaderContainer: React.FC<MediaUploaderContainerProps> = ({
  entityType,
  entityId,
  onUploadSuccess,
  label,
  buttonLabel,
}) => {
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const uploadMutation = useUploadMediaMutation();

  const handleUpload = useCallback(
    (file: File) => {
      setErrorMsg(null);
      uploadMutation.mutate(
        { file, entityType, entityId },
        {
          onSuccess: (data) => {
            if (onUploadSuccess) {
              onUploadSuccess(data);
            }
          },
          onError: (err) => {
            setErrorMsg(err.message || t('media.uploadError'));
          },
        }
      );
    },
    [entityId, entityType, onUploadSuccess, t, uploadMutation]
  );

  return (
    <MediaUploader
      onUpload={handleUpload}
      isUploading={uploadMutation.isPending}
      error={errorMsg}
      label={label}
      buttonLabel={buttonLabel}
    />
  );
};
