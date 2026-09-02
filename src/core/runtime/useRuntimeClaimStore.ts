import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createEmptyRuntimeClaimStore,
  createLocalRuntimeClaimRepository,
} from "./runtimeClaimStore";
import {
  requestEvidenceForClaim,
  setEvidenceWorkItemStatus,
  submitEvidenceForWorkItem,
  synchroniseClaimsWithRuntime,
  verifyEvidenceForWorkItem,
} from "./runtimeClaimOrchestration";

import type { CapabilityRuntimeState } from "./runtimeEngine";
import type { RuntimeClaimStore } from "./claimEvidenceTypes";

export function useRuntimeClaimStore(
  capabilities: Record<string, CapabilityRuntimeState>,
  options?: {
    storageKey?: string;
    initialStore?: RuntimeClaimStore;
  },
) {
  const repository = useMemo(() => {
    if (typeof window === "undefined") return null;
    return createLocalRuntimeClaimRepository({
      storage: window.localStorage,
      key: options?.storageKey,
    });
  }, [options?.storageKey]);
  const [store, setStore] = useState<RuntimeClaimStore>(() => {
    const persisted = repository?.load();
    if (persisted && persisted.claims.length > 0) return persisted;
    return options?.initialStore ?? persisted ?? createEmptyRuntimeClaimStore();
  });

  useEffect(() => {
    const persisted = repository?.load();
    const next =
      persisted && persisted.claims.length > 0
        ? persisted
        : options?.initialStore ?? persisted ?? createEmptyRuntimeClaimStore();
    if (next.claims.length > 0) repository?.save(next);
    setStore(next);
  }, [options?.initialStore, repository]);

  const commit = useCallback(
    (update: (current: RuntimeClaimStore) => RuntimeClaimStore) => {
      setStore((current) => {
        const next = update(current);
        if (next !== current) repository?.save(next);
        return next;
      });
    },
    [repository],
  );

  useEffect(() => {
    if (Object.keys(capabilities).length === 0) return;
    commit((current) =>
      synchroniseClaimsWithRuntime(current, capabilities),
    );
  }, [capabilities, commit]);

  return {
    store,
    requestEvidence(claimId: string) {
      commit((current) =>
        requestEvidenceForClaim(current, claimId),
      );
    },
    submitEvidence(workItemId: string) {
      commit((current) =>
        submitEvidenceForWorkItem(
          current,
          workItemId,
          {
            title: "Founder-validated operational evidence",
            evidenceType: "Assurance record",
            source: "Founder sandpit review",
            reference: `LOCAL-${workItemId}`,
            authorityNotes:
              "Recorded locally for bounded Runtime workflow validation; factual authority requires human verification.",
          },
        ),
      );
    },
    beginEvidenceWork(workItemId: string) {
      commit((current) =>
        setEvidenceWorkItemStatus(
          current,
          workItemId,
          "in-progress",
        ),
      );
    },
    rejectEvidence(workItemId: string) {
      commit((current) =>
        setEvidenceWorkItemStatus(
          current,
          workItemId,
          "rejected",
        ),
      );
    },
    verifyEvidence(workItemId: string) {
      commit((current) =>
        verifyEvidenceForWorkItem(current, workItemId),
      );
    },
  };
}
