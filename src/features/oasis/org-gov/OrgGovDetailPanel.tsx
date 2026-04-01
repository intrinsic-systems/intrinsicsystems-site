import type { DomainNode, ElementNode, Question, ScoreMode } from "./orgGovTypes";

type OrgGovDetailPanelProps = {
  domain: DomainNode;
  selectedElementId?: string;
  mode: ScoreMode;
};

function scoreText(value?: number): string {
  return typeof value === "number" ? value.toFixed(1) : "-";
}

function varianceText(value?: number): string {
  if (typeof value !== "number") return "-";
  return value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
}

function findSelectedElement(
  domain: DomainNode,
  selectedElementId?: string
): ElementNode | undefined {
  return domain.elements.find((element) => element.id === selectedElementId);
}

function evidenceState(question: Question): string {
  const count = question.evidenceItems?.length ?? 0;
  if (!question.evidenceRequired) return "Not required";
  if (count === 0) return "Evidence pending";
  const hasVerified =
    question.evidenceItems?.some((item) => item.verified) ?? false;
  return hasVerified ? "Verified" : "Provided";
}

function evidenceBadgeClass(state: string): string {
  switch (state) {
    case "Verified":
      return "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300";
    case "Provided":
      return "border border-amber-500/30 bg-amber-500/15 text-amber-300";
    case "Evidence pending":
      return "border border-rose-500/30 bg-rose-500/15 text-rose-300";
    default:
      return "border border-slate-500/30 bg-slate-500/15 text-slate-300";
  }
}

function metricToneClass(value?: number): string {
  if (typeof value !== "number") return "text-white";
  if (value >= 4.0) return "text-emerald-300";
  if (value >= 3.0) return "text-amber-300";
  return "text-rose-300";
}

function rankedQuestions(questions: Question[]): Question[] {
  return [...questions].sort((a, b) => {
    const aGap = (a.score.target ?? 0) - (a.score.current ?? 0);
    const bGap = (b.score.target ?? 0) - (b.score.current ?? 0);

    if (bGap !== aGap) return bGap - aGap;

    const aConfidence = a.score.confidence ?? 0;
    const bConfidence = b.score.confidence ?? 0;
    return aConfidence - bConfidence;
  });
}

function modeSummary(mode: ScoreMode): string {
  switch (mode) {
    case "current":
      return "Current observed capability position for the selected scope.";
    case "benchmark":
      return "Reference comparison position against the selected benchmark.";
    case "target":
      return "Intended future-state capability position for the selected scope.";
    case "variance":
      return "Uplift pressure between current position and target state.";
    default:
      return "";
  }
}

function primaryMetricLabel(mode: ScoreMode): string {
  switch (mode) {
    case "current":
      return "Current";
    case "benchmark":
      return "Benchmark";
    case "target":
      return "Target";
    case "variance":
      return "Variance";
    default:
      return "Current";
  }
}

function primaryMetricValue(
  mode: ScoreMode,
  score: ElementNode["score"] | DomainNode["score"]
): string {
  switch (mode) {
    case "current":
      return scoreText(score.current);
    case "benchmark":
      return scoreText(score.benchmark);
    case "target":
      return scoreText(score.target);
    case "variance":
      return varianceText(score.variance);
    default:
      return scoreText(score.current);
  }
}

function primaryMetricToneClass(
  mode: ScoreMode,
  score: ElementNode["score"] | DomainNode["score"]
): string {
  switch (mode) {
    case "current":
      return metricToneClass(score.current);
    case "benchmark":
      return "text-white";
    case "target":
      return "text-white";
    case "variance":
      return metricToneClass(score.current);
    default:
      return metricToneClass(score.current);
  }
}

function StatCard({
  label,
  value,
  toneClass = "text-white",
  large = false,
}: {
  label: string;
  value: string;
  toneClass?: string;
  large?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
      <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>
      <div
        className={`mt-1 font-semibold ${toneClass} ${
          large ? "text-[1.7rem]" : "text-[1.45rem]"
        } leading-none`}
      >
        {value}
      </div>
    </div>
  );
}

