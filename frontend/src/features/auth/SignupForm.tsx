const SignupForm = ({
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  onSubmit,
  loading,
  error,
}: {
  email: string;
  setEmail: (email: string) => void;
  username: string;
  setUsername: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={onSubmit} disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SignupForm;
