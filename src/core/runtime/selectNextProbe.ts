import type { RuntimeQuestion } from "./questionRoutingTypes";

export function selectNextProbe(
  questions: RuntimeQuestion[],
): RuntimeQuestion | null {
  return questions[0] ?? null;
}