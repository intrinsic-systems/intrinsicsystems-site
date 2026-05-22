import { buildArcPath } from "./buildArcPath";

type RadialNode = {
  id: string;
  label: string;
  score: number;
  confidence: string;
};

type RadialLink = {
  sourceId: string;
  targetId: string;
  influence: number;
};

type Props = {
  nodes: RadialNode[];
  links: RadialLink[];
};

function getConfidenceOpacity(confidence: string) {
  if (confidence === "high") return 0.52;
  if (confidence === "medium") return 0.36;
  return 0.22;
}

export function RadialRuntimeCanvas({ nodes, links }: Props) {
  const size = 900;
  const center = size / 2;
  const radius = 300;

  const positioned = nodes.map((node, index) => {
    const angle =
      (2 * Math.PI * index) / Math.max(nodes.length, 1) - Math.PI / 2;

    return {
      ...node,
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  });

  const byId = new Map(positioned.map((node) => [node.id, node]));

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 48,
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Radial runtime capability view"
        style={{ width: "100%", maxWidth: size }}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(59,130,246,0.35)"
          strokeWidth={2}
        />

        {/* arcs first */}
        {positioned.map((node, index) => {
          const segment = (2 * Math.PI) / Math.max(nodes.length, 1);
          const startAngle = index * segment - Math.PI / 2;
          const scoreRatio = Math.max(0.05, Math.min(1, node.score / 100));
          const endAngle = startAngle + segment * scoreRatio * 0.92;
          const thickness = 40 + node.score * 0.9;

          return (
            <path
              key={`${node.id}-arc`}
              d={buildArcPath({
                cx: center,
                cy: center,
                innerRadius: 275 - thickness,
                outerRadius: 275,
                startAngle,
                endAngle,
              })}
              fill={`rgba(59,130,246,${getConfidenceOpacity(node.confidence)})`}
              stroke="rgba(96,165,250,0.55)"
              strokeWidth={1}
            />
          );
        })}

        {/* relationship lines second */}
        {links.map((link) => {
          const source = byId.get(link.sourceId);
          const target = byId.get(link.targetId);

          if (!source || !target) return null;

          return (
            <line
              key={`${link.sourceId}-${link.targetId}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="rgba(96,165,250,0.55)"
              strokeWidth={Math.max(2, link.influence * 5)}
            />
          );
        })}

        {/* nodes last */}
        {positioned.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={28}
              fill="#ffffff"
              stroke="#3b82f6"
              strokeWidth={3}
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
      </svg>
    </div>
  );
}