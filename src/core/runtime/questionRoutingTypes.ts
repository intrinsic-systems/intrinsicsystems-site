export type RuntimeQuestionReason =
  | "low-score"
  | "low-confidence"
  | "evidence-gap"
  | "dependency-risk";

export type RuntimeQuestion = {
  id: string;
  capabilityId: string;
  priority: number;
  reason: RuntimeQuestionReason;
  question: string;
};