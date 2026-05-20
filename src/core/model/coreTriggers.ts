import type {
  CoreAnswer,
  TriggerType,
} from "./coreModel";

export function determineTriggers(
  answer: CoreAnswer
): TriggerType[] {
  const triggers: TriggerType[] = [];

  const score = answer.score ?? 0;

  if (score < 35) {
    triggers.push("low-score");
  }

  if (!answer.evidence?.length) {
    triggers.push("missing-evidence");
  }

  if (answer.confidence === "low") {
    triggers.push("low-confidence");
  }

  return triggers;
}