import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  expenseService,
  type ExpenseResponse,
  type ExpenseSummaryResponse,
  type CreateExpensePayload,
} from '@/services/expenseService';
import type { PageResponse } from '@/services/groupService';
import { GROUP_QUERY_KEYS } from './useGroupQuery';
import { DEBT_QUERY_KEYS } from './useDebtQuery';

export const EXPENSE_QUERY_KEYS = {
  expenses: (groupId: number) => ['groups', groupId, 'expenses'] as const,
  expenseDetail: (groupId: number, expenseId: number) => ['groups', groupId, 'expenses', expenseId] as const,
};

export function useGroupExpenses(groupId: number, page = 0, size = 20) {
  return useQuery<PageResponse<ExpenseSummaryResponse>, Error>({
    queryKey: [...EXPENSE_QUERY_KEYS.expenses(groupId), page, size],
    queryFn: () => expenseService.getGroupExpenses(groupId, page, size),
    enabled: Number.isInteger(groupId) && groupId > 0,
  });
}

export function useExpenseDetail(groupId: number, expenseId: number | null) {
  return useQuery<ExpenseResponse, Error>({
    queryKey: EXPENSE_QUERY_KEYS.expenseDetail(groupId, expenseId || 0),
    queryFn: () => expenseService.getExpenseById(groupId, expenseId!),
    enabled: Number.isInteger(groupId) && groupId > 0 && Number.isInteger(expenseId) && (expenseId ?? 0) > 0,
  });
}

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation<ExpenseResponse, Error, { groupId: number; payload: CreateExpensePayload }>({
    mutationFn: ({ groupId, payload }) => expenseService.createExpense(groupId, payload),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.expenses(groupId) });
      queryClient.invalidateQueries({ queryKey: DEBT_QUERY_KEYS.debtsSummary(groupId) });
      queryClient.invalidateQueries({ queryKey: DEBT_QUERY_KEYS.myDebts(groupId) });
      queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.groupDetail(groupId) });
    },
  });
}

export function useDeleteExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { groupId: number; expenseId: number }>({
    mutationFn: ({ groupId, expenseId }) => expenseService.deleteExpense(groupId, expenseId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.expenses(groupId) });
      queryClient.invalidateQueries({ queryKey: DEBT_QUERY_KEYS.debtsSummary(groupId) });
      queryClient.invalidateQueries({ queryKey: DEBT_QUERY_KEYS.myDebts(groupId) });
      queryClient.invalidateQueries({ queryKey: GROUP_QUERY_KEYS.groupDetail(groupId) });
    },
  });
}
