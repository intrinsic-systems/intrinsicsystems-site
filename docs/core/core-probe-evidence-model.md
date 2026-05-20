# CORE → PROBE → EVIDENCE Model

## Purpose

CORE establishes the initial capability baseline.  
PROBE validates uncertain, low-scoring, high-risk, or strategically important capability areas.  
EVIDENCE provides traceability and confidence weighting for executive interpretation.

---

## Data Hierarchy

Domain  
→ Element  
→ Capability  
→ CORE Questions  
→ PROBE Questions  
→ Evidence Types  
→ Weighting  
→ Trigger Logic  
→ Confidence Signal

---

## Example

### Domain 2 — Governance & Decision Systems

**Element:** Governance Structure  
**Capability:** Role Clarity  
**Weight:** High  
**Trigger:** Low score, unclear accountability, high-risk capability

#### CORE Questions

1. Are roles and responsibilities formally defined for key enterprise functions?
2. Are accountabilities consistently understood across teams?
3. Are role boundaries clear where functions overlap?

#### PROBE Questions

1. Are gaps or overlaps in accountability regularly identified?
2. Are role changes reflected in governance documents and systems?
3. Are delegated responsibilities actively monitored?

#### Evidence Types

- Role descriptions
- RACI matrix
- Delegation framework
- Governance charters

#### Confidence Logic

| Condition | Confidence Impact |
|---|---|
| High CORE score + no evidence | Reduce confidence |
| Low CORE score + weak evidence | Confirm risk |
| Medium score + partial evidence | Trigger PROBE |
| High-risk capability + any uncertainty | Trigger PROBE |
| Evidence aligns with response | Increase confidence |

---

## Proposed Answer Structure

```ts
export type CoreAnswer = {
  label: string;
  score: number;
  confidence?: "low" | "medium" | "high";
  evidence?: EvidenceItem[];
  probe?: ProbeResponse[];
  note?: string;
  updatedAt?: string;
};

export type EvidenceItem = {
  type: string;
  label: string;
  provided: boolean;
  strength?: "weak" | "partial" | "strong";
  note?: string;
};

export type ProbeResponse = {
  questionId: string;
  response: string;
  confidenceImpact?: "reduce" | "neutral" | "increase";
};
```

## Trigger Rules
| **Trigger**                | **Action**                    |
| -------------------------- | ----------------------------- |
| Low CORE score             | Ask PROBE questions           |
| High-risk capability       | Ask PROBE questions           |
| High score but no evidence | Request evidence              |
| Low confidence             | Ask PROBE questions           |
| Conflicting responses      | Ask clarification PROBE       |
| Critical domain            | Increase evidence expectation |


---
## **Design Principle**

CORE should remain fast.  
PROBE should be targeted.  
EVIDENCE should be lightweight first, defensible later.

Then run:

```bash
git add docs/core/core-probe-evidence-model.md
git commit -m "Document CORE probe evidence model"
```

After that, we can implement it cleanly without guessing the architecture.