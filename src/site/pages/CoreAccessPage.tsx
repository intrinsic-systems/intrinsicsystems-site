import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SiteTopNav } from "../components/SiteTopNav";

export function CoreAccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const submitted = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("submitted") === "true";
  }, [location.search]);

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

                  <form
                    action="https://formsubmit.co/hello@intrinsicsystems.com.au"
                    method="POST"
                  >
                    <input
                      type="hidden"
                      name="_subject"
                      value="OASIS CORE Pilot Request"
                    />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_template" value="table" />
                    <input
                      type="hidden"
                      name="_next"
                      value="https://www.intrinsicsystems.com.au/core/access?submitted=true"
                    />

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
                        name="name"
                        required
                        placeholder="Enter your name"
                      />

                      <Field
                        label="Organisation"
                        name="organisation"
                        required
                        placeholder="Enter organisation name"
                      />

                      <Field
                        label="Work email"
                        name="email"
                        required
                        type="email"
                        placeholder="name@organisation.com"
                      />

                      <Field
                        label="Primary interest"
                        name="interest"
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
                    Thank you. Your request for OASIS CORE™ pilot access has
                    been submitted and will be reviewed shortly.
                  </div>

                  <div className="o-action-row">
                    <button
                      className="o-btn o-btn--primary"
                      type="button"
                      onClick={() => navigate("/core/access")}
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
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
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
        name={name}
        required={required}
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