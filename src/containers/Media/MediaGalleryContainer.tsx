import React, { useCallback } from 'react';
import { MediaGallery } from '@/components/Media/MediaGallery';
import { useEntityAttachments, useDeleteMediaMutation, useSelectMediaMutation } from '@/hooks/query/useMediaQuery';
import type { MediaEntityType } from '@/services/mediaService';

export interface MediaGalleryContainerProps {
  entityType: MediaEntityType;
  entityId: number;
  currentUsername?: string;
  allowDelete?: boolean;
}

export const MediaGalleryContainer: React.FC<MediaGalleryContainerProps> = ({
  entityType,
  entityId,
  currentUsername,
  allowDelete,
}) => {
  const { data: attachments = [], isPending, error } = useEntityAttachments(entityType, entityId);
  const deleteMutation = useDeleteMediaMutation();
  const selectMutation = useSelectMediaMutation();

  const handleDeleteAttachment = useCallback(
    (id: number) => {
      deleteMutation.mutate({ id, entityType, entityId });
    },
    [deleteMutation, entityId, entityType]
  );

  const handleSelectAttachment = useCallback(
    (id: number) => {
      selectMutation.mutate({ id, entityType, entityId });
    },
    [selectMutation, entityId, entityType]
  );

  const isAvatarOrCover = ['USER_AVATAR', 'GROUP_AVATAR', 'GROUP_COVER', 'USER_COVER'].includes(entityType);

  return (
    <MediaGallery
      attachments={attachments}
      isPending={isPending}
      error={error}
      currentUsername={currentUsername}
      allowDelete={allowDelete}
      onDeleteAttachment={handleDeleteAttachment}
      isDeleting={deleteMutation.isPending}
      onSelectAttachment={isAvatarOrCover ? handleSelectAttachment : undefined}
      isSelecting={selectMutation.isPending}
    />
  );
};

