// src/core/routes/CoreAcmaRoute.tsx
import { useOutletContext, useNavigate } from "react-router-dom";
import { ACMAWizardPage } from "../../acma/ACMAWizardPage";
import type { CoreFlowContextValue } from "../CoreFlowShell";

export function CoreAcmaRoute() {
  const ctx = useOutletContext<CoreFlowContextValue>();
  const navigate = useNavigate();

  return (
    <>
      <ACMAWizardPage
        answers={ctx.answers}
        onAnswer={ctx.onAnswer}
        onExitToWelcome={() => ctx.goWelcome()}
        onClearAllAnswers={ctx.clearAllAnswers}
      />

      <div
        className="o-action-row"
        style={{
          justifyContent: "flex-end",
          marginTop: 24,
        }}
      >
        <button
          type="button"
          className="o-btn o-btn--ghost"
          onClick={() => window.print()}
        >
          Print summary / PDF
        </button>

        <button
          type="button"
          className="o-btn o-btn--primary"
          onClick={() => navigate("/core/results")}
        >
          View results →
        </button>
      </div>
    </>
  );
}