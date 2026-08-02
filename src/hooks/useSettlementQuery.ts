import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  settlementService,
  type SettlementSummaryResponse,
  type CreateSettlementPayload,
} from '@/services/settlementService';
import type { PageResponse } from '@/services/groupService';
import { DEBT_QUERY_KEYS } from './useDebtQuery';

export const SETTLEMENT_QUERY_KEYS = {
  settlements: (groupId: number) => ['groups', groupId, 'settlements'] as const,
};

export function useGroupSettlements(groupId: number, page = 0, size = 20) {
  return useQuery<PageResponse<SettlementSummaryResponse>, Error>({
    queryKey: [...SETTLEMENT_QUERY_KEYS.settlements(groupId), page, size],
    queryFn: () => settlementService.getGroupSettlements(groupId, page, size),
    enabled: Number.isInteger(groupId) && groupId > 0,
  });
}

export function useCreateSettlementMutation() {
  const queryClient = useQueryClient();

  return useMutation<SettlementSummaryResponse, Error, { groupId: number; payload: CreateSettlementPayload }>({
    mutationFn: ({ groupId, payload }) => settlementService.createSettlement(groupId, payload),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: SETTLEMENT_QUERY_KEYS.settlements(groupId) });
      queryClient.invalidateQueries({ queryKey: DEBT_QUERY_KEYS.debtsSummary(groupId) });
      queryClient.invalidateQueries({ queryKey: DEBT_QUERY_KEYS.myDebts(groupId) });
    },
  });
}
