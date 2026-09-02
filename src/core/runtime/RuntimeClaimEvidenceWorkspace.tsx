import { useEffect, useMemo, useState } from "react";
import {
  getCurrentClaimDecision,
} from "./runtimeClaimOrchestration";
import { RuntimeConfidenceContext } from "./RuntimeConfidenceArchitecturePanel";

import type { RuntimeClaimStore } from "./claimEvidenceTypes";

type Props = {
  activeCapabilityId: string | null;
  store: RuntimeClaimStore;
  onRequestEvidence(claimId: string): void;
  onSubmitEvidence(workItemId: string): void;
  onVerifyEvidence(workItemId: string): void;
  onBeginEvidenceWork(workItemId: string): void;
  onRejectEvidence(workItemId: string): void;
};

const buttonStyle = {
  border: 0,
  borderRadius: 10,
  padding: "9px 12px",
  background: "#0ea5e9",
  color: "#ffffff",
  fontSize: 12,
  fontWeight: 750,
  cursor: "pointer",
} as const;

export function RuntimeClaimEvidenceWorkspace({
  activeCapabilityId,
  store,
  onRequestEvidence,
  onSubmitEvidence,
  onVerifyEvidence,
  onBeginEvidenceWork,
  onRejectEvidence,
}: Props) {
  const claims = useMemo(
    () =>
      store.claims.filter(
        (claim) => claim.capabilityId === activeCapabilityId,
      ),
    [activeCapabilityId, store.claims],
  );
  const [activeClaimId, setActiveClaimId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setActiveClaimId(claims[0]?.id ?? null);
  }, [activeCapabilityId, claims]);

  if (!activeCapabilityId) {
    return (
      <section style={panelStyle} aria-label="Claim evidence workspace">
        <div style={kickerStyle}>Claim Evidence Workspace</div>
        <div style={titleStyle}>Select a capability</div>
        <p style={bodyStyle}>
          Select a Runtime capability to inspect its persistent claim,
          evidence, decision history and targeted work.
        </p>
      </section>
    );
  }

  const claim =
    claims.find((item) => item.id === activeClaimId) ?? claims[0];
  if (!claim) return null;

  const decision = getCurrentClaimDecision(claim);
  const workItems = store.workItems.filter(
    (item) => item.claimId === claim.id,
  );
  const evidenceIds = new Set(
    store.links
      .filter((link) => link.claimId === claim.id)
      .map((link) => link.evidenceId),
  );
  const evidence = store.evidenceRecords.filter((item) =>
    evidenceIds.has(item.id),
  );

  return (
    <section style={panelStyle} aria-label="Claim evidence workspace">
      <div style={kickerStyle}>Persistent Claim Workspace</div>
      <div style={titleStyle}>{claim.statement}</div>
      <p style={bodyStyle}>{claim.applicability}</p>

      {claims.length > 1 ? (
        <label style={{ ...bodyStyle, display: "grid", gap: 6 }}>
          Claim
          <select
            value={claim.id}
            onChange={(event) => setActiveClaimId(event.target.value)}
          >
            {claims.map((item) => (
              <option key={item.id} value={item.id}>
                {item.statement}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <RuntimeConfidenceContext architecture={decision} />

      <div style={summaryGridStyle}>
        <Summary label="Decision history" value={claim.decisionHistory.length} />
        <Summary label="Linked evidence" value={evidence.length} />
        <Summary label="Open work" value={workItems.filter((item) => item.status !== "verified").length} />
      </div>

      {store.recoveryNotice ? (
        <div role="status" style={noticeStyle}>{store.recoveryNotice}</div>
      ) : null}

      <div style={sectionHeadingStyle}>Targeted evidence work</div>
      {workItems.length === 0 ? (
        <button
          type="button"
          style={buttonStyle}
          onClick={() => onRequestEvidence(claim.id)}
        >
          Create targeted evidence request
        </button>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {workItems.map((item) => (
            <div key={item.id} style={itemStyle}>
              <div style={{ color: "#f8fafc", fontWeight: 700 }}>
                {item.title}
              </div>
              <div style={bodyStyle}>{item.reason}</div>
              <div style={statusStyle}>Status: {item.status}</div>
              {item.status === "requested" ? (
                <button
                  type="button"
                  style={buttonStyle}
                  onClick={() => onBeginEvidenceWork(item.id)}
                >
                  Begin evidence work
                </button>
              ) : null}
              {item.status === "in-progress" ? (
                <button
                  type="button"
                  style={buttonStyle}
                  onClick={() => onSubmitEvidence(item.id)}
                >
                  Record evidence submission
                </button>
              ) : null}
              {item.status === "submitted" ? (
                <button
                  type="button"
                  style={{ ...buttonStyle, background: "#10b981" }}
                  onClick={() => onVerifyEvidence(item.id)}
                >
                  Verify evidence and recalculate claim
                </button>
              ) : null}
              {item.status === "submitted" ? (
                <button
                  type="button"
                  style={{
                    ...buttonStyle,
                    marginLeft: 8,
                    background: "#b45309",
                  }}
                  onClick={() => onRejectEvidence(item.id)}
                >
                  Reject evidence
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <div style={sectionHeadingStyle}>Linked evidence</div>
      {evidence.length === 0 ? (
        <div style={bodyStyle}>No evidence has been linked yet.</div>
      ) : (
        evidence.map((item) => (
          <div key={item.id} style={itemStyle}>
            <div style={{ color: "#f8fafc", fontWeight: 700 }}>
              {item.title}
            </div>
            <div style={bodyStyle}>
              {item.source} · {item.reference}
            </div>
            <div style={statusStyle}>
              Verification: {item.verificationStatus}
            </div>
          </div>
        ))
      )}

      <div style={sectionHeadingStyle}>Decision trail</div>
      <div style={{ display: "grid", gap: 8 }}>
        {[...claim.decisionHistory].reverse().map((snapshot) => (
          <div key={snapshot.id} style={itemStyle}>
            <RuntimeConfidenceContext architecture={snapshot} />
            <div style={bodyStyle}>{snapshot.reason}</div>
          </div>
        ))}
      </div>

      <div style={{ ...bodyStyle, marginTop: 14 }}>
        Stored locally in this browser. External evidence is represented by
        metadata and references only.
      </div>
    </section>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div style={itemStyle}>
      <div style={{ color: "#94a3b8", fontSize: 10 }}>{label}</div>
      <div style={{ color: "#f8fafc", fontSize: 18, fontWeight: 800 }}>
        {value}
      </div>
    </div>
  );
}

const panelStyle = {
  padding: 18,
  borderRadius: 20,
  border: "1px solid rgba(45,212,191,0.32)",
  background: "rgba(15,23,42,0.88)",
  color: "#cbd5e1",
} as const;
const kickerStyle = { color: "#5eead4", fontSize: 12, marginBottom: 8 } as const;
const titleStyle = { color: "#f8fafc", fontWeight: 800, lineHeight: 1.4 } as const;
const bodyStyle = { color: "#94a3b8", fontSize: 12, lineHeight: 1.55 } as const;
const summaryGridStyle = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 12 } as const;
const sectionHeadingStyle = { color: "#99f6e4", fontSize: 12, fontWeight: 750, marginTop: 16, marginBottom: 8 } as const;
const itemStyle = { padding: 10, borderRadius: 10, border: "1px solid rgba(148,163,184,0.16)", background: "rgba(15,23,42,0.58)" } as const;
const statusStyle = { color: "#67e8f9", fontSize: 11, margin: "7px 0" } as const;
const noticeStyle = { marginTop: 10, padding: 10, borderRadius: 10, color: "#fde68a", background: "rgba(120,53,15,0.3)", fontSize: 12 } as const;
