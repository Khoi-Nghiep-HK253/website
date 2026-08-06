import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import { PATHS } from '@/router/routes';

export function useNotFoundStore() {
  const { t } = useTranslation();
  useDocumentTitle(`404 — ${t('errorPages.notFoundTitle')}`);
  const navigate = useNavigate();

  const handleGoHome = useCallback(() => {
    navigate(PATHS.HOME);
  }, [navigate]);

  return {
    t,
    handleGoHome,
  };
}
