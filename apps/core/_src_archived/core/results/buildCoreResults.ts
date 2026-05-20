type CoreResults = {
  overallScore: number;
  confidenceScore: number;
  maturityBand: string;
  summary: string;
  domains: {
    key: string;
    label: string;
    score: number;
    signal: "low" | "medium" | "high";
  }[];
  priorities: {
    title: string;
    description: string;
    priority: "High" | "Medium" | "Low";
  }[];
  pathway: {
    now: string[];
    next: string[];
    later: string[];
  };
};