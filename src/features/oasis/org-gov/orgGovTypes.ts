export type ScoreMode = "current" | "benchmark" | "target" | "variance";

export type ScoreSet = {
  current: number;
  benchmark?: number;
  target?: number;
  variance?: number;
  confidence?: number;
};

export type QuestionEvidence = {
  id: string;
  type:
    | "DOCUMENT"
    | "POLICY"
    | "PLAN"
    | "MINUTES"
    | "REPORT"
    | "REGISTER"
    | "SYSTEM_RECORD"
    | "WORKFLOW"
    | "FINANCIAL_MODEL"
    | "VALIDATION";
  title: string;
  reference?: string;
  verified?: boolean;
  date?: string;
  owner?: string;
  url?: string;
};

export type Question = {
  id: string;
  prompt: string;
  type:
    | "STRUCTURAL"
    | "GOVERNANCE"
    | "INTEGRATION"
    | "PERFORMANCE"
    | "PROCESS"
    | "COMPLIANCE"
    | "ASSURANCE"
    | "DATA"
    | "SYSTEM"
    | "DECISION_SUPPORT"
    | "FINANCIAL"
    | "LIFECYCLE"
    | "PLANNING"
    | "RESOURCE"
    | "INFORMATION"
    | "CONTROL";
  weight: number;
  isCritical: boolean;
  score: ScoreSet;
  evidenceRequired: boolean;
  evidenceItems?: QuestionEvidence[];
};

export type ElementNode = {
  id: string;
  title: string;
  description?: string;
  sector?: string;
  weight: number;
  score: ScoreSet;
  questions: Question[];
};

export type DomainNode = {
  id: string;
  title: string;
  description?: string;
  weight?: number;
  score: ScoreSet;
  elements: ElementNode[];
};

export type EnterpriseNode = {
  id: string;
  title: string;
  description?: string;
  score: ScoreSet;
  domains: DomainNode[];
};

export type RadialSelectionLevel =
  | "enterprise"
  | "domain"
  | "element"
  | "question";

export type RadialSelection =
  | {
      level: "enterprise";
    }
  | {
      level: "domain";
      id: string;
    }
  | {
      level: "element";
      id: string;
    }
  | {
      level: "question";
      id: string;
      parentElementId?: string;
      parentDomainId?: string;
    };

export type RadialNode = {
  id: string;
  name: string;
  value: number;
  score?: ScoreSet;
  weight?: number;
  nodeType?: RadialSelectionLevel;
  parentId?: string;
  itemStyle?: {
    color?: string;
    opacity?: number;
    shadowBlur?: number;
    shadowColor?: string;
  };
  children?: RadialNode[];
};