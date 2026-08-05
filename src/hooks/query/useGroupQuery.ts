import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  groupService,
  type GroupResponse,
  type CreateGroupPayload,
  type UpdateGroupPayload,
  type GroupMemberResponse,
  type PageResponse,
} from '@/services/groupService';

export const GROUP_QUERY_KEYS = {
  myGroups: ['groups', 'my'] as const,
  groupDetail: (id: number) => ['groups', 'detail', id] as const,
  members: (groupId: number) => ['groups', groupId, 'members'] as const,
};

// ── Groups Hooks ─────────────────────────────────────────────────────────────
export function useMyGroups(page = 0, size = 20) {
  return useQuery<PageResponse<GroupResponse>, Error>({
    queryKey: [...GROUP_QUERY_KEYS.myGroups, page, size],
    queryFn: () => groupService.getMyGroups(page, size),
    staleTime: 1000 * 60 * 2,
  });
}

export function useGroupDetail(groupId: number) {
  return useQuery<GroupResponse, Error>({
    queryKey: GROUP_QUERY_KEYS.groupDetail(groupId),
    queryFn: () => groupService.getGroupById(groupId),
    enabled: Number.isInteger(groupId) && groupId > 0,
  });
}

export function useCreateGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation<GroupResponse, Error, CreateGroupPayload>({
    mutationFn: (payload: CreateGroupPayload) => groupService.createGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.myGroups });
    },
  });
}

export function useUpdateGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation<GroupResponse, Error, { groupId: number; payload: UpdateGroupPayload }>({
    mutationFn: ({ groupId, payload }) => groupService.updateGroup(groupId, payload),
    onSuccess: (updatedGroup, { groupId }) => {
      queryClient.setQueryData(GROUP_QUERY_KEYS.groupDetail(groupId), updatedGroup);
      queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.myGroups });
    },
  });
}

export function useDeleteGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (groupId: number) => groupService.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.myGroups });
    },
  });
}

// ── Group Members Hooks ──────────────────────────────────────────────────────
export function useGroupMembers(groupId: number) {
  return useQuery<GroupMemberResponse[], Error>({
    queryKey: GROUP_QUERY_KEYS.members(groupId),
    queryFn: () => groupService.getMembers(groupId),
    enabled: Number.isInteger(groupId) && groupId > 0,
  });
}

export function useAddMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation<GroupMemberResponse, Error, { groupId: number; userId: number }>({
    mutationFn: ({ groupId, userId }) => groupService.addMember(groupId, userId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.members(groupId) });
      queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.groupDetail(groupId) });
    },
  });
}

export function useRemoveMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { groupId: number; memberId: number }>({
    mutationFn: ({ groupId, memberId }) => groupService.removeMember(groupId, memberId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.members(groupId) });
      queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.groupDetail(groupId) });
    },
  });
}
