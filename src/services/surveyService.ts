import { axiosClient, type ApiResponse } from '@/core/config/axiosClient';

export interface SurveyRequest {
  userId?: number;
  email?: string;
  usageGoal?: string;
  groupSize?: string;
  primaryPainPoint?: string;
  rating?: number;
  feedbackText?: string;
}

export interface SurveyResponse {
  id: number;
  userId?: number;
  email?: string;
  usageGoal?: string;
  groupSize?: string;
  primaryPainPoint?: string;
  rating?: number;
  feedbackText?: string;
  createdAt: string;
}

export const surveyService = {
  async submitSurvey(payload: SurveyRequest): Promise<SurveyResponse> {
    const response = await axiosClient.post<unknown, ApiResponse<SurveyResponse>>(
      '/surveys',
      payload
    );
    return response.data;
  },
};
