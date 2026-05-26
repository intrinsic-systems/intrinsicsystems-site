export type InfluencePropagationResult = {
  pressure: number;
  adjustedScore: number;
  adjustedConfidence: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function propagateInfluence(
  sourceScore: number,
  targetScore: number,
  targetConfidence: number,
  influence: number,
): InfluencePropagationResult {
  const weakness = 100 - sourceScore;
  const pressure = weakness * influence;

  const scorePenalty = pressure * 0.18;
  const confidencePenalty = pressure * 0.004;

  return {
    pressure,

    adjustedScore: clamp(
      targetScore - scorePenalty,
      0,
      100,
    ),

    adjustedConfidence: clamp(
      targetConfidence - confidencePenalty,
      0,
      1,
    ),
  };
}