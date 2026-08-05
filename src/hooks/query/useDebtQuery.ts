import { useQuery } from '@tanstack/react-query';
import {
  debtService,
  type DebtGroupSummaryResponse,
  type MyDebtsResponse,
} from '@/services/debtService';

export const DEBT_QUERY_KEYS = {
  debtsSummary: (groupId: number) => ['groups', groupId, 'debts', 'summary'] as const,
  myDebts: (groupId: number) => ['groups', groupId, 'debts', 'me'] as const,
};

export function useGroupDebtSummary(groupId: number) {
  return useQuery<DebtGroupSummaryResponse, Error>({
    queryKey: DEBT_QUERY_KEYS.debtsSummary(groupId),
    queryFn: () => debtService.getGroupDebtSummary(groupId),
    enabled: Number.isInteger(groupId) && groupId > 0,
  });
}

export function useMyDebts(groupId: number) {
  return useQuery<MyDebtsResponse, Error>({
    queryKey: DEBT_QUERY_KEYS.myDebts(groupId),
    queryFn: () => debtService.getMyDebts(groupId),
    enabled: Number.isInteger(groupId) && groupId > 0,
  });
}