export function OrgGovDetailPanel({
  domain,
  selectedElementId,
  mode,
}: OrgGovDetailPanelProps) {
  const element = findSelectedElement(domain, selectedElementId);
  const activeScore = element ? element.score : domain.score;
  const topDrivers = element ? rankedQuestions(element.questions).slice(0, 3) : [];

  if (!element) {
    return (
      <aside className="flex h-[820px] min-h-0 flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-slate-200">
        <div className="shrink-0">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Enterprise Summary
          </div>

          <h3 className="mb-2 text-xl font-semibold text-white">
            {domain.title}
          </h3>

          <p className="mb-3 text-sm leading-5 text-slate-300">
            {modeSummary(mode)}
          </p>

          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-[1.15fr_1fr_1fr]">
            <StatCard
              label={primaryMetricLabel(mode)}
              value={primaryMetricValue(mode, activeScore)}
              toneClass={primaryMetricToneClass(mode, activeScore)}
              large
            />
            <StatCard
              label="Current"
              value={scoreText(domain.score.current)}
              toneClass={metricToneClass(domain.score.current)}
            />
            <StatCard label="Target" value={scoreText(domain.score.target)} />
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <StatCard
              label="Benchmark"
              value={scoreText(domain.score.benchmark)}
            />
            <StatCard
              label="Variance"
              value={varianceText(domain.score.variance)}
              toneClass={metricToneClass(domain.score.current)}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]">
          <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              How to Read This
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <p>The radial presents capability as a structured hierarchy.</p>
              <p>
                Inner and mid rings show grouped capability elements within the
                current scope.
              </p>
              <p>
                Select an element to inspect its score, gap, and primary
                drivers.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
            <span className="rounded-full bg-slate-200/10 px-2 py-1">
              Executive Overview
            </span>
            <span className="rounded-full bg-slate-200/10 px-2 py-1">
              Hierarchical View
            </span>
            <span className="rounded-full bg-slate-200/10 px-2 py-1">
              Driver Traceability
            </span>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-[820px] min-h-0 flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-slate-200">
      <div className="shrink-0">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Selected Element
        </div>

        <h3 className="mb-2 text-xl font-semibold text-white">
          {element.title}
        </h3>

        <p className="mb-3 text-sm leading-5 text-slate-300">
          {modeSummary(mode)}
        </p>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-[1.15fr_1fr_1fr]">
          <StatCard
            label={primaryMetricLabel(mode)}
            value={primaryMetricValue(mode, activeScore)}
            toneClass={primaryMetricToneClass(mode, activeScore)}
            large
          />
          <StatCard
            label="Current"
            value={scoreText(element.score.current)}
            toneClass={metricToneClass(element.score.current)}
          />
          <StatCard label="Target" value={scoreText(element.score.target)} />
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <StatCard
            label="Benchmark"
            value={scoreText(element.score.benchmark)}
          />
          <StatCard
            label="Variance"
            value={varianceText(element.score.variance)}
            toneClass={metricToneClass(element.score.current)}
          />
        </div>

        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Top Drivers
          </div>
          <div className="text-xs text-slate-500">
            Top {topDrivers.length} of {element.questions.length}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 pr-1">
        <div className="space-y-3">
          {topDrivers.map((question, index) => {
            const state = evidenceState(question);
            const gap =
              typeof question.score.target === "number" &&
              typeof question.score.current === "number"
                ? question.score.target - question.score.current
                : undefined;

            return (
              <div
                key={question.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-3"
              >
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                      Driver {index + 1}
                    </div>
                    <div className="mt-0.5 text-[13px] font-semibold leading-5 text-white">
                      {question.prompt}
                    </div>
                  </div>

                  <div
                    className={`rounded-full px-2 py-1 text-[11px] font-medium ${evidenceBadgeClass(
                      state
                    )}`}
                  >
                    {state}
                  </div>
                </div>

                <div className="mb-2 flex flex-wrap gap-1.5 text-[10px] text-slate-400">
                  <span className="rounded-full bg-slate-800 px-2 py-0.5">
                    {question.type}
                  </span>
                  {typeof gap === "number" && (
                    <span className="rounded-full bg-slate-800 px-2 py-0.5">
                      Gap {gap > 0 ? `+${gap.toFixed(1)}` : gap.toFixed(1)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px] sm:grid-cols-4">
                  <div className="rounded-lg bg-slate-950/80 p-1.5">
                    <div className="text-slate-400">Current</div>
                    <div
                      className={`mt-1 text-sm font-semibold ${metricToneClass(
                        question.score.current
                      )}`}
                    >
                      {scoreText(question.score.current)}
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-950/80 p-1.5">
                    <div className="text-slate-400">Benchmark</div>
                    <div className="mt-0.5 text-[12px] font-semibold text-white">
                      {scoreText(question.score.benchmark)}
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-950/80 p-1.5">
                    <div className="text-slate-400">Target</div>
                    <div className="mt-0.5 text-[12px] font-semibold text-white">
                      {scoreText(question.score.target)}
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-950/80 p-1.5">
                    <div className="text-slate-400">Confidence</div>
                    <div className="mt-0.5 text-[12px] font-semibold text-white">
                      {scoreText(question.score.confidence)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}