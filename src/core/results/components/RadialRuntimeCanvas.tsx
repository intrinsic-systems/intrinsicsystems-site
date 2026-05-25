import { buildArcPath } from "./buildArcPath";

type RadialNode = {
  id: string;
  label: string;
  score: number;
  confidence: number;
};

type RadialLink = {
  sourceId: string;
  targetId: string;
  influence: number;
};

type Props = {
  nodes: RadialNode[];
  links: RadialLink[];
  enterpriseScore?: number;
};

function getConfidenceOpacity(confidence: number) {
  return 0.16 + confidence * 0.68;
}

function getScoreColor(score: number) {
  if (score >= 85) return "#22c55e";
  if (score >= 70) return "#84cc16";
  if (score >= 50) return "#f59e0b";
  if (score >= 30) return "#f97316";
  return "#ef4444";
}

function getConfidenceThickness(confidence: number) {
  return 22 + confidence * 52;
}

function getRelationshipOpacity(sourceScore: number, targetScore: number) {
  const avgScore = (sourceScore + targetScore) / 2;
  return 0.12 + avgScore / 140;
}

export function RadialRuntimeCanvas({
  nodes,
  links,
  enterpriseScore,
}: Props) {
  const size = 900;
  const center = size / 2;
  const radius = 300;
  const calculatedEnterpriseScore =
    enterpriseScore ??
    nodes.reduce((sum, node) => sum + node.score, 0) /
      Math.max(nodes.length, 1);

  const enterpriseLabel =
    calculatedEnterpriseScore >= 75
      ? "Strong Alignment"
      : calculatedEnterpriseScore >= 50
        ? "Moderate Alignment"
        : calculatedEnterpriseScore >= 30
          ? "Structural Strain"
          : "Critical Weakness";

  const orbitByCapability: Record<string, number> = {
    "gov-role-clarity": 250,
    "gov-decision-rights": 250,
    "gov-escalation-governance": 250,

    "info-asset-information-strategy": 320,

    "lifecycle-planning": 380,
    "risk-ownership": 380,
  };

  const positioned = nodes.map((node, index) => {
    const baseOrbit = orbitByCapability[node.id] ?? radius;
    const orbitRadius = baseOrbit - (100 - node.score) * 0.35;

    const angle =
      (2 * Math.PI * index) / Math.max(nodes.length, 1) - Math.PI / 2;

    return {
      ...node,
      orbitRadius,
      x: center + orbitRadius * Math.cos(angle),
      y: center + orbitRadius * Math.sin(angle),
    };
  });

  const byId = new Map(positioned.map((node) => [node.id, node]));

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 48,
        overflow: "visible",
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Radial runtime capability view"
        style={{ width: "100%", maxWidth: size, overflow: "visible" }}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(59,130,246,0.35)"
          strokeWidth={2}
          style={{
            transition:
              "all 600ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />

        <circle
          cx={center}
          cy={center}
          r={250}
          fill="none"
          stroke="rgba(59,130,246,0.10)"
          strokeWidth={1}
        />

        <circle
          cx={center}
          cy={center}
          r={320}
          fill="none"
          stroke="rgba(59,130,246,0.08)"
          strokeWidth={1}
        />

        <circle
          cx={center}
          cy={center}
          r={380}
          fill="none"
          stroke="rgba(59,130,246,0.06)"
          strokeWidth={1}
        />

        {/* arcs first */}
        {positioned.map((node, index) => {
          const segment = (2 * Math.PI) / Math.max(nodes.length, 1);
          const nodeAngle =
            (2 * Math.PI * index) / Math.max(nodes.length, 1) - Math.PI / 2;

          const scoreRatio = Math.max(0, Math.min(1, node.score / 100));

          if (scoreRatio === 0) return null;

          const arcLength = segment * scoreRatio * 0.92;
          const startAngle = nodeAngle - arcLength / 2;
          const endAngle = nodeAngle + arcLength / 2;
          const thickness = getConfidenceThickness(node.confidence);

          return (
            <path
              key={`${node.id}-arc`}
              d={buildArcPath({
                cx: center,
                cy: center,
                innerRadius: node.orbitRadius - thickness / 2,
                outerRadius: node.orbitRadius + thickness / 2,
                startAngle,
                endAngle,
              })}
              fill={getScoreColor(node.score)}
              fillOpacity={getConfidenceOpacity(node.confidence)}
              stroke={getScoreColor(node.score)}
              strokeWidth={1}
              style={{
                transition:
                "all 600ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          );
        })}

        {/* relationship lines second */}
        {links.map((link) => {
          const source = byId.get(link.sourceId);
          const target = byId.get(link.targetId);

          if (!source || !target) return null;

          const opacity = getRelationshipOpacity(source.score, target.score);

          return (
            <line
              key={`${link.sourceId}-${link.targetId}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke={`rgba(148,163,184,${opacity})`}
              strokeWidth={1 + link.influence * 4}
              style={{
                transition:
                "all 600ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              strokeLinecap="round"
            />
          );
        })}

        {/* nodes last */}
        {positioned.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={28 + node.score * 0.22}
              fill={getScoreColor(node.score)}
              opacity={node.score > 0 ? 0.16 : 0.05}
            />

            <circle
              cx={node.x}
              cy={node.y}
              r={18 + node.score * 0.18}
              fill="#ffffff"
              stroke={getScoreColor(node.score)}
              strokeWidth={3}
              style={{
                transition:
                "all 420ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />

            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill="#0f172a"
            >
              {Math.round(node.score)}
            </text>

            <text
              x={node.x}
              y={node.y + 48}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="#e2e8f0"
            >
              {node.label}
            </text>
          </g>
        ))}
        <g>
          <circle
            cx={center}
            cy={center}
            r={82}
            fill="rgba(15,23,42,0.92)"
            stroke="rgba(96,165,250,0.28)"
            strokeWidth={2}
            style={{
              transition:
              "all 600mall 420ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />

          <text
            x={center}
            y={center - 20}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#94a3b8"
          >
            Enterprise Coherence
          </text>

          <text
            x={center}
            y={center + 8}
            textAnchor="middle"
            fontSize="30"
            fontWeight="800"
            fill="#f8fafc"
          >
            {Math.round(calculatedEnterpriseScore)}
          </text>

          <text
            x={center}
            y={center + 32}
            textAnchor="middle"
            fontSize="11"
            fill="#94a3b8"
          >
            {enterpriseLabel}
          </text>
        </g>
      </svg>
    </div>
  );
}