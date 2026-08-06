import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/common';
import { useToast } from '@/hooks/common/useToast';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import { PATHS } from '@/router/routes';

export function useLoginStore() {
  const { t } = useTranslation();
  useDocumentTitle(t('nav.login'));

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { login, isAuthenticated, isLoggingIn, loginError } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => {
    return (location.state as { from?: { pathname: string } })?.from?.pathname || PATHS.GROUPS.LIST;
  }, [location.state]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg(null);

      if (!usernameOrEmail.trim()) {
        setErrorMsg(t('auth.valUsernameOrEmailRequired'));
        return;
      }
      if (!password) {
        setErrorMsg(t('auth.valPasswordRequired'));
        return;
      }

      login(
        { usernameOrEmail, password },
        () => {
          showSuccess(t('auth.loginSuccess'));
          navigate(from, { replace: true });
        },
        (err) => {
          const msg = err.message || t('auth.loginFailed');
          setErrorMsg(msg);
          showError(msg);
        }
      );
    },
    [usernameOrEmail, password, login, showSuccess, t, navigate, from, showError]
  );

  const handleGoToGroups = useCallback(() => {
    navigate(PATHS.GROUPS.LIST);
  }, [navigate]);

  const handleRegisterNowLink = useCallback(() => {
    navigate(PATHS.AUTH.REGISTER);
  }, [navigate]);

  return {
    t,
    usernameOrEmail,
    setUsernameOrEmail,
    password,
    setPassword,
    errorMsg,
    isAuthenticated,
    isLoggingIn,
    loginError,
    handleSubmit,
    handleGoToGroups,
    handleRegisterNowLink,
  };
}
