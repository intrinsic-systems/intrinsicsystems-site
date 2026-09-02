import {
  RUNTIME_CLAIM_SCHEMA_VERSION,
  type RuntimeClaimRepository,
  type RuntimeClaimStore,
} from "./claimEvidenceTypes";

export const RUNTIME_CLAIM_STORAGE_KEY =
  "oasis.runtime.claim-evidence.v1";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

export function createEmptyRuntimeClaimStore(
  now = new Date().toISOString(),
): RuntimeClaimStore {
  return {
    schemaVersion: RUNTIME_CLAIM_SCHEMA_VERSION,
    claims: [],
    evidenceRecords: [],
    links: [],
    workItems: [],
    auditEvents: [],
    lastSavedAt: now,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDecision(value: unknown) {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.claimId === "string" &&
    typeof value.supportState === "string" &&
    Array.isArray(value.controlConditions) &&
    typeof value.nextAction === "string" &&
    Array.isArray(value.evidenceIds) &&
    typeof value.recordedAt === "string"
  );
}

function isClaim(value: unknown) {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.capabilityId === "string" &&
    typeof value.statement === "string" &&
    typeof value.currentDecisionId === "string" &&
    Array.isArray(value.decisionHistory) &&
    value.decisionHistory.length > 0 &&
    value.decisionHistory.every(isDecision) &&
    value.decisionHistory.some(
      (decision) =>
        isRecord(decision) &&
        decision.id === value.currentDecisionId,
    )
  );
}

function isIdentifiedRecord(value: unknown) {
  return isRecord(value) && typeof value.id === "string";
}

export function isRuntimeClaimStore(
  value: unknown,
): value is RuntimeClaimStore {
  if (!isRecord(value)) return false;

  return (
    value.schemaVersion === RUNTIME_CLAIM_SCHEMA_VERSION &&
    Array.isArray(value.claims) && value.claims.every(isClaim) &&
    Array.isArray(value.evidenceRecords) &&
      value.evidenceRecords.every(isIdentifiedRecord) &&
    Array.isArray(value.links) && value.links.every(isIdentifiedRecord) &&
    Array.isArray(value.workItems) &&
      value.workItems.every(isIdentifiedRecord) &&
    Array.isArray(value.auditEvents) &&
      value.auditEvents.every(isIdentifiedRecord) &&
    typeof value.lastSavedAt === "string"
  );
}

export function migrateRuntimeClaimStore(
  value: unknown,
  now = new Date().toISOString(),
): RuntimeClaimStore | null {
  if (isRuntimeClaimStore(value)) return value;
  if (!isRecord(value)) return null;

  if (
    value.schemaVersion === 0 &&
    Array.isArray(value.claims) &&
    value.claims.every(isClaim)
  ) {
    return {
      ...createEmptyRuntimeClaimStore(now),
      claims: value.claims as RuntimeClaimStore["claims"],
      schemaVersion: RUNTIME_CLAIM_SCHEMA_VERSION,
      auditEvents: [
        {
          id: `audit-migration-${now}`,
          entityType: "store",
          entityId: RUNTIME_CLAIM_STORAGE_KEY,
          action: "migrated",
          summary: "Migrated local Runtime claim data from schema 0 to 1.",
          recordedAt: now,
        },
      ],
    };
  }

  return null;
}

export function createLocalRuntimeClaimRepository({
  storage,
  key = RUNTIME_CLAIM_STORAGE_KEY,
  now = () => new Date().toISOString(),
}: {
  storage: StorageLike;
  key?: string;
  now?: () => string;
}): RuntimeClaimRepository {
  return {
    load() {
      const raw = storage.getItem(key);
      if (!raw) return createEmptyRuntimeClaimStore(now());

      try {
        const parsed: unknown = JSON.parse(raw);
        const migrated = migrateRuntimeClaimStore(parsed, now());
        if (!migrated) throw new Error("Unsupported claim-store schema");
        return migrated;
      } catch {
        const recoveredAt = now();
        storage.setItem(`${key}.recovery.${recoveredAt}`, raw);

        return {
          ...createEmptyRuntimeClaimStore(recoveredAt),
          recoveryNotice:
            "Stored Runtime claim data could not be read. A recoverable copy was preserved and a safe local store was started.",
        };
      }
    },

    save(store) {
      storage.setItem(
        key,
        JSON.stringify({
          ...store,
          schemaVersion: RUNTIME_CLAIM_SCHEMA_VERSION,
          lastSavedAt: now(),
        }),
      );
    },
  };
}
