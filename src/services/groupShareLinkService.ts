import { axiosClient, type ApiResponse } from '@/services/api/axiosClient';

export interface ShareLinkResponse {
  id: number;
  groupId: number;
  groupName: string;
  inviteCode: string;
  createdByUsername: string;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt?: string;
}

export interface GroupPreviewResponse {
  groupId?: number;
  groupName?: string;
  categoryName?: string;
  categoryIcon?: string;
  note?: string;
  createdByUsername?: string;
  memberCount?: number;
  inviteCode: string;
  isValid: boolean;
  invalidReason?: string;
}

export interface CreateShareLinkPayload {
  expireHours?: number;
  maxUses?: number;
}

export const groupShareLinkService = {
  /**
   * POST /api/groups/{groupId}/share-links
   */
  async createShareLink(groupId: number, payload?: CreateShareLinkPayload): Promise<ShareLinkResponse> {
    const response = await axiosClient.post<unknown, ApiResponse<ShareLinkResponse>>(
      `/groups/${groupId}/share-links`,
      payload || {}
    );
    return response.data;
  },

  /**
   * GET /api/groups/{groupId}/share-links
   */
  async getGroupShareLinks(groupId: number): Promise<ShareLinkResponse[]> {
    const response = await axiosClient.get<unknown, ApiResponse<ShareLinkResponse[]>>(
      `/groups/${groupId}/share-links`
    );
    return response.data;
  },

  /**
   * DELETE /api/groups/{groupId}/share-links/{linkId}
   */
  async revokeShareLink(groupId: number, linkId: number): Promise<ShareLinkResponse> {
    const response = await axiosClient.delete<unknown, ApiResponse<ShareLinkResponse>>(
      `/groups/${groupId}/share-links/${linkId}`
    );
    return response.data;
  },

  /**
   * GET /api/groups/join-via-link/preview/{inviteCode} (Public)
   */
  async getGroupPreview(inviteCode: string): Promise<GroupPreviewResponse> {
    const response = await axiosClient.get<unknown, ApiResponse<GroupPreviewResponse>>(
      `/groups/join-via-link/preview/${inviteCode}`
    );
    return response.data;
  },

  /**
   * POST /api/groups/join-via-link/{inviteCode}
   */
  async joinGroupViaLink(inviteCode: string): Promise<ShareLinkResponse> {
    const response = await axiosClient.post<unknown, ApiResponse<ShareLinkResponse>>(
      `/groups/join-via-link/${inviteCode}`
    );
    return response.data;
  },
};
