import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen bg-neutral-100 px-4 py-8 dark:bg-neutral-900">
      <div className="mx-auto grid min-h-[80vh] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2 dark:bg-neutral-800">
        <div className="flex items-center justify-center bg-neutral-50 p-8 md:p-12 dark:bg-neutral-800">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                life console
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
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

        <div className="flex items-center justify-center bg-cyan-400 p-8 text-white md:p-12 dark:bg-cyan-600">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="text-4xl font-bold tracking-tight">Sign Up</h2>
              <p className="text-sm text-rose-100 dark:text-rose-200">
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
