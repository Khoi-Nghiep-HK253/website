import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/common/useAuth';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import { PATHS } from '@/router/routes';

export function useRegisterStore() {
  const { t } = useTranslation();
  useDocumentTitle(t('nav.register'));

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, isAuthenticated, isRegistering, registerError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg(null);

      if (!username.trim()) {
        setErrorMsg(t('auth.valUsernameRequired'));
        return;
      }

      if (!email.trim()) {
        setErrorMsg(t('auth.valEmailRequired'));
        return;
      }

      if (!password) {
        setErrorMsg(t('auth.valPasswordRequired'));
        return;
      }

      if (password.length < 6) {
        setErrorMsg(t('auth.valPasswordMinLength'));
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg(t('auth.valPasswordMismatch'));
        return;
      }

      register(
        {
          username,
          email,
          password,
          firstname: firstname.trim() || undefined,
          lastname: lastname.trim() || undefined,
          phone: phone.trim() || undefined,
        },
        () => {
          navigate(PATHS.GROUPS.LIST, { replace: true });
        },
        (err) => {
          setErrorMsg(err.message || t('auth.regFailed'));
        }
      );
    },
    [username, email, password, confirmPassword, firstname, lastname, phone, register, navigate, t]
  );

  const handleGoToGroups = useCallback(() => {
    navigate(PATHS.GROUPS.LIST);
  }, [navigate]);

  const handleLoginNowLink = useCallback(() => {
    navigate(PATHS.AUTH.LOGIN);
  }, [navigate]);

  return {
    t,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    firstname,
    setFirstname,
    lastname,
    setLastname,
    phone,
    setPhone,
    errorMsg,
    isAuthenticated,
    isRegistering,
    registerError,
    handleSubmit,
    handleGoToGroups,
    handleLoginNowLink,
  };
}
