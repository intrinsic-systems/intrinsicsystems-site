import { useLocation, useNavigate } from "react-router-dom";

type FlowStep = {
  label: string;
  path: string;
  isEnabled: boolean;
  external?: boolean;
};

export function CoreFlowNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const hasAnswers = (() => {
    try {
      const raw = localStorage.getItem("oasis_acma_answers");
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return !!parsed && Object.keys(parsed).length > 0;
    } catch {
      return false;
    }
  })();

  const hasProfile = (() => {
    try {
      const raw = localStorage.getItem("oasis_profile");
      return !!raw;
    } catch {
      return false;
    }
  })();

  const steps: FlowStep[] = [
    {
      label: "Suite",
      path: "https://www.intrinsicsystems.com.au",
      isEnabled: true,
      external: true,
    },
    { label: "CORE", path: "/core/start", isEnabled: true },
    { label: "Setup", path: "/core/onboarding", isEnabled: true },
    {
      label: "Assessment",
      path: "/core/acma",
      isEnabled: hasProfile || hasAnswers,
    },
    { label: "Results", path: "/core/results", isEnabled: hasAnswers },
  ];

  const isActive = (path: string, external?: boolean) => {
    if (external) return false;
    if (path === "/core/start") {
      return location.pathname === "/core" || location.pathname === "/core/start";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigate = (step: FlowStep) => {
    if (!step.isEnabled) return;

    if (step.external) {
      window.location.assign(step.path);
      return;
    }

    navigate(step.path);
  };

  return (
    <nav
      className="o-flow-nav o-flow-nav--embedded"
      aria-label="CORE flow navigation"
    >
      <div className="o-flow-nav__track">
        {steps.map((step, index) => {
          const active = isActive(step.path, step.external);

          return (
            <div key={step.label} className="o-flow-nav__item">
              <button
                type="button"
                className={[
                  "o-flow-nav__step",
                  active ? "o-flow-nav__step--active" : "",
                  !step.isEnabled ? "o-flow-nav__step--disabled" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleNavigate(step)}
                disabled={!step.isEnabled}
                aria-current={active ? "page" : undefined}
              >
                <span className="o-flow-nav__step-label">{step.label}</span>
              </button>

              {index < steps.length - 1 && (
                <span className="o-flow-nav__divider" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}