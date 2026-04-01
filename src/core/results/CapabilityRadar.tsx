import React, { useMemo } from "react";

type CapabilityRadarItem = {
  id: string;
  label: string;
  scorePct: number;
};

type Props = {
  items: CapabilityRadarItem[];
  size?: number;
};

export function CapabilityRadar({
  items,
  size = 420,
}: Props) {
  const chart = useMemo(() => {
    const safeItems = [...items]
      .sort((a, b) => b.scorePct - a.scorePct)
      .slice(0, 6);

    const levels = 5;
    const center = size / 2;
    const outerRadius = size * 0.34;

    const maxScore = Math.max(...safeItems.map((i) => i.scorePct), 0);
    const showCenterBadge = maxScore >= 20;

    const polar = (index: number, radius: number) => {
      const angle =
        -Math.PI / 2 + (index / safeItems.length) * Math.PI * 2;

      return {
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius,
      };
    };

    const rings = Array.from({ length: levels }, (_, i) => {
      const radius = ((i + 1) / levels) * outerRadius;
      return safeItems.map((_, idx) => polar(idx, radius));
    });

    const areaPoints = safeItems.map((item, idx) => {
      const clamped = Math.max(0, Math.min(100, item.scorePct));
      const radius =
        clamped === 0
          ? 0
          : Math.max(outerRadius * 0.12, (clamped / 100) * outerRadius);

      return polar(idx, radius);
    });

    const axes = safeItems.map((_, idx) => ({
      from: { x: center, y: center },
      to: polar(idx, outerRadius),
    }));

    const labels = safeItems.map((item, idx) => {
      const p = polar(idx, outerRadius + 28);
      return { ...p, label: item.label, scorePct: item.scorePct };
    });

    return {
      center,
      rings,
      axes,
      areaPoints,
      labels,
      showCenterBadge,
    };
  }, [items, size]);

  if (!items.length || items.every((i) => i.scorePct === 0)) {
    return (
      <div className="o-capability-radar__empty">
        No capability data available
      </div>
    );
  }

  console.log("CapabilityRadar items", items);

  return (
    <div className="o-capability-radar">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="o-capability-radar__svg"
        role="img"
        aria-label="Capability radar showing current baseline position"
      >
        {chart.rings.map((ring, ringIdx) => (
          <polygon
            key={ringIdx}
            points={ring.map((p) => `${p.x},${p.y}`).join(" ")}
            className="o-capability-radar__grid"
          />
        ))}

        {chart.axes.map((axis, idx) => (
          <line
            key={idx}
            x1={axis.from.x}
            y1={axis.from.y}
            x2={axis.to.x}
            y2={axis.to.y}
            className="o-capability-radar__axis"
          />
        ))}

        <polygon
          points={chart.areaPoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="rgba(19, 119, 201, 0.22)"
          stroke="#1377c9"
          strokeWidth="3"
        />

        {chart.areaPoints.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r={6}
            fill="#1377c9"
            stroke="#ffffff"
            strokeWidth="2"
          />
        ))}

        {chart.showCenterBadge && (
          <>
            <circle
              cx={chart.center}
              cy={chart.center}
              r={12}
              className="o-capability-radar__center"
            />
            <text
              x={chart.center}
              y={chart.center + 4}
              textAnchor="middle"
              className="o-capability-radar__center-label"
            >
              OASIS
            </text>
          </>
        )}
      </svg>

      <div className="o-capability-radar__labels">
        {chart.labels.map((item) => (
          <div key={item.label} className="o-capability-radar__label">
            <span className="o-capability-radar__swatch" />
            <span>
              <strong>{item.label}</strong>
            </span>
            <span>{item.scorePct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}