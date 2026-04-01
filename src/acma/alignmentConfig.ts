export type AlignmentConfigEntry = {
  iso: string[];
  gfmam: string[];
};

export const ALIGNMENT_CONFIG: Record<string, AlignmentConfigEntry> = {
  "Contingency Planning & Resilience Analysis": {
    iso: ["6.1", "8.1", "10"],
    gfmam: ["Risk & Review"],
  },
  "Change Management Planning & Implementation": {
    iso: ["6", "8", "10"],
    gfmam: ["Strategy & Planning", "Risk & Review"],
  },
  "Preventative Maintenance Strategies": {
    iso: ["8.1"],
    gfmam: ["Lifecycle Delivery"],
  },
  "Asset Creation & Acquisition": {
    iso: ["6", "8"],
    gfmam: ["Asset Management Decision-Making"],
  },
  "Demand Analysis": {
    iso: ["6", "8"],
    gfmam: ["Asset Management Decision-Making"],
  },
  "Standard Operating Procedures": {
    iso: ["6", "8"],
    gfmam: ["Asset Management Decision-Making"],
  },
  "Quality Management Practices": {
    iso: ["6", "8"],
    gfmam: ["Asset Management Decision-Making"],
  },
  "Asset Management Plans": {
    iso: ["6", "8"],
    gfmam: ["Asset Management Decision-Making"],
  },
  "Optimisation & Lifecycle Cost Evaluation": {
    iso: ["6", "8"],
    gfmam: ["Lifecycle Delivery"],
  },
  "Maintenance Delivery": {
    iso: ["8.1"],
    gfmam: ["Lifecycle Delivery"],
  },
  "Asset Management Strategy & Objectives": {
    iso: ["6"],
    gfmam: ["Strategy & Planning"],
  },
  "Asset Information Strategy": {
    iso: ["7.5"],
    gfmam: ["Asset Information"],
  },
  "Resource Management": {
    iso: ["7.1"],
    gfmam: ["Organisation & People"],
  },
  "Operations & Maintenance Decision Making": {
    iso: ["8.1", "9.1"],
    gfmam: ["Lifecycle Delivery", "Asset Management Decision-Making"],
  },
  "Management Review, Audit & Assurance": {
    iso: ["9.2", "9.3"],
    gfmam: ["Risk & Review"],
  },
  "Organisational Structure & Culture": {
    iso: ["5", "7.3"],
    gfmam: ["Organisation & People"],
  },
  "Data Standards & System Requirements": {
    iso: ["7.5"],
    gfmam: ["Asset Information"],
  },
  "Long Term Financial Plans": {
    iso: ["6"],
    gfmam: ["Strategy & Planning"],
  },
  "Works Planning & Prioritisation Processes": {
    iso: ["8.1"],
    gfmam: ["Lifecycle Delivery"],
  },
  "Lifecycle Cost Assessment Processes": {
    iso: ["8.1", "9.1"],
    gfmam: ["Lifecycle Delivery"],
  },
  "Roles & Responsibilities for AM Implementation": {
    iso: ["5.3", "7.2"],
    gfmam: ["Organisation & People"],
  },
  "Inventory Data Collection & Condition Assessment": {
    iso: ["7.5", "9.1"],
    gfmam: ["Asset Information"],
  },
  "Strategic Asset Management Plans": {
    iso: ["6"],
    gfmam: ["Strategy & Planning"],
  },
  "Asset Management Communication Strategy": {
    iso: ["7.4"],
    gfmam: ["Organisation & People"],
  },
  "Technical Standards & Legislation": {
    iso: ["4", "8.1"],
    gfmam: ["Asset Management Decision-Making"],
  },
  "Competence Management": {
    iso: ["7.2"],
    gfmam: ["Organisation & People"],
  },
  "Risk Assessment & Management": {
    iso: ["6.1"],
    gfmam: ["Risk & Review"],
  },
  "Asset Modelling & Deterioration Analysis": {
    iso: ["9.1"],
    gfmam: ["Asset Management Decision-Making"],
  },
  "eAMS Specification": {
    iso: ["7.5", "8.1"],
    gfmam: ["Asset Information"],
  },
  "Asset Performance & Health Monitoring": {
    iso: ["9.1"],
    gfmam: ["Lifecycle Delivery", "Asset Management Decision-Making"],
  },
  "Financial Planning & Budgeting Processes": {
    iso: ["6", "7.1"],
    gfmam: ["Strategy & Planning"],
  },
  "Asset Management Vision & Leadership": {
    iso: ["5", "4"],
    gfmam: ["Strategy & Planning", "Organisation & People"],
  },
  "Performance Framework & Levels of Service": {
    iso: ["9.1"],
    gfmam: ["Asset Management Decision-Making"],
  },
  "Asset Management Policy": {
    iso: ["5.2"],
    gfmam: ["Strategy & Planning"],
  },
  "Stakeholder Engagement Strategy": {
    iso: ["4.2", "7.4"],
    gfmam: ["Organisation & People"],
  },
  "Condition Assessment Standards": {
    iso: ["8.1", "9.1"],
    gfmam: ["Lifecycle Delivery"],
  },
  "Asset Reliability & Performance": {
    iso: ["9.1"],
    gfmam: ["Lifecycle Delivery"],
  },
  "Interface with Planning Process": {
    iso: ["6"],
    gfmam: ["Strategy & Planning"],
  },
  "Asset Management Leadership": {
    iso: ["5.1", "5.3"],
    gfmam: ["Organisation & People"],
  },
};

export function getAlignmentForCapability(label: string): AlignmentConfigEntry {
  return (
    ALIGNMENT_CONFIG[label] ?? {
      iso: ["—"],
      gfmam: ["—"],
    }
  );
}

export function getRiskLevel(scorePct: number, coveragePct = 100) {
  if (coveragePct < 60) return "Low evidence";
  if (scorePct < 20) return "High";
  if (scorePct < 40) return "Moderate";
  return "Low";
}