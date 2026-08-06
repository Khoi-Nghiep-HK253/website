import { useRegisterStore } from './hooks/useRegisterStore';
import { AlreadyLoggedInCard, RegisterForm } from './components';

export default function RegisterPage() {
  const {
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
  } = useRegisterStore();

  if (isAuthenticated) {
    return <AlreadyLoggedInCard onGoToGroups={handleGoToGroups} />;
  }

  return (
    <RegisterForm
      username={username}
      setUsername={setUsername}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      firstname={firstname}
      setFirstname={setFirstname}
      lastname={lastname}
      setLastname={setLastname}
      phone={phone}
      setPhone={setPhone}
      errorMsg={errorMsg}
      registerError={registerError}
      isRegistering={isRegistering}
      onSubmit={handleSubmit}
      onLoginNowLink={handleLoginNowLink}
    />
  );
}
