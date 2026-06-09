import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

const FOUNDER_USERNAME = "founder";
const FOUNDER_PASSWORD = "oasis2026";

export function FounderAccessGate({ children }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthorised, setIsAuthorised] = useState(
    sessionStorage.getItem("oasis_founder_access") === "true",
  );
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      username.trim() === FOUNDER_USERNAME &&
      password === FOUNDER_PASSWORD
    ) {
      sessionStorage.setItem("oasis_founder_access", "true");
      setIsAuthorised(true);
      setError("");
      return;
    }

    setError("Invalid founder access details.");
  }

  if (isAuthorised) {
    return <>{children}</>;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #eaf1f7 0%, #f8fbfd 54%, #ffffff 100%)",
        padding: 48,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          margin: "120px auto",
          padding: 32,
          borderRadius: 24,
          border: "1px solid rgba(14,118,168,0.16)",
          background: "#ffffff",
          boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
        }}
      >
        <div
          style={{
            color: "#0b78b6",
            fontSize: 13,
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          OASIS Founder Sandbox
        </div>

        <h1
          style={{
            color: "#0f172a",
            fontSize: 28,
            margin: 0,
            marginBottom: 12,
          }}
        >
          Founder Access
        </h1>

        <p
          style={{
            color: "#486581",
            fontSize: 14,
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          Enter the founder review credentials to access the internal sandbox.
        </p>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              color: "#334155",
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Username
          </label>

          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(14,118,168,0.18)",
              marginBottom: 14,
              boxSizing: "border-box",
            }}
          />

          <label
            style={{
              display: "block",
              color: "#334155",
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(14,118,168,0.18)",
              marginBottom: 16,
              boxSizing: "border-box",
            }}
          />

          {error ? (
            <div
              style={{
                color: "#b91c1c",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px 16px",
              borderRadius: 999,
              border: "none",
              background: "#0b78b6",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Enter Sandbox →
          </button>
        </form>
      </div>
    </main>
  );
}