import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import { useAuth } from "../hooks/useAuth";

type SignupFormValues = {
  email: string;
  username: string;
  password: string;
};

type LoginFormValues = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);

  const handleLogin = async (data: LoginFormValues) => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      await login(data);
      navigate("/");
    } catch (err) {
      setLoginError((err as Error).message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormValues) => {
    setSignupLoading(true);
    setSignupError(null);

    try {
      await signup(data);
      navigate("/");
    } catch (err) {
      setSignupError((err as Error).message);
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto grid min-h-[80vh] max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl md:grid-cols-2">
        <div className="flex items-center justify-center bg-muted/40 p-8 md:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-5xl font-bold tracking-tight">
                life console
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to access features
              </p>
            </div>

            <LoginForm
              onSubmit={handleLogin}
              loading={loginLoading}
              error={loginError}
            />
          </div>
        </div>

        <div className="flex items-center justify-center bg-primary p-8 text-primary-foreground md:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="text-4xl font-bold tracking-tight">Sign Up</h2>
              <p className="text-sm text-primary-foreground/80">
                Create an account to get started
              </p>
            </div>

            <SignupForm
              onSubmit={handleSignup}
              loading={signupLoading}
              error={signupError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
