import { useMutation } from '@tanstack/react-query';
import {
  surveyService,
  type SurveyRequest,
  type SurveyResponse,
} from '@/services/surveyService';

export const SURVEY_QUERY_KEYS = {
  surveys: ['surveys'] as const,
};

export function useSubmitSurveyMutation() {
  return useMutation<SurveyResponse, Error, SurveyRequest>({
    mutationFn: (payload: SurveyRequest) => surveyService.submitSurvey(payload),
  });
}
