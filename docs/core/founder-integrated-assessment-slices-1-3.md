# Founder sandpit assessment: Delivery Slices 1–3

**Assessment date:** 2 September 2026

**Scenario:** Northstar Regional Utilities — upgraded substation handover, governance change and asset-management platform transition

**Status:** Integrated engineering assessment passed; final product acceptance remains provisional pending the dedicated experience review.

## Founder summary

The Runtime foundation now behaves as one connected mechanism. Realistic assessment inputs created six linked capability claims. Those claims retained separate Support State, Control Condition and Next Action decisions; shared evidence could support more than one claim; targeted work followed the claim’s current action; verified evidence recalculated only its linked claim; Runtime alerts and actions reflected persisted decisions; and the local record survived browser reload and application restart.

The assessment did not show a data-integrity failure. It did show that the interface is not yet ready to carry the whole explanation unaided. A founder can reach and operate the mechanism, but must infer why assessment inputs became claims, why propagation changed some decisions, how one evidence item is shared, and how the different panels relate. This is why component-level success is not final product acceptance.

## Journey exercised

1. Entered a realistic six-capability assessment data set covering governance, risk, lifecycle and asset information.
2. Generated linked Runtime claims with Qualified, Sufficient, Provisional and Unsupported support.
3. Applied Contested, Stale and Material change controls without replacing Support State.
4. Linked an approved operating model to two claims, an expired engineering report to Lifecycle Planning, and a current policy affected by platform change to Asset Information Strategy.
5. Created targeted work to resolve contestation, strengthen or collect evidence, refresh stale evidence and run change detection.
6. Submitted a draft risk register and confirmed that submission alone did not improve support.
7. Verified that evidence in the browser. Risk Ownership moved from Unsupported to Qualified and gained a linked decision-history snapshot.
8. Compared all five unrelated claims before and after verification. None changed.
9. Reloaded the browser, restarted the application and reloaded again. The verified evidence, work status and decision history remained intact.
10. Read the resulting alerts, recommended actions, adaptive probe, evidence requirements and founder-facing interpretation.

## Assessment results

| Area | Result | Evidence |
|---|---|---|
| Slice 1 confidence separation | Pass | Support, Control and Action remained independent through all six claims. |
| Slice 2 Runtime carriage | Pass | Alerts and actions carried claim-aware confidence architecture; the founder view prioritised contestation, stale evidence, material change and weak support. |
| Slice 3 claim persistence | Pass | Six claims, four evidence records, four initial links, five work items and decision histories persisted locally. |
| Shared evidence | Pass with presentation caveat | One operating-model record was linked to Role Clarity and Decision Rights, but the interface does not make that reuse obvious. |
| Submitted versus verified evidence | Pass | The draft risk register remained Unsupported while submitted and moved to Qualified only after verification. |
| Targeted recalculation | Pass | Five unrelated claims were unchanged when Risk Ownership recalculated. |
| Reload and restart | Pass | Risk Ownership remained Qualified with verified evidence and two decisions after reload and server restart. |
| Policy validation | Pass | Confidence-architecture validation and all 11 claim-persistence acceptance tests passed. |
| Production build | Pass with warning | TypeScript and Vite production build passed; Vite reported the existing JavaScript chunk above 500 kB. |
| Browser runtime | Pass | Desktop founder workflow completed with no browser console errors. |
| Complete assessment-input traceability | Fail | Inputs are supplied to Runtime, but the founder dashboard does not show their source, answer or transformation into a claim. |
| Final product acceptance | Provisional | The mechanism is credible, but the full UX/UI, explanatory-graphics, accessibility and overall-experience gate remains outstanding. |

## Findings to carry into the dedicated experience review

### Friction

- There is no visible founder-sandpit entry point for this integrated scenario; it currently requires the scenario URL.
- Selecting a capability is required before the claim workspace explains anything, but the radial view does not clearly teach that interaction.
- The action queue and claim workspace are independently scrollable, so important evidence and history can sit below the visible founder view.
- Repeated Support–Control–Action text increases reading load without establishing a clearer hierarchy.

### Ambiguity and missing context

- The screen does not connect an assessment answer to its Runtime mutation, claim statement, propagated score and current claim decision.
- Propagation changed Decision Rights from Sufficient to Qualified and Escalation Governance from Provisional to Unsupported. The decision trail records this, but does not explain the upstream influence or calculation in founder language.
- Shared evidence appears as a normal single record within each claim; there is no “also supports” relationship view.
- Evidence materiality, relationship and authority notes exist in the data but are mostly absent from the founder interpretation.
- A completed work item retains its original request wording after verification. That is historically accurate, but the distinction between past request and current state needs clearer labelling.

### Potentially misleading presentation

- The generic Required Evidence panel is driven by a fixed substation-handover context. When Role Clarity is selected, it still recommends as-built, condition and critical-asset evidence, which can look like claim-specific guidance even though it is not.
- The queue contains both trigger alerts and confidence actions for closely related problems, producing duplicate-looking recommendations without explaining their different sources.
- “Active Risks” counts Runtime alerts, not enterprise risks; the label may overstate what the number represents.
- A verified shared evidence record does not automatically appear in the original decision snapshot’s evidence list, making the visible evidence and historic decision basis feel disconnected.

### Visual, interaction and accessibility evidence

- At 1280 × 720 the dashboard required substantial vertical reading, while the primary radial and queue region fixed its internal height at 680 pixels.
- All six radial capability groups were pointer-interactive, but none was keyboard focusable and none had an accessible name.
- Small radial labels and low-contrast secondary text make comparison difficult, particularly for longer capability names.
- The active capability is visible through colour and emphasis, but the interface lacks a persistent textual “selected capability” heading beside the radial.
- No browser console errors occurred; these are interaction and comprehension issues, not runtime crashes.

## Recommended UX/UI and explanatory-graphics workstream

1. **Journey and traceability:** show the chain from assessment input → affected capability → propagation → claim decision → evidence → next action.
2. **Claim relationship graphic:** introduce a compact, accessible claim–evidence map that clearly identifies shared evidence, materiality, contestation, staleness and material change.
3. **Founder explanation layer:** add plain-language “why this changed” and “what happens next” explanations, including the difference between an alert, a control and an action.
4. **Action hierarchy:** group and deduplicate alert-derived and confidence-derived work while preserving their provenance.
5. **Context correctness:** make evidence requirements depend on the selected claim and clearly label enterprise-wide guidance when it is not claim-specific.
6. **Accessibility:** make radial capabilities keyboard operable and named, provide visible focus, validate contrast and support a non-visual equivalent of the relationship view.
7. **Layout and responsive behaviour:** reduce nested scrolling, keep the selected claim and current decision visible, and test founder workflows at desktop, tablet and narrow widths.
8. **Full experience review:** repeat this complete scenario after the Runtime foundation is connected to the actual founder assessment-input journey, then conduct the dedicated UX/UI, explanatory-graphics, accessibility and overall-experience review. Do not use component-level validation as final acceptance.

## Validation record

- `npm run assess:founder-sandpit` — passed.
- `npm run validate:runtime-confidence` — passed.
- `npm run validate:runtime-claims` — 11 of 11 passed.
- `npm run build` — passed, with the existing chunk-size warning.
- Founder browser journey — passed on desktop; no console errors.
- Persistence — passed across reload and application restart.
- Recalculation isolation — passed for all five unrelated claims.

## Acceptance position

Approve Slices 1–3 as an integrated technical foundation. Keep founder-product acceptance provisional. The next bounded delivery should be the dedicated UX/UI and explanatory-graphics workstream above, informed by this complete assessment and followed by another end-to-end founder review.
