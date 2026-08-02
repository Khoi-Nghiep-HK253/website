import { axiosClient, type ApiResponse } from '@/services/api/axiosClient';
import type { PageResponse } from '@/services/groupService';

export interface ExpensePayerPayload {
  userId: number;
  amount: number;
}

export interface ExpenseSharePayload {
  userId: number;
  amount?: number;
  percentage?: number;
  ratio?: number;
  adjustment?: number;
}

export interface CreateExpensePayload {
  description: string;
  totalAmount: number;
  currencyId: number;
  expenseDate: string;
  splitType?: 'EQUAL' | 'EXACT' | 'PERCENTAGE' | 'SHARES' | 'ADJUSTMENT' | string;
  payers: ExpensePayerPayload[];
  shares: ExpenseSharePayload[];
}

export interface ExpenseSummaryResponse {
  id: number;
  groupId?: number;
  description: string;
  totalAmount: number;
  currency?: { id?: number; code?: string; acronym?: string; symbol?: string };
  currencyCode?: string;
  category?: { id?: number; name?: string };
  categoryName?: string;
  expenseDate?: string;
  splitType?: string;
  createdByName?: string;
  payerCount?: number;
  shareCount?: number;
  createdAt?: string;
}

export interface ExpenseResponse extends ExpenseSummaryResponse {
  splitType?: string;
  payers?: Array<{ userId: number; username?: string; amount: number }>;
  shares?: Array<{ userId: number; username?: string; amount: number }>;
}

export const expenseService = {
  async createExpense(groupId: number, payload: CreateExpensePayload): Promise<ExpenseResponse> {
    const response = await axiosClient.post<unknown, ApiResponse<ExpenseResponse>>(
      `/groups/${groupId}/expenses`,
      payload
    );
    return response.data;
  },

  async getGroupExpenses(groupId: number, page = 0, size = 20): Promise<PageResponse<ExpenseSummaryResponse>> {
    const response = await axiosClient.get<unknown, ApiResponse<PageResponse<ExpenseSummaryResponse>>>(
      `/groups/${groupId}/expenses?page=${page}&size=${size}`
    );
    return response.data;
  },

  async getExpenseById(groupId: number, expenseId: number): Promise<ExpenseResponse> {
    const response = await axiosClient.get<unknown, ApiResponse<ExpenseResponse>>(
      `/groups/${groupId}/expenses/${expenseId}`
    );
    return response.data;
  },

  async deleteExpense(groupId: number, expenseId: number): Promise<void> {
    await axiosClient.delete(`/groups/${groupId}/expenses/${expenseId}`);
  },
};
