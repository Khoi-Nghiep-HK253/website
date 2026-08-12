import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  mediaService,
  type MediaEntityType,
  type MediaAttachmentResponse,
} from '@/services/mediaService';

export const MEDIA_QUERY_KEYS = {
  attachments: (entityType: MediaEntityType, entityId: number) =>
    ['media', 'attachments', entityType, entityId] as const,
};

export function useEntityAttachments(entityType: MediaEntityType, entityId: number | null | undefined) {
  return useQuery<MediaAttachmentResponse[], Error>({
    queryKey: MEDIA_QUERY_KEYS.attachments(entityType, entityId || 0),
    queryFn: () => mediaService.getAttachments(entityType, entityId!),
    enabled: Number.isInteger(entityId) && (entityId ?? 0) > 0,
  });
}

export function useUploadMediaMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    MediaAttachmentResponse,
    Error,
    { file: File; entityType: MediaEntityType; entityId: number }
  >({
    mutationFn: ({ file, entityType, entityId }) =>
      mediaService.uploadMedia(file, entityType, entityId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: MEDIA_QUERY_KEYS.attachments(data.entityType, data.entityId),
      });
    },
  });
}

export function useDeleteMediaMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { id: number; entityType: MediaEntityType; entityId: number }
  >({
    mutationFn: ({ id }) => mediaService.deleteAttachment(id),
    onSuccess: (_, { entityType, entityId }) => {
      queryClient.invalidateQueries({
        queryKey: MEDIA_QUERY_KEYS.attachments(entityType, entityId),
      });
    },
  });
}

export function useSelectMediaMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    MediaAttachmentResponse,
    Error,
    { id: number; entityType: MediaEntityType; entityId: number }
  >({
    mutationFn: ({ id }) => mediaService.selectMedia(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: MEDIA_QUERY_KEYS.attachments(data.entityType, data.entityId),
      });
    },
  });
}

