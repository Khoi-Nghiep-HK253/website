import { axiosClient, type ApiResponse } from '@/core/config/axiosClient';

export interface GroupResponse {
  id: number;
  name: string;
  category?: { id: number; name: string };
  categoryId?: number;
  categoryName?: string;
  note?: string;
  startDate?: string;
  endDate?: string;
  createdBy?: { id: number; username: string };
  defaultCurrencyId?: number;
  defaultCurrencyCode?: string;
  membersCount?: number;
  totalExpensesAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface CreateGroupPayload {
  name: string;
  categoryId?: number;
  note?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateGroupPayload {
  name?: string;
  categoryId?: number;
  note?: string;
  startDate?: string;
  endDate?: string;
}

export interface MemberUserInfo {
  id: number;
  username?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
}

export interface GroupMemberResponse {
  id: number;
  groupId?: number;
  userId?: number;
  user?: MemberUserInfo;
  username?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  role: 'OWNER' | 'MEMBER' | string;
  joinedAt?: string;
}

export const groupService = {
  // ── Groups Management ───────────────────────────────────────────────────
  async createGroup(payload: CreateGroupPayload): Promise<GroupResponse> {
    const response = await axiosClient.post<unknown, ApiResponse<GroupResponse>>('/groups', payload);
    return response.data;
  },

  async getMyGroups(page = 0, size = 20): Promise<PageResponse<GroupResponse>> {
    const response = await axiosClient.get<unknown, ApiResponse<PageResponse<GroupResponse>>>(
      `/groups?page=${page}&size=${size}`
    );
    return response.data;
  },

  async getGroupById(groupId: number): Promise<GroupResponse> {
    const response = await axiosClient.get<unknown, ApiResponse<GroupResponse>>(`/groups/${groupId}`);
    return response.data;
  },

  async updateGroup(groupId: number, payload: UpdateGroupPayload): Promise<GroupResponse> {
    const response = await axiosClient.put<unknown, ApiResponse<GroupResponse>>(`/groups/${groupId}`, payload);
    return response.data;
  },

  async deleteGroup(groupId: number): Promise<void> {
    await axiosClient.delete(`/groups/${groupId}`);
  },

  // ── Group Members ────────────────────────────────────────────────────────
  async getMembers(groupId: number): Promise<GroupMemberResponse[]> {
    const response = await axiosClient.get<unknown, ApiResponse<GroupMemberResponse[]>>(
      `/groups/${groupId}/members`
    );
    return response.data;
  },

  async addMember(groupId: number, userId: number): Promise<GroupMemberResponse> {
    const response = await axiosClient.post<unknown, ApiResponse<GroupMemberResponse>>(
      `/groups/${groupId}/members`,
      { userId }
    );
    return response.data;
  },

  async removeMember(groupId: number, memberId: number): Promise<void> {
    await axiosClient.delete(`/groups/${groupId}/members/${memberId}`);
  },
};
