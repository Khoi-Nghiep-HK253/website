import { axiosClient, type ApiResponse } from '@/services/api/axiosClient';

export interface InvitationGroupInfo {
  id: number;
  name: string;
}

export interface InvitationUserInfo {
  id: number;
  username: string;
  firstname?: string;
  lastname?: string;
}

export interface InvitationResponse {
  id: number;
  group: InvitationGroupInfo;
  inviter?: InvitationUserInfo;
  invitee?: InvitationUserInfo;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'REVOKED' | 'EXPIRED';
  token?: string;
  message?: string;
  expiresAt?: string;
  createdAt?: string;
}

export interface AcceptInvitationResponse {
  invitation: InvitationResponse;
  membership?: { id: number; role: string };
}

export interface SendInvitationPayload {
  inviteeId: number;
  message?: string;
  expiresAt?: string;
}

export const invitationService = {
  /**
   * POST /api/groups/{groupId}/invitations
   */
  async sendInvitation(groupId: number, payload: SendInvitationPayload): Promise<InvitationResponse> {
    const response = await axiosClient.post<unknown, ApiResponse<InvitationResponse>>(
      `/groups/${groupId}/invitations`,
      payload
    );
    return response.data;
  },

  /**
   * GET /api/invitations/me
   */
  async getMyInvitations(status?: string): Promise<InvitationResponse[]> {
    const url = status ? `/invitations/me?status=${status}` : '/invitations/me';
    const response = await axiosClient.get<unknown, ApiResponse<InvitationResponse[]>>(url);
    return response.data;
  },

  /**
   * PUT /api/invitations/{id}/accept
   */
  async acceptInvitation(invitationId: number): Promise<AcceptInvitationResponse> {
    const response = await axiosClient.put<unknown, ApiResponse<AcceptInvitationResponse>>(
      `/invitations/${invitationId}/accept`
    );
    return response.data;
  },

  /**
   * PUT /api/invitations/{id}/decline
   */
  async declineInvitation(invitationId: number): Promise<InvitationResponse> {
    const response = await axiosClient.put<unknown, ApiResponse<InvitationResponse>>(
      `/invitations/${invitationId}/decline`
    );
    return response.data;
  },
};
