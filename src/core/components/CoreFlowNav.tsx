import { useLocation, useNavigate } from "react-router-dom";

type FlowStep = {
  label: string;
  path: string;
  isEnabled: boolean;
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
    { label: "Suite", path: "/", isEnabled: true },
    { label: "CORE", path: "/core", isEnabled: true },
    { label: "Setup", path: "/core/onboarding", isEnabled: true },
    { label: "Assessment", path: "/core/acma", isEnabled: hasProfile || hasAnswers },
    { label: "Results", path: "/core/results", isEnabled: hasAnswers },
  ];

  const isCoreRoute = location.pathname.startsWith("/core");

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/core") return isCoreRoute;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="o-flow-nav" aria-label="CORE flow navigation">
      <div className="o-flow-nav__inner">
        {steps.map((step, index) => {
          const active = isActive(step.path);
          const sectionActive = step.path === "/core" && isCoreRoute;
          const stepActive = step.path !== "/core" && active;

          return (
            <div key={step.path} className="o-flow-nav__item">
              <button
                type="button"
                className={
                  "o-flow-nav__step" +
                  (sectionActive ? " o-flow-nav__step--section-active" : "") +
                  (stepActive ? " o-flow-nav__step--active" : "") +
                  (!step.isEnabled ? " o-flow-nav__step--disabled" : "")
                }
                onClick={() => step.isEnabled && navigate(step.path)}
                disabled={!step.isEnabled}
                aria-current={active ? "page" : undefined}
              >
                {step.label}
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