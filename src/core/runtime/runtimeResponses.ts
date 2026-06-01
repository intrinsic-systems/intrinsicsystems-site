export type RuntimeResponseSignal =
  | "asset-data-incomplete"
  | "condition-data-untrusted"
  | "authority-handover-gap"
  | "ownership-unclear"
  | "process-not-followed"
  | "system-conflict"
  | "evidence-missing"
  | "confidence-low";

export type ProbeResponse = {
  probeId: string;
  answer: string;
  scoreImpact?: number;
  confidenceImpact?: number;
  evidenceProvided?: boolean;
  signals?: RuntimeResponseSignal[];
};

export type RuntimeUserResponse = {
  capabilityId: string;
  probeId: string;
  responseText: string;
  signals: RuntimeResponseSignal[];
  timestamp?: string;
  confidence?: number;
  evidenceProvided?: boolean;
};

export function interpretRuntimeResponse(
  responseText: string,
): RuntimeResponseSignal[] {
  const text = responseText.toLowerCase();

  const signals = new Set<RuntimeResponseSignal>();

  if (
    text.includes("asset data") ||
    text.includes("asset register") ||
    text.includes("incomplete data")
  ) {
    signals.add("asset-data-incomplete");
  }

  if (
    text.includes("condition") ||
    text.includes("inspection")
  ) {
    signals.add("condition-data-untrusted");
  }

  if (
    text.includes("handover") ||
    text.includes("as-built")
  ) {
    signals.add("authority-handover-gap");
  }

  if (
    text.includes("owner") ||
    text.includes("ownership")
  ) {
    signals.add("ownership-unclear");
  }

  if (
    text.includes("conflict") ||
    text.includes("doesn't match") ||
    text.includes("does not match")
  ) {
    signals.add("system-conflict");
  }

  if (
    text.includes("evidence") ||
    text.includes("missing")
  ) {
    signals.add("evidence-missing");
  }

  if (
    text.includes("unsure") ||
    text.includes("unknown") ||
    text.includes("not confident")
  ) {
    signals.add("confidence-low");
  }

  return Array.from(signals);
}