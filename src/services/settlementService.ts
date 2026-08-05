import { axiosClient, type ApiResponse } from '@/services/api/axiosClient';
import type { PageResponse } from '@/services/groupService';
import type { DebtUserInfo } from '@/services/debtService';

export interface CreateSettlementPayload {
  debtId: number;
  amount: number;
  method?: 'CASH' | 'BANK_TRANSFER' | string;
  note?: string;
  paidAt?: string;
}

export interface SettlementSummaryResponse {
  id: number;
  groupId?: number;
  debtId?: number;
  fromUser?: DebtUserInfo;
  fromUserId?: number;
  fromUsername?: string;
  toUser?: DebtUserInfo;
  toUserId?: number;
  toUsername?: string;
  amount: number;
  method?: string;
  note?: string;
  paidAt?: string;
  createdAt?: string;
  currencyCode?: string;
}

export const settlementService = {
  async createSettlement(groupId: number, payload: CreateSettlementPayload): Promise<SettlementSummaryResponse> {
    const response = await axiosClient.post<unknown, ApiResponse<SettlementSummaryResponse>>(
      `/groups/${groupId}/settlements`,
      payload
    );
    return response.data;
  },

  async getGroupSettlements(groupId: number, page = 0, size = 20): Promise<PageResponse<SettlementSummaryResponse>> {
    const response = await axiosClient.get<unknown, ApiResponse<PageResponse<SettlementSummaryResponse>>>(
      `/groups/${groupId}/settlements?page=${page}&size=${size}`
    );
    return response.data;
  },
};
