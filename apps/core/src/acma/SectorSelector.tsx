// src/acma/SectorSelector.tsx
/* eslint-disable no-constant-condition */
import React, { useMemo } from "react";
import type { ACMASector } from "./acmaHierarchy";
import { computeSectorScore } from "./acmaScoring";

type Props = {
  sectors: ACMASector[];
  answers: Record<string, string>;
  onSelect: (sectorCode: string) => void;
};

export const SectorSelector: React.FC<Props> = ({
  sectors,
  answers,
  onSelect,
}) => {
  const sectorSummaries = useMemo(
    () =>
      sectors.map((sector, idx) => {
        const sScore = computeSectorScore(sector.code, answers);

        const answered = sScore.answered ?? 0;
        const total = sScore.total ?? 0;
        const rawPct = Number.isFinite(sScore.scorePct) ? sScore.scorePct : 0;

        const completionPct =
          total > 0 ? Math.round((answered * 100) / total) : 0;
        const maturityPct = Math.round(rawPct || 0);

        return {
          index: idx + 1,
          sector,
          answered,
          total,
          completionPct,
          maturityPct,
        };
      }),
    [sectors, answers]
  );

  if (!sectorSummaries.length) return null;

  return (
    <div
      style={{
        marginTop: 16,
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
      }}
      aria-label="Select a sector to view detailed questions"
    >
      {sectorSummaries.map(
        ({ index, sector, answered, total, completionPct, maturityPct }) => {
          const label = `${index}. ${sector.name}`;
          const ariaLabel = `${label}. ${answered} of ${total} questions answered, ` +
            `${completionPct}% complete, ${maturityPct}% maturity. Press Enter to open.`;

          return (
            <button
              key={sector.code}
              type="button"
              className={
                "o-sector-tile o-sector-pill" +
                ( /* optional selected-state */ false ? " o-sector-pill--selected" : "" )
              }
              onClick={() => onSelect(sector.code)}
              aria-label={ariaLabel}
            >
              {/* Top row: index + sector name */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 4,
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--oasis-text-secondary)",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      minWidth: 16,
                      textAlign: "right",
                      fontWeight: 600,
                      color: "var(--oasis-text-primary)",
                    }}
                  >
                    {index}
                  </span>{" "}
                  {sector.name}
                </span>

                <span
                  style={{
                    fontSize: 10,
                    color: "var(--oasis-text-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {answered}/{total} · {completionPct}% complete
                </span>
              </div>

              {/* Progress meter */}
              <div
                style={{
                  height: 3,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: `${completionPct}%`,
                    height: "100%",
                    background: "var(--oasis-accent)",
                    opacity: 0.9,
                    transition: "width 150ms ease-out, opacity 120ms ease-out",
                  }}
                />
              </div>

              {/* Maturity text */}
              <div
                style={{
                  fontSize: 10,
                  color: "var(--oasis-text-secondary)",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 6,
                }}
              >
                <span>Sector maturity</span>
                <span>
                  {Number.isFinite(maturityPct) ? maturityPct : 0}
                  %{" "}
                  <span
                    style={{
                      opacity: 0.7,
                    }}
                  >
                    (0–100%)
                  </span>
                </span>
              </div>
            </button>
          );
        }
      )}
    </div>
  );
};