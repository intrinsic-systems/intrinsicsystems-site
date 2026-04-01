import { useMemo, useState } from "react";

type AlignmentRow = {
  id: string;
  capability: string;
  scorePct: number;
  coveragePct?: number;
  risk?: string;
  iso?: string[];
  gfmam?: string[];
};

type Props = {
  rows: AlignmentRow[];
  title?: string;
  subtitle?: string;
};

function bandClass(scorePct: number) {
  if (scorePct < 20) return "o-align-score o-align-score--critical";
  if (scorePct < 40) return "o-align-score o-align-score--watch";
  if (scorePct < 60) return "o-align-score o-align-score--moderate";
  return "o-align-score o-align-score--strong";
}

function riskClass(risk?: string) {
  switch (risk) {
    case "High":
      return "o-align-risk o-align-risk--high";
    case "Moderate":
      return "o-align-risk o-align-risk--moderate";
    case "Low evidence":
      return "o-align-risk o-align-risk--uncertain";
    default:
      return "o-align-risk o-align-risk--low";
  }
}

export function AlignmentMatrixPanel({
  rows,
  title = "Standards alignment matrix",
  subtitle = "Maps current capability positions to aligned ISO 55001 clauses and GFMAM subject areas.",
}: Props) {
  const [showPriorityOnly, setShowPriorityOnly] = useState(false);

  const filteredRows = useMemo(() => {
    if (!showPriorityOnly) return rows;
    return rows.filter((row) => row.scorePct < 40);
  }, [rows, showPriorityOnly]);

  return (
    <section className="o-card o-card-pad">
      <div className="o-results-section-header">
        <h2 className="o-section-heading">{title}</h2>
        <div className="o-text-small">{subtitle}</div>
      </div>

      <div style={{ marginTop: 12, marginBottom: 14 }}>
        <button
          type="button"
          className="o-btn o-btn--secondary"
          onClick={() => setShowPriorityOnly((v) => !v)}
        >
          {showPriorityOnly ? "Show all" : "Show priority gaps (<40%)"}
        </button>
      </div>

      <div className="o-alignment-table-wrap">
        <table className="o-alignment-table">
          <thead>
            <tr>
              <th>Capability</th>
              <th>Position</th>
              <th>Coverage</th>
              <th>Risk</th>
              <th>ISO 55001</th>
              <th>GFMAM</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id}>
                <td className="o-alignment-table__capability">
                  {row.capability}
                </td>

                <td>
                  <span className={bandClass(row.scorePct)}>
                    {row.scorePct}%
                  </span>
                </td>

                <td>{row.coveragePct != null ? `${row.coveragePct}%` : "—"}</td>

                <td>
                  <span className={riskClass(row.risk)}>{row.risk ?? "—"}</span>
                </td>

                <td>
                  <div className="o-align-chip-wrap">
                    {row.iso?.length
                      ? row.iso.map((value) => (
                          <span key={value} className="o-align-chip">
                            {value}
                          </span>
                        ))
                      : "—"}
                  </div>
                </td>

                <td>
                  <div className="o-align-chip-wrap">
                    {row.gfmam?.length
                      ? row.gfmam.map((value) => (
                          <span key={value} className="o-align-chip">
                            {value}
                          </span>
                        ))
                      : "—"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}