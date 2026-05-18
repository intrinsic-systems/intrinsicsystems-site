import { useNavigate, useOutletContext } from "react-router-dom";
import { WelcomeScreen } from "../../WelcomeScreen";
import type { CoreFlowContextValue } from "../CoreFlowShell";

export function CoreStartRoute() {
  const ctx = useOutletContext<CoreFlowContextValue>();
  const navigate = useNavigate();

  const hasPrevious = (() => {
    try {
      const raw = localStorage.getItem("oasis_acma_answers");
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return !!parsed && Object.keys(parsed).length > 0;
    } catch {
      return false;
    }
  })();

  return (
    <WelcomeScreen
      hasPrevious={hasPrevious}
      onStartNew={() => {
        ctx.clearAllAnswers();
        navigate("/core/onboarding");
      }}
      onContinueExisting={() => navigate("/core/acma")}
      onBackToSuite={() => navigate("/core/start")}
    />
  );
}