import { useMemo, useState } from "react";
import { OrgGovRadial } from "./OrgGovRadial";
import { OrgGovDetailPanel } from "./OrgGovDetailPanel";
import { mapOrgGovFromResults } from "./mapOrgGovFromResults";
import type { ScoreMode } from "./orgGovTypes";

type CoreCapabilityScore = {
  id: string;
  label: string;
  scorePct: number;
};

type CoreResultsInput = {
  maturityPct: number;
  confidencePct: number;
  capabilityScores: CoreCapabilityScore[];
};

const MODES: ScoreMode[] = ["current", "benchmark", "target", "variance"];

function modeLabel(mode: ScoreMode): string {
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
      return mode;
  }
}

function modeHelpText(mode: ScoreMode): string {
  switch (mode) {
    case "current":
      return "Shows current observed capability position.";
    case "benchmark":
      return "Shows external or reference comparison position.";
    case "target":
      return "Shows intended future-state capability position.";
    case "variance":
      return "Highlights uplift pressure between current and target.";
    default:
      return "";
  }
}

type OrgGovExecutiveViewProps = {
  embedded?: boolean;
  results?: CoreResultsInput;
};

export default function OrgGovExecutiveView({
  embedded = false,
  results,
}: OrgGovExecutiveViewProps) {
  const [mode, setMode] = useState<ScoreMode>("current");
  const [selectedElementId, setSelectedElementId] = useState<string | undefined>(
    undefined
  );
  const [includeQuestions, setIncludeQuestions] = useState(false);

  const orgGovDomain = useMemo(() => {
    if (!results) return null;

    return mapOrgGovFromResults({
      overallScorePct: results.maturityPct,
      confidencePct: results.confidencePct,
      capabilities: results.capabilityScores.map((item) => ({
        name: item.label,
        scorePct: item.scorePct,
        confidencePct: results.confidencePct,
      })),
    });
  }, [results]);

  const selectedElement = useMemo(() => {
    if (!orgGovDomain) return undefined;
    return orgGovDomain.elements.find(
      (element) => element.id === selectedElementId
    );
  }, [orgGovDomain, selectedElementId]);

  const radialTitle = selectedElement
    ? selectedElement.title
    : "Enterprise Capability View";

  if (!orgGovDomain) {
    return (
      <div
        className={
          embedded
            ? "text-slate-100"
            : "min-h-screen bg-slate-950 px-6 py-6 text-slate-100"
        }
      >
        <div className={embedded ? "" : "mx-auto max-w-7xl"}>
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl shadow-black/20">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              OASIS CORE · Executive Capability View
            </div>
            <h3 className="text-2xl font-semibold text-white">
              Organisation & Governance
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Executive capability view will appear once CORE results are
              available.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        embedded
          ? "text-slate-100"
          : "min-h-screen bg-slate-950 px-6 py-6 text-slate-100"
      }
    >
      <div className={embedded ? "" : "mx-auto max-w-7xl"}>
        {!embedded && (
          <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl shadow-black/30 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                OASIS CORE · Executive Capability View
              </div>
              <h1 className="text-3xl font-semibold text-white">
                Organisation & Governance
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                Engineered capability view showing domain-to-element performance,
                traceable question drivers, and evidence-aware inspection for
                executive and practitioner use.
              </p>
            </div>
          </div>
        )}

        {embedded && (
          <div className="mb-5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              OASIS CORE · Executive Capability View
            </div>
            <h3 className="text-2xl font-semibold text-slate-900">
              Organisation & Governance
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Interactive domain view showing rolled-up capability position,
              element-level drivers, and evidence-aware inspection.
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              This preview shows how OASIS CORE extends beyond static scoring
              into structured capability intelligence.
            </p>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <section className="flex h-[820px] flex-col rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/20">
            <div className="mb-4 flex min-h-[84px] items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Radial Capability Engine
                </div>
                <div className="mt-1 min-h-[56px] text-lg font-semibold leading-6 text-white">
                  {radialTitle}
                </div>
              </div>

              <div className="max-w-[220px] text-sm leading-5 text-slate-400">
                Select an element to inspect its score and primary drivers.
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {MODES.map((item) => {
                  const active = item === mode;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setMode(item)}
                      className={[
                        "rounded-xl border px-4 py-2 text-sm font-medium transition",
                        active
                          ? "border-slate-500 bg-slate-100 text-slate-950"
                          : "border-slate-700 bg-slate-950/80 text-slate-200 hover:border-slate-500",
                      ].join(" ")}
                    >
                      {modeLabel(item)}
                    </button>
                  );
                })}
              </div>

              <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={includeQuestions}
                  onChange={(event) => setIncludeQuestions(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
                />
                Show question ring
              </label>
            </div>

            <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/55 px-3 py-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                {modeLabel(mode)} mode:
              </span>{" "}
              {modeHelpText(mode)}
            </div>

            <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/55 p-2">
              <div className="h-full overflow-hidden rounded-[1.15rem] border border-slate-700/60 bg-slate-800/65">
                <OrgGovRadial
                  domain={orgGovDomain}
                  mode={mode}
                  includeQuestions={includeQuestions}
                  selectedElementId={selectedElementId}
                  onSelectElement={setSelectedElementId}
                />
              </div>
            </div>
          </section>

          <OrgGovDetailPanel
            domain={orgGovDomain}
            selectedElementId={selectedElementId}
            mode={mode}
          />
        </div>
      </div>
    </div>
  );
}