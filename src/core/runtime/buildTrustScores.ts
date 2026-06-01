import {
  systemAuthorityMap,
  type AuthoritySource,
} from "./systemAuthorityMap";

export type RuntimeAttributeValue = {
  attribute: string;

  source: AuthoritySource;

  value: unknown;

  sourceConfidence?: number;
};

export type AttributeTrustScore = {
  attribute: string;

  trusted: boolean;

  trustScore: number;

  authoritativeSource?: AuthoritySource;

  actualSource: AuthoritySource;
};

export function buildTrustScores(
  attributes: RuntimeAttributeValue[],
): AttributeTrustScore[] {
  return attributes.map((attribute) => {
    const authority =
      systemAuthorityMap.find(
        (item) =>
          item.attribute === attribute.attribute,
      );

    const authoritativeSource =
      authority?.authoritativeSource;

    const baseWeight =
      authority?.confidenceWeight ?? 0.5;

    const sourceConfidence =
      attribute.sourceConfidence ?? 0.5;

    const trusted =
      authoritativeSource === attribute.source;

    const trustScore =
      baseWeight * sourceConfidence;

    return {
      attribute: attribute.attribute,

      trusted,

      trustScore,

      authoritativeSource,

      actualSource: attribute.source,
    };
  });
}