import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/common';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import { PATHS } from '@/router/routes';

export function useHomeStore() {
  const { t } = useTranslation();
  useDocumentTitle(t('common.appName') + ' — ' + t('common.appTagline'));
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleNavigateGroups = useCallback(() => {
    navigate(PATHS.GROUPS.LIST);
  }, [navigate]);

  const handleNavigateRegister = useCallback(() => {
    navigate(PATHS.AUTH.REGISTER);
  }, [navigate]);

  const workflowSteps = useMemo(
    () => [
      { step: '01', title: t('home.step1Title'), desc: t('home.step1Desc') },
      { step: '02', title: t('home.step2Title'), desc: t('home.step2Desc') },
      { step: '03', title: t('home.step3Title'), desc: t('home.step3Desc') },
      { step: '04', title: t('home.step4Title'), desc: t('home.step4Desc') },
      { step: '05', title: t('home.step5Title'), desc: t('home.step5Desc') },
    ],
    [t]
  );

  return {
    t,
    isAuthenticated,
    user,
    workflowSteps,
    handleNavigateGroups,
    handleNavigateRegister,
  };
}
