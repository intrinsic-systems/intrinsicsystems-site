import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteTopNav } from "../components/SiteTopNav";

type AccessFormState = {
  name: string;
  organisation: string;
  email: string;
  interest: string;
};

const INITIAL_STATE: AccessFormState = {
  name: "",
  organisation: "",
  email: "",
  interest: "",
};

export function CoreAccessPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<AccessFormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof AccessFormState>(
    key: K,
    value: AccessFormState[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("OASIS CORE access request", {
      ...form,
      submittedAt: new Date().toISOString(),
    });

    setSubmitted(true);
    setForm(INITIAL_STATE);
  }

  return (
    <div className="o-suite-shell">
      <div className="o-suite-workspace">
        <div className="o-page">
          <SiteTopNav />

          <header className="o-page-header">
            <div className="o-page-header-main">
              <h1 className="o-page-title">Access OASIS CORE™</h1>
              <div className="o-page-tagline">
                Pilot access for selected organisations
              </div>
            </div>

            <div className="o-page-subtitle">
              OASIS CORE™ is currently being introduced through controlled pilot
              engagement. If your organisation is interested in early access,
              submit a request below.
            </div>
          </header>

          <section className="o-suite-section">
            <div
              className="o-card"
              style={{
                padding: 24,
                maxWidth: 760,
              }}
            >
              {!submitted ? (
                <>
                  <div
                    className="o-text-body"
                    style={{ marginBottom: 18, maxWidth: 640 }}
                  >
                    Early access is focused on organisations seeking structured
                    insight into governance, lifecycle decision-making, systems,
                    information, and performance alignment.
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: 16,
                        marginBottom: 16,
                      }}
                    >
                      <Field
                        label="Your name"
                        required
                        value={form.name}
                        onChange={(value) => updateField("name", value)}
                        placeholder="Enter your name"
                      />

                      <Field
                        label="Organisation"
                        required
                        value={form.organisation}
                        onChange={(value) => updateField("organisation", value)}
                        placeholder="Enter organisation name"
                      />

                      <Field
                        label="Work email"
                        required
                        type="email"
                        value={form.email}
                        onChange={(value) => updateField("email", value)}
                        placeholder="name@organisation.com"
                      />

                      <Field
                        label="Primary interest"
                        value={form.interest}
                        onChange={(value) => updateField("interest", value)}
                        placeholder="Pilot, assessment, partnership, etc."
                      />
                    </div>

                    <div className="o-action-row">
                      <button className="o-btn o-btn--primary" type="submit">
                        Submit access request →
                      </button>

                      <button
                        className="o-btn o-btn--secondary"
                        type="button"
                        onClick={() => navigate("/oasis")}
                      >
                        ← Back to OASIS Suite
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: "var(--oasis-text-primary)",
                      marginBottom: 10,
                    }}
                  >
                    Access request submitted
                  </div>

                  <div
                    className="o-text-body"
                    style={{ marginBottom: 18, maxWidth: 640 }}
                  >
                    Thank you. We have recorded your interest in OASIS CORE™
                    pilot access and will review the request shortly.
                  </div>

                  <div className="o-action-row">
                    <button
                      className="o-btn o-btn--primary"
                      type="button"
                      onClick={() => setSubmitted(false)}
                    >
                      Submit another request
                    </button>

                    <button
                      className="o-btn o-btn--secondary"
                      type="button"
                      onClick={() => navigate("/oasis")}
                    >
                      ← Back to OASIS Suite
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
}) {
  return (
    <label style={{ display: "block" }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--oasis-text-muted)",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </div>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          borderRadius: 12,
          border: "1px solid var(--oasis-border)",
          background: "var(--oasis-surface)",
          color: "var(--oasis-text-primary)",
          padding: "12px 14px",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </label>
  );
}