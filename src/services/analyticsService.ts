import { axiosClient, type ApiResponse } from '@/core/config/axiosClient';
import type { ExpenseResponse } from '@/services/expenseService';

export interface CategoryExpenseStatResponse {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  totalAmount: number;
  percentage: number;
  expenseCount: number;
}

export interface TimePeriodStatResponse {
  periodLabel: string;
  totalAmount: number;
}

export interface AnalyticsSummaryResponse {
  totalPersonalShare: number;
  totalGroupExpense: number;
  totalOwedToUser: number;
  totalUserOwes: number;
  categoryStats: CategoryExpenseStatResponse[];
  timeTrendStats: TimePeriodStatResponse[];
  topExpenses: ExpenseResponse[];
}

export interface GetAnalyticsParams {
  groupId?: number;
  startDate?: string;
  endDate?: string;
  groupBy?: 'DAY' | 'WEEK' | 'MONTH';
}

export const analyticsService = {
  async getAnalyticsSummary(params?: GetAnalyticsParams): Promise<AnalyticsSummaryResponse> {
    const response = await axiosClient.get<unknown, ApiResponse<AnalyticsSummaryResponse>>(
      '/analytics/summary',
      { params }
    );
    return response.data;
  },
};
