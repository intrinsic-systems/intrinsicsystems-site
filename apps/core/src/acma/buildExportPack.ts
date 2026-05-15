type ExportPackInput = {
  assessmentSummary: any;
  alignmentRows: Array<{
    id: string;
    capability: string;
    scorePct: number;
    coveragePct?: number;
    risk?: string;
    iso?: string[];
    gfmam?: string[];
  }>;
};

export function buildExportPack({ assessmentSummary, alignmentRows }: ExportPackInput) {
  return {
    generatedAt: new Date().toISOString(),
    summary: {
      baselinePct: assessmentSummary.maturityPct,
      completionPct: assessmentSummary.completionPct,
      answered: assessmentSummary.answered,
      total: assessmentSummary.total,
    },
    priorities: assessmentSummary.nextBestActions,
    pathway: assessmentSummary.pathway,
    rankedCapabilities: assessmentSummary.capabilityScores,
    alignment: alignmentRows,
  };
}