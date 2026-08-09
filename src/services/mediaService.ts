import { axiosClient, type ApiResponse } from '@/core/config/axiosClient';

export type MediaEntityType = 'EXPENSE' | 'SETTLEMENT' | 'USER_AVATAR' | 'GROUP_AVATAR' | 'GROUP_COVER';

export interface MediaAttachmentResponse {
  id: number;
  fileUrl: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  entityType: MediaEntityType;
  entityId: number;
  uploadedBy?: string;
  createdAt?: string;
}

export const mediaService = {
  /**
   * Upload a file and attach it to a domain entity (Expense, Settlement, Avatar, etc.)
   */
  async uploadMedia(
    file: File,
    entityType: MediaEntityType,
    entityId: number
  ): Promise<MediaAttachmentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', entityType);
    formData.append('entityId', entityId.toString());

    const response = await axiosClient.post<unknown, ApiResponse<MediaAttachmentResponse>>(
      '/media/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Fetch all media attachments linked to a specific entity.
   */
  async getAttachments(
    entityType: MediaEntityType,
    entityId: number
  ): Promise<MediaAttachmentResponse[]> {
    const response = await axiosClient.get<unknown, ApiResponse<MediaAttachmentResponse[]>>(
      `/media/attachments?entityType=${entityType}&entityId=${entityId}`
    );
    return response.data;
  },

  /**
   * Delete a media attachment by ID (only allowed for uploader).
   */
  async deleteAttachment(id: number): Promise<void> {
    await axiosClient.delete(`/media/${id}`);
  },
};
