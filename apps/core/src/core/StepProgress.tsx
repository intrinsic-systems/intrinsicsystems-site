// src/core/StepProgress.tsx
type StepProgressProps = {
  step: number;
  total: number;
  labels?: string[];
};

export function StepProgress({
  step,
  total,
  labels = [],
}: StepProgressProps) {
  const pct = total > 1 ? Math.round((step / (total - 1)) * 100) : 0;

  return (
    <div className="o-step-progress" aria-label="Assessment setup progress">
      <div className="o-step-progress__top">
        <div className="o-step-progress__meta">
          Step {step + 1} of {total}
        </div>
        <div className="o-step-progress__pct">{pct}%</div>
      </div>

      <div
        className="o-step-progress__bar"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step + 1}
        aria-valuetext={`Step ${step + 1} of ${total}`}
      >
        <div
          className="o-step-progress__fill"
          style={{ width: `${pct}%` }}
        />
      </div>

      {labels.length > 0 && (
        <div className="o-step-progress__labels">
          {labels.map((label, index) => {
            const state =
              index < step ? "done" : index === step ? "active" : "upcoming";

            return (
              <div
                key={label}
                className={`o-step-progress__label o-step-progress__label--${state}`}
              >
                <span className="o-step-progress__dot" />
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}