// src/acma/activityCapabilityMap.ts

export type CapabilityNodeRef = {
  id: string;
  label: string;
};

export const ACTIVITY_CAPABILITY_MAP: Record<string, CapabilityNodeRef> = {
  // Governance
  "1.1.1": { id: "vision-leadership", label: "Asset Management Vision & Leadership" },
  "1.1.2": { id: "policy", label: "Asset Management Policy" },
  "1.1.3": { id: "leadership", label: "Asset Management Leadership" },
  "1.1.4": { id: "strategic-plan", label: "Strategic Asset Management Plans" },

  "1.2.5": { id: "communication-strategy", label: "Asset Management Communication Strategy" },
  "1.2.6": { id: "performance-framework", label: "Performance Framework & Levels of Service" },
  "1.2.7": { id: "planning-interface", label: "Interface with Planning Process" },
  "1.2.8": { id: "stakeholder-engagement", label: "Stakeholder Engagement Strategy" },
  "1.2.9": { id: "technical-standards", label: "Technical Standards & Legislation" },
  "1.2.10": { id: "strategy-objectives", label: "Asset Management Strategy & Objectives" },
  "1.2.11": { id: "ops-decision-making", label: "Operations & Maintenance Decision Making" },
  "1.2.12": { id: "review-assurance", label: "Management Review, Audit & Assurance" },

  // Effectiveness
  "2.3.13": { id: "roles-responsibilities", label: "Roles & Responsibilities for AM Implementation" },
  "2.3.14": { id: "resourcing-strategy", label: "Asset Management Resourcing Strategy" },
  "2.3.15": { id: "org-culture", label: "Organisational Structure & Culture" },
  "2.3.16": { id: "competence-management", label: "Competence Management" },
  "2.3.17": { id: "risk-management", label: "Risk Assessment & Management" },
  "2.3.18": { id: "contingency-resilience", label: "Contingency Planning & Resilience Analysis" },

  "2.4.19": { id: "asset-information-strategy", label: "Asset Information Strategy" },
  "2.4.20": { id: "data-standards", label: "Data Standards & System Requirements" },
  "2.4.21": { id: "inventory-condition", label: "Inventory Data Collection & Condition Assessment" },
  "2.4.22": { id: "condition-standards", label: "Condition Assessment Standards" },

  "2.5.23": { id: "optimisation-lifecycle", label: "Optimisation & Lifecycle Cost Evaluation" },
  "2.5.24": { id: "financial-planning", label: "Financial Planning & Budgeting Processes" },
  "2.5.25": { id: "long-term-financial-plans", label: "Long Term Financial Plans" },
  "2.5.26": { id: "lifecycle-cost-processes", label: "Lifecycle Cost Assessment Processes" },

  // Efficiency
  "3.6.27": { id: "demand-analysis", label: "Demand Analysis" },
  "3.6.29": { id: "asset-creation", label: "Asset Creation & Acquisition" },

  "3.7.31": { id: "preventive-maintenance", label: "Preventative Maintenance Strategies" },
  "3.7.32": { id: "reliability-performance", label: "Asset Reliability & Performance" },
  "3.7.33": { id: "modelling-deterioration", label: "Asset Modelling & Deterioration Analysis" },
  "3.7.34": { id: "asset-management-plans", label: "Asset Management Plans" },
  "3.7.35": { id: "works-planning", label: "Works Planning & Prioritisation Processes" },
  "3.7.36": { id: "sop", label: "Standard Operating Procedures" },

  "3.8.40": { id: "maintenance-delivery", label: "Maintenance Delivery" },
  "3.8.46": { id: "resource-management", label: "Resource Management" },

  // Tools
  "4.9.47": { id: "eams-specification", label: "eAMS Specification" },
  "4.9.50": { id: "change-management", label: "Change Management Planning & Implementation" },

  // Quality
  "5.10.51": { id: "performance-health", label: "Asset Performance & Health Monitoring" },
  "5.10.52": { id: "quality-management", label: "Quality Management Practices" },
};

export function getCapabilityForActivity(activityCode: string): CapabilityNodeRef | null {
  return ACTIVITY_CAPABILITY_MAP[activityCode] ?? null;
}