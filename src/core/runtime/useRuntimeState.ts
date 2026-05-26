import { useMemo, useState } from "react";

import {
  applyRuntimeMutation,
  type EnterpriseRuntimeState,
  type RuntimeAnswerMutation,
} from "./runtimeEngine";

export function useRuntimeState() {
  const [runtime, setRuntime] =
    useState<EnterpriseRuntimeState>({
      capabilities: {},
      enterpriseScore: 0,
      triggers: [],
    });

  function mutate(
    mutation: RuntimeAnswerMutation,
  ) {
    setRuntime((current) =>
      applyRuntimeMutation(
        current,
        mutation,
      ),
    );
  }

  const capabilityList = useMemo(() => {
    return Object.values(runtime.capabilities);
  }, [runtime]);

  const enterpriseScore = useMemo(() => {
    if (capabilityList.length === 0) {
      return 0;
    }

    return (
      capabilityList.reduce(
        (sum, item) => sum + item.score,
        0,
      ) / capabilityList.length
    );
  }, [capabilityList]);

  return {
    runtime,

    capabilityList,

    enterpriseScore,

    mutate,
  };
}