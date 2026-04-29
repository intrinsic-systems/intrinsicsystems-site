import React, { useMemo } from "react";

type CapabilityRadarItem = {
  id: string;
  label: string;
  currentPct: number;
  benchmarkPct?: number;
  targetPct?: number;
  corePct?: number;
};

export type CapabilityRadarInsightKey =
  | "current"
  | "benchmark"
  | "target"
  | "core";

type Props = {
  items: CapabilityRadarItem[];
  size?: number;
  maxItems?: number;
  onLegendSelect?: (key: CapabilityRadarInsightKey) => void;
  activeLegendKey?: CapabilityRadarInsightKey | null;
};

type Point = {
  x: number;
  y: number;
};

type AxisLabelAnchor = "start" | "middle" | "end";

function clampPct(value?: number) {
  return Math.max(0, Math.min(100, value ?? 0));
}

function polygonPoints(points: Point[]) {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

function formatRadarLabel(label: string) {
  return label
    .replace(/Asset Management/g, "AM")
    .replace(/Defined Roles & Responsibilities/g, "Defined Roles")
    .replace(/Critical Asset Identification/g, "Critical Assets")
    .replace(/Decision Authority Clarity/g, "Decision Authority")
    .replace(/Accountability Traceability/g, "Accountability")
    .trim();
}

function splitRadarLabel(label: string, maxLineLength = 16) {
  const formatted = formatRadarLabel(label);

  if (formatted.length <= maxLineLength) {
    return [formatted];
  }

  const words = formatted.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const next = currentLine ? `${currentLine} ${word}` : word;

    if (next.length <= maxLineLength) {
      currentLine = next;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);

  return lines.slice(0, 2);
}

export function CapabilityRadar({
  items,
  size = 460,
  maxItems = 6,
  onLegendSelect,
  activeLegendKey = null,
}: Props) {
  const chart = useMemo(() => {
    const safeItems = [...items].slice(0, maxItems);

    if (!safeItems.length) {
      return null;
    }

    const levels = 5;
    const center = size / 2;
    const outerRadius = size * 0.34;
    const baseLabelRadius = outerRadius + 22;

    const polar = (index: number, radius: number): Point => {
      const angle = -Math.PI / 2 + (index / safeItems.length) * Math.PI * 2;

      return {
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius,
      };
    };

    const ringRadii = Array.from({ length: levels }, (_, i) => {
      return ((i + 1) / levels) * outerRadius;
    });

    const axes = safeItems.map((item, idx) => {
      const angle = -Math.PI / 2 + (idx / safeItems.length) * Math.PI * 2;
      const verticalBias = Math.abs(Math.sin(angle));
      const adjustedRadius = baseLabelRadius - verticalBias * 6;

      const axisPoint = polar(idx, outerRadius);
      const labelPoint = polar(idx, adjustedRadius);

      let textAnchor: AxisLabelAnchor = "middle";
      if (labelPoint.x < center - 16) textAnchor = "end";
      if (labelPoint.x > center + 16) textAnchor = "start";

      let dy = 0;
      if (Math.abs(labelPoint.x - center) < 18) {
        dy = labelPoint.y < center ? -6 : 10;
      }

      return {
        id: item.id,
        labelLines: splitRadarLabel(item.label),
        from: { x: center, y: center },
        to: axisPoint,
        labelPoint,
        textAnchor,
        dy,
      };
    });

    const makeSeriesPoints = (
      valueKey: "currentPct" | "benchmarkPct" | "targetPct" | "corePct",
      minRadius = outerRadius * 0.06
    ) =>
      safeItems.map((item, idx) => {
        const clamped = clampPct(item[valueKey]);
        const radius =
          clamped === 0 ? 0 : Math.max(minRadius, (clamped / 100) * outerRadius);

        return polar(idx, radius);
      });

    const currentPoints = makeSeriesPoints("currentPct");
    const benchmarkPoints = makeSeriesPoints("benchmarkPct");
    const targetPoints = makeSeriesPoints("targetPct");
    const corePoints = makeSeriesPoints("corePct");

    const labels = safeItems.map((item) => ({
      label: item.label,
      currentPct: clampPct(item.currentPct),
      benchmarkPct: clampPct(item.benchmarkPct),
      targetPct: clampPct(item.targetPct),
      corePct: clampPct(item.corePct),
    }));

    return {
      center,
      ringRadii,
      axes,
      labels,
      currentPoints,
      benchmarkPoints,
      targetPoints,
      corePoints,
    };
  }, [items, maxItems, size]);

  if (!chart || !items.length) {
    return (
      <div className="o-capability-radar__empty">
        No capability data available
      </div>
    );
  }

  const legendItems: Array<{
    key: CapabilityRadarInsightKey;
    label: string;
    swatchClass: string;
  }> = [
    {
      key: "current",
      label: "Current",
      swatchClass: "o-capability-radar__legend-swatch--current",
    },
    {
      key: "benchmark",
      label: "Benchmark",
      swatchClass: "o-capability-radar__legend-swatch--benchmark",
    },
    {
      key: "target",
      label: "Target",
      swatchClass: "o-capability-radar__legend-swatch--target",
    },
    {
      key: "core",
      label: "CORE",
      swatchClass: "o-capability-radar__legend-swatch--core",
    },
  ];

  return (
    <div className="o-capability-radar">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="o-capability-radar__svg"
        role="img"
        aria-label="Capability radar comparing current, benchmark, target, and CORE positions"
      >
        {chart.ringRadii.map((radius, idx) => (
          <circle
            key={idx}
            cx={chart.center}
            cy={chart.center}
            r={radius}
            className="o-capability-radar__ring"
          />
        ))}

        {chart.axes.map((axis) => (
          <line
            key={axis.id}
            x1={axis.from.x}
            y1={axis.from.y}
            x2={axis.to.x}
            y2={axis.to.y}
            className="o-capability-radar__axis"
          />
        ))}

        {chart.axes.map((axis) => (
          <text
            key={`${axis.id}-label`}
            x={axis.labelPoint.x}
            y={axis.labelPoint.y + axis.dy}
            textAnchor={axis.textAnchor}
            className="o-capability-radar__axis-label"
          >
            {axis.labelLines.map((line, lineIdx) => (
              <tspan
                key={`${axis.id}-line-${lineIdx}`}
                x={axis.labelPoint.x}
                dy={lineIdx === 0 ? 0 : 10}
              >
                {line}
              </tspan>
            ))}
          </text>
        ))}

        <polygon
          points={polygonPoints(chart.targetPoints)}
          className="o-capability-radar__series o-capability-radar__series--target"
        />

        <polygon
          points={polygonPoints(chart.benchmarkPoints)}
          className="o-capability-radar__series o-capability-radar__series--benchmark"
        />

        <polygon
          points={polygonPoints(chart.corePoints)}
          className="o-capability-radar__series o-capability-radar__series--core"
        />

        <polygon
          points={polygonPoints(chart.currentPoints)}
          className="o-capability-radar__series o-capability-radar__series--current"
        />

        {chart.currentPoints.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r={4}
            className="o-capability-radar__point"
          />
        ))}

        <circle
          cx={chart.center}
          cy={chart.center}
          r={2}
          className="o-capability-radar__center-dot"
        />
      </svg>

      <div className="o-capability-radar__legend">
        {legendItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={[
              "o-capability-radar__legend-row",
              activeLegendKey === item.key
                ? "o-capability-radar__legend-row--active"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onLegendSelect?.(item.key)}
          >
            <span
              className={[
                "o-capability-radar__legend-swatch",
                item.swatchClass,
              ].join(" ")}
            />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="o-capability-radar__labels">
        {chart.labels.map((item) => (
          <div key={item.label} className="o-capability-radar__label">
            <div className="o-capability-radar__label-title">
              {formatRadarLabel(item.label)}
            </div>
            <div className="o-capability-radar__label-values">
              <span>C {item.currentPct}%</span>
              <span>B {item.benchmarkPct}%</span>
              <span>T {item.targetPct}%</span>
              <span>O {item.corePct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}