import type {
  RuntimeAttributeValue,
} from "./buildTrustScores";

export type InformationConflict = {
  attribute: string;

  sources: string[];

  severity: "low" | "medium" | "high";

  description: string;
};

export function buildInformationConflicts(
  attributes: RuntimeAttributeValue[],
): InformationConflict[] {
  const grouped =
    new Map<string, RuntimeAttributeValue[]>();

  attributes.forEach((attribute) => {
    const existing =
      grouped.get(attribute.attribute) ?? [];

    existing.push(attribute);

    grouped.set(
      attribute.attribute,
      existing,
    );
  });

  const conflicts: InformationConflict[] = [];

  grouped.forEach((values, attribute) => {
    const uniqueValues =
      new Set(values.map((item) =>
        JSON.stringify(item.value),
      ));

    if (uniqueValues.size <= 1) {
      return;
    }

    conflicts.push({
      attribute,

      sources: values.map(
        (item) => item.source,
      ),

      severity:
        uniqueValues.size > 2
          ? "high"
          : "medium",

      description:
        `Conflicting values detected for ${attribute}.`,
    });
  });

  return conflicts;
}