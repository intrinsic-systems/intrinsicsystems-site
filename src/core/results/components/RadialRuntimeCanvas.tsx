import { buildArcPath } from "./buildArcPath";
import type { RuntimeHeatmapNode } from "../../runtime/runtimeHeatmap";

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
  activeCapabilityId?: string | null;
  relatedCapabilityIds?: string[];
  onCapabilityFocus?: (capabilityId: string | null) => void;
  heatmap?: RuntimeHeatmapNode[];
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
  activeCapabilityId,
  relatedCapabilityIds = [],
  onCapabilityFocus,
  heatmap = [],
}: Props) {
  const size = 1000;
  const centerX = size / 2;
  const centerY = size / 2 - 40;
  const radius = 340;
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
    "gov-role-clarity": 280,
    "gov-decision-rights": 280,
    "gov-escalation-governance": 280,

    "info-asset-information-strategy": 350,

    "lifecycle-planning": 400,
    "risk-ownership": 400,
  };

  const positioned = nodes.map((node, index) => {
    const baseOrbit = orbitByCapability[node.id] ?? radius;
    const orbitRadius = baseOrbit - (100 - node.score) * 0.35;

    const angle =
      (2 * Math.PI * index) / Math.max(nodes.length, 1) - Math.PI / 2;

    return {
      ...node,
      orbitRadius,
      x: centerX + orbitRadius * Math.cos(angle),
      y: centerY + orbitRadius * Math.sin(angle),
    };
  });

  const byId = new Map(positioned.map((node) => [node.id, node]));

  const heatByCapability = new Map(
    heatmap.map((item) => [item.capabilityId, item]),
  );

  function getHeatOpacity(capabilityId: string) {
    const heat = heatByCapability.get(capabilityId);

    if (!heat) {
      return 0;
    }

    return Math.min(0.42, heat.heat / 240);
  }

  function getHeatStroke(capabilityId: string) {
    const heat = heatByCapability.get(capabilityId);

    if (!heat) {
      return "rgba(96,165,250,0)";
    }

    if (heat.level === "critical") {
      return "rgba(239,68,68,0.62)";
    }

    if (heat.level === "high") {
      return "rgba(249,115,22,0.56)";
    }

    if (heat.level === "medium") {
      return "rgba(245,158,11,0.46)";
    }

    return "rgba(59,130,246,0.30)";
  }

  const hasActiveFocus = Boolean(activeCapabilityId);

  function isCapabilityRelated(id: string) {
    if (!hasActiveFocus) {
      return true;
    }

    return relatedCapabilityIds.includes(id);
  }

  function isLinkRelated(link: RadialLink) {
    if (!hasActiveFocus) {
      return true;
    }

    return (
      relatedCapabilityIds.includes(link.sourceId) &&
      relatedCapabilityIds.includes(link.targetId)
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        overflow: "visible",
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Radial runtime capability view"
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "100%",
          overflow: "visible",
        }}
      >
        <circle
          cx={centerX}
          cy={centerY}
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
          cx={centerX}
          cy={centerY}
          r={280}
          fill="none"
          stroke="rgba(59,130,246,0.10)"
          strokeWidth={1}
        />

        <circle
          cx={centerX}
          cy={centerY}
          r={350}
          fill="none"
          stroke="rgba(59,130,246,0.08)"
          strokeWidth={1}
        />

        <circle
          cx={centerX}
          cy={centerY}
          r={400}
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

          const isRelated = isCapabilityRelated(node.id);

          return (
            <path
              key={`${node.id}-arc`}
              d={buildArcPath({
                cx: centerX,
                cy: centerY,
                innerRadius: node.orbitRadius - thickness / 2,
                outerRadius: node.orbitRadius + thickness / 2,
                startAngle,
                endAngle,
              })}
              fill={getScoreColor(node.score)}
              fillOpacity={
                isRelated
                  ? getConfidenceOpacity(node.confidence)
                  : 0.06
              }
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
          const related = isLinkRelated(link);

          return (
            <line
              key={`${link.sourceId}-${link.targetId}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke={`rgba(148,163,184,${related ? opacity : 0.08})`}
              strokeWidth={related ? 1 + link.influence * 4 : 1}
              style={{
                transition:
                "all 600ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              strokeLinecap="round"
            />
          );
        })}

        {/* nodes last */}
        {positioned.map((node) => {
          const isRelated = isCapabilityRelated(node.id);
          const isActive = node.id === activeCapabilityId;

          return (
            <g
              key={node.id}
              opacity={isRelated ? 1 : 0.18}
              style={{
                cursor: "pointer",
                transition:
                  "all 420ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              onMouseEnter={() => onCapabilityFocus?.(node.id)}
              onClick={() => onCapabilityFocus?.(node.id)}
            >
            <circle
              cx={node.x}
              cy={node.y}
              r={46 + node.score * 0.22}
              fill={getScoreColor(node.score)}
              opacity={getHeatOpacity(node.id)}
              stroke={getHeatStroke(node.id)}
              strokeWidth={isActive ? 4 : 2}
              style={{
                transition:
                  "all 520ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
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
          );
        })}
        <g>
          <circle
            cx={centerX}
            cy={centerY}
            r={82}
            fill="rgba(15,23,42,0.92)"
            stroke="rgba(96,165,250,0.28)"
            strokeWidth={2}
            style={{
              transition:
                "all 420ms cubic-bezier(0.22, 1, 0.36, 1)",

              animation:
                "runtimePulse 6s ease-in-out infinite",
            }}
          />

          <text
            x={centerX}
            y={centerY - 20}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#94a3b8"
          >
            Enterprise Coherence
          </text>

          <text
            x={centerX}
            y={centerY + 8}
            textAnchor="middle"
            fontSize="30"
            fontWeight="800"
            fill="#f8fafc"
          >
            {Math.round(calculatedEnterpriseScore)}
          </text>

          <text
            x={centerX}
            y={centerY + 32}
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
