import { buildQuestionQueue } from "./buildQuestionQueue";
import { selectNextProbe } from "./selectNextProbe";

import type { EnterpriseRuntimeState } from "./runtimeEngine";

export function runtimeQuestionRouter(
  runtime: EnterpriseRuntimeState,
) {
  const queue = buildQuestionQueue(runtime);
  const next = selectNextProbe(queue);

  return {
    queue,
    next,
  };
}