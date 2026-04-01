// src/acma/exportUtils.ts
import { ACMA_SECTORS } from "./acmaHierarchy";

export type ScoreRow = {
  label: string;
  pct: number;
};

function csvEscape(value: string): string {
  const v = (value ?? "").replace(/"/g, '""');
  return `"${v}"`;
}

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Export simple label / % rows (Business, GFMAM, ISO summaries).
 */
export function exportMappedScoresToCsv(
  filename: string,
  rows: ScoreRow[]
) {
  const header = "Label,Score (%)\n";
  const body = rows
    .map((r) => `${csvEscape(r.label)},${Math.round(r.pct)}`)
    .join("\n");
  downloadFile(filename, header + body, "text/csv");
}

/**
 * Export all questions + answers for a single sector.
 */
export function exportSectorAnswersToCsv(
  filename: string,
  sectorCode: string,
  answers: Record<string, string>
) {
  const sector = ACMA_SECTORS.find((s) => s.code === sectorCode);
  if (!sector) return;

  const header =
    "Sector,Area,Activity,QuestionCode,QuestionText,Answer\n";
  const lines: string[] = [];

  sector.areas.forEach((area) => {
    area.activities.forEach((act) => {
      act.questions.forEach((q) => {
        const ans = answers[q.code] ?? "";
        lines.push(
          [
            csvEscape(sector.name),
            csvEscape(area.name),
            csvEscape(act.name),
            csvEscape(q.code),
            csvEscape(q.text),
            csvEscape(ans),
          ].join(",")
        );
      });
    });
  });

  downloadFile(filename, header + lines.join("\n"), "text/csv");
}

/**
 * Export raw answer object as JSON (for Inspector+, backups, etc.).
 */
export function exportRawAnswersToJson(
  filename: string,
  answers: Record<string, string>
) {
  const content = JSON.stringify(answers, null, 2);
  downloadFile(filename, content, "application/json");
}