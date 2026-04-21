import { useState } from "react";
import LoginForm from "../features/auth/LoginForm";
import SignupForm from "../features/auth/SignupForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login({ username: loginUsername, password: loginPassword });
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError(null);

    try {
      await signup({
        email: signupEmail,
        username: signupUsername,
        password: signupPassword,
      });
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LoginForm
        username={loginUsername}
        setUsername={setLoginUsername}
        password={loginPassword}
        setPassword={setLoginPassword}
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
      <SignupForm
        email={signupEmail}
        setEmail={setSignupEmail}
        username={signupUsername}
        setUsername={setSignupUsername}
        password={signupPassword}
        setPassword={setSignupPassword}
        onSubmit={handleSignup}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default LoginPage;
