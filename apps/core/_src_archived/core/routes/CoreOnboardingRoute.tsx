import { useOutletContext } from "react-router-dom";
import { OnboardingWizard } from "../../OnboardingWizard";
import type { CoreFlowContextValue } from "../CoreFlowShell";

export function CoreOnboardingRoute() {
  const ctx = useOutletContext<CoreFlowContextValue>();

  return (
    <OnboardingWizard
      onComplete={ctx.onOnboardingComplete}
      onSkip={() => ctx.goAcma()}
      onCancel={() => ctx.goWelcome()}
    />
  );
}