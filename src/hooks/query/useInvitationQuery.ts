import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  invitationService,
  type InvitationResponse,
  type AcceptInvitationResponse,
  type SendInvitationPayload,
} from '@/services/invitationService';

export const INVITATION_QUERY_KEYS = {
  myInvitations: (status?: string) => ['invitations', 'me', status || 'ALL'] as const,
};

export function useMyInvitations(status?: string) {
  return useQuery<InvitationResponse[], Error>({
    queryKey: INVITATION_QUERY_KEYS.myInvitations(status),
    queryFn: () => invitationService.getMyInvitations(status),
  });
}

export function useSendInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation<InvitationResponse, Error, { groupId: number; payload: SendInvitationPayload }>({
    mutationFn: ({ groupId, payload }) => invitationService.sendInvitation(groupId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
}

export function useAcceptInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation<AcceptInvitationResponse, Error, number>({
    mutationFn: (invitationId: number) => invitationService.acceptInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useDeclineInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation<InvitationResponse, Error, number>({
    mutationFn: (invitationId: number) => invitationService.declineInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
}

export function useInvitationByToken(token?: string) {
  return useQuery<InvitationResponse, Error>({
    queryKey: ['invitation', 'token', token],
    queryFn: () => invitationService.getInvitationByToken(token!),
    enabled: Boolean(token),
  });
}

export function useAcceptInvitationByTokenMutation() {
  const queryClient = useQueryClient();

  return useMutation<AcceptInvitationResponse, Error, string>({
    mutationFn: (token: string) => invitationService.acceptInvitationByToken(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}
