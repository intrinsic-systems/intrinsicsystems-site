import type { RuntimeAction } from "./buildRuntimeActions";

export type RuntimeActionQueue = {
  actions: RuntimeAction[];
  nextAction: RuntimeAction | null;
};

export function runtimeActionQueue(
  actions: RuntimeAction[],
): RuntimeActionQueue {
  return {
    actions,
    nextAction: actions[0] ?? null,
  };
}