import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  groupShareLinkService,
  type ShareLinkResponse,
  type GroupPreviewResponse,
  type CreateShareLinkPayload,
} from '@/services/groupShareLinkService';

export const SHARE_LINK_QUERY_KEYS = {
  groupShareLinks: (groupId: number) => ['groups', groupId, 'share-links'] as const,
  groupPreview: (inviteCode: string) => ['groups', 'share-link-preview', inviteCode] as const,
};

export function useGroupShareLinks(groupId: number, enabled = true) {
  return useQuery<ShareLinkResponse[], Error>({
    queryKey: SHARE_LINK_QUERY_KEYS.groupShareLinks(groupId),
    queryFn: () => groupShareLinkService.getGroupShareLinks(groupId),
    enabled: Boolean(groupId) && enabled,
  });
}

export function useGroupPreview(inviteCode: string) {
  return useQuery<GroupPreviewResponse, Error>({
    queryKey: SHARE_LINK_QUERY_KEYS.groupPreview(inviteCode),
    queryFn: () => groupShareLinkService.getGroupPreview(inviteCode),
    enabled: Boolean(inviteCode),
  });
}

export function useCreateShareLinkMutation() {
  const queryClient = useQueryClient();

  return useMutation<ShareLinkResponse, Error, { groupId: number; payload?: CreateShareLinkPayload }>({
    mutationFn: ({ groupId, payload }) => groupShareLinkService.createShareLink(groupId, payload),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: SHARE_LINK_QUERY_KEYS.groupShareLinks(groupId) });
    },
  });
}

export function useRevokeShareLinkMutation() {
  const queryClient = useQueryClient();

  return useMutation<ShareLinkResponse, Error, { groupId: number; linkId: number }>({
    mutationFn: ({ groupId, linkId }) => groupShareLinkService.revokeShareLink(groupId, linkId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: SHARE_LINK_QUERY_KEYS.groupShareLinks(groupId) });
    },
  });
}

export function useJoinGroupViaLinkMutation() {
  const queryClient = useQueryClient();

  return useMutation<ShareLinkResponse, Error, string>({
    mutationFn: (inviteCode: string) => groupShareLinkService.joinGroupViaLink(inviteCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}
