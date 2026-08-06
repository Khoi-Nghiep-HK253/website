import { useLoginStore } from './hooks/useLoginStore';
import { AlreadyLoggedInCard, LoginForm } from './components';

export default function LoginPage() {
  const {
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
  } = useLoginStore();

  if (isAuthenticated) {
    return <AlreadyLoggedInCard onGoToGroups={handleGoToGroups} />;
  }

  return (
    <LoginForm
      usernameOrEmail={usernameOrEmail}
      setUsernameOrEmail={setUsernameOrEmail}
      password={password}
      setPassword={setPassword}
      errorMsg={errorMsg}
      loginError={loginError}
      isLoggingIn={isLoggingIn}
      onSubmit={handleSubmit}
      onRegisterNowLink={handleRegisterNowLink}
    />
  );
}
