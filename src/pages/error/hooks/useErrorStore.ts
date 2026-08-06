import { useMemo, useCallback } from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import { PATHS } from '@/router/routes';

export function useErrorStore() {
  const { t } = useTranslation();
  useDocumentTitle(t('common.error'));
  const error = useRouteError();
  const navigate = useNavigate();

  const { errorMessage, statusCode } = useMemo(() => {
    let msg = t('errorPages.errorSub');
    let code = t('common.error');

    if (isRouteErrorResponse(error)) {
      code = `Error ${error.status}`;
      msg = error.statusText || error.data?.message || msg;
    } else if (error instanceof Error) {
      msg = error.message;
    }

    return { errorMessage: msg, statusCode: code };
  }, [error, t]);

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  const handleGoHome = useCallback(() => {
    navigate(PATHS.HOME);
  }, [navigate]);

  return {
    t,
    errorMessage,
    statusCode,
    handleReload,
    handleGoHome,
  };
}
