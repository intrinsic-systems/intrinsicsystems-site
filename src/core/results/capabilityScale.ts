export type CapabilityLevel =
  | "Initial"
  | "Aware"
  | "Developing"
  | "Competent"
  | "Optimising"
  | "Leading";

export function getCapabilityLevel(scorePct: number): CapabilityLevel {
  if (scorePct < 10) return "Initial";
  if (scorePct < 25) return "Aware";
  if (scorePct < 45) return "Developing";
  if (scorePct < 65) return "Competent";
  if (scorePct < 85) return "Optimising";
  return "Leading";
}

export function getCapabilityLevelDescription(scorePct: number): string {
  const level = getCapabilityLevel(scorePct);

  switch (level) {
    case "Initial":
      return "Capability is minimal, reactive, or not yet established.";
    case "Aware":
      return "Capability is recognised but inconsistent and weakly embedded.";
    case "Developing":
      return "Capability is emerging with partial structure and uneven application.";
    case "Competent":
      return "Capability is established and functioning at an operational level.";
    case "Optimising":
      return "Capability is well embedded, measured, and improving with intent.";
    case "Leading":
      return "Capability is strong, integrated, and operating at a leading level.";
    default:
      return "";
  }
}