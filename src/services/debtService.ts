import { axiosClient, type ApiResponse } from '@/services/api/axiosClient';

export interface DebtUserInfo {
  id: number;
  username?: string;
  fullname?: string;
}

export interface DebtPairSummary {
  fromUser?: DebtUserInfo;
  fromUserId?: number;
  fromUsername?: string;
  toUser?: DebtUserInfo;
  toUserId?: number;
  toUsername?: string;
  totalOwed: number;
  currency?: { code?: string; acronym?: string };
  currencyCode?: string;
}

export interface DebtGroupSummaryResponse {
  groupId?: number;
  pairs: DebtPairSummary[];
}

export interface DebtItemResponse {
  id: number;
  groupId?: number;
  expense?: { id: number; description?: string };
  expenseId?: number;
  expenseDescription?: string;
  fromUser?: DebtUserInfo;
  fromUserId?: number;
  fromUsername?: string;
  toUser?: DebtUserInfo;
  toUserId?: number;
  toUsername?: string;
  amount: number;
  currencyCode?: string;
  status: 'PENDING' | 'SETTLED' | string;
  createdAt?: string;
}

export interface DebtSubItemResponse {
  id: number;
  amount: number;
  expenseId?: number;
}

export interface IOweGroupResponse {
  toUser?: DebtUserInfo;
  totalAmount: number;
  debts: DebtSubItemResponse[];
}

export interface OwedToMeGroupResponse {
  fromUser?: DebtUserInfo;
  totalAmount: number;
  debts: DebtSubItemResponse[];
}

export interface MyDebtsResponse {
  iOwe: IOweGroupResponse[];
  owedToMe: OwedToMeGroupResponse[];
}

export const debtService = {
  async getGroupDebts(groupId: number, status?: string): Promise<DebtItemResponse[]> {
    const params = status ? `?status=${status}` : '';
    const response = await axiosClient.get<unknown, ApiResponse<DebtItemResponse[]>>(
      `/groups/${groupId}/debts${params}`
    );
    return response.data;
  },

  async getGroupDebtSummary(groupId: number): Promise<DebtGroupSummaryResponse> {
    const response = await axiosClient.get<unknown, ApiResponse<DebtGroupSummaryResponse>>(
      `/groups/${groupId}/debts/summary`
    );
    return response.data;
  },

  async getMyDebts(groupId: number): Promise<MyDebtsResponse> {
    const response = await axiosClient.get<unknown, ApiResponse<MyDebtsResponse>>(
      `/groups/${groupId}/debts/me`
    );
    return response.data;
  },
};
