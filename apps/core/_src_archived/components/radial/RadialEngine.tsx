import React, { useEffect, useMemo, useState } from "react";

export type NodeLevel = "domain" | "element" | "capability";

export type RadialNode = {
  id: string;
  label: string;
  level: NodeLevel;
  parentId?: string;
  value: number;
};

type Props = {
  nodes: RadialNode[];
  size?: number;
  selectedNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
};

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function clampDisplayValue(value: number) {
  return Math.max(1, Math.round(value));
}

export function RadialEngine({
  nodes,
  size = 560,
  selectedNodeId,
  onSelectNode,
}: Props) {
  const [activeParentId, setActiveParentId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!nodes.length) {
      setActiveParentId(undefined);
      return;
    }

    if (!selectedNodeId) {
      setActiveParentId(undefined);
      return;
    }

    const selected = nodes.find((node) => node.id === selectedNodeId);
    if (!selected) {
      setActiveParentId(undefined);
      return;
    }

    const hasChildren = nodes.some((node) => node.parentId === selected.id);

    if (hasChildren) {
      setActiveParentId(selected.id);
      return;
    }

    setActiveParentId(selected.parentId);
  }, [nodes, selectedNodeId]);

  const activeParent = useMemo(
    () => nodes.find((node) => node.id === activeParentId),
    [activeParentId, nodes]
  );

  const activeNodes = useMemo(() => {
    if (!activeParentId) {
      return nodes.filter((node) => node.level === "domain");
    }

    const children = nodes.filter((node) => node.parentId === activeParentId);
    if (children.length) {
      return children;
    }

    const activeNode = nodes.find((node) => node.id === activeParentId);
    if (!activeNode?.parentId) {
      return nodes.filter((node) => node.level === "domain");
    }

    return nodes.filter((node) => node.parentId === activeNode.parentId);
  }, [activeParentId, nodes]);

  const center = size / 2;
  const radius = size * 0.34;
  const angleStep = 360 / Math.max(activeNodes.length, 1);

  const positionedNodes = useMemo(
    () =>
      activeNodes.map((node, index) => {
        const angle = index * angleStep;
        const point = polarToCartesian(center, center, radius, angle);

        return {
          ...node,
          x: point.x,
          y: point.y,
        };
      }),
    [activeNodes, angleStep, center, radius]
  );

  const visibleLevel = activeNodes[0]?.level;

  const centerValue = activeParent
    ? `${clampDisplayValue(activeParent.value)}%`
    : "ECF";

  const centerLabel =
    visibleLevel === "domain"
      ? "Domains"
      : visibleLevel === "element"
      ? "Elements"
      : visibleLevel === "capability"
      ? "Capabilities"
      : "Framework";

  const crumbLabel = activeParent?.label ?? "Enterprise Capability Framework";
  const canBackUp = !!activeParent?.parentId;

  function handleNodeClick(nodeId: string) {
    const clicked = nodes.find((node) => node.id === nodeId);
    if (!clicked) return;

    const hasChildren = nodes.some((node) => node.parentId === clicked.id);

    onSelectNode?.(clicked.id);

    if (hasChildren) {
      setActiveParentId(clicked.id);
    } else {
      setActiveParentId(clicked.parentId);
    }
  }

  function handleBackUp() {
    if (!activeParent?.parentId) return;

    const parentNode = nodes.find((node) => node.id === activeParent.parentId);
    if (!parentNode) return;

    onSelectNode?.(parentNode.id);
    setActiveParentId(parentNode.id);
  }

  return (
    <div className="o-radial-engine">
      <div className="o-radial-engine__toolbar">
        <div className="o-radial-engine__crumb">{crumbLabel}</div>

        {canBackUp && (
          <button
            type="button"
            className="o-btn o-btn--secondary"
            onClick={handleBackUp}
          >
            Back up
          </button>
        )}
      </div>

      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="o-radial-engine__svg"
        role="img"
        aria-label="Interactive enterprise capability radial"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          className="o-radial-engine__ring"
        />
        <circle
          cx={center}
          cy={center}
          r={radius * 0.66}
          className="o-radial-engine__ring"
        />
        <circle
          cx={center}
          cy={center}
          r={radius * 0.33}
          className="o-radial-engine__ring"
        />

        {positionedNodes.map((node) => (
          <line
            key={`axis-${node.id}`}
            x1={center}
            y1={center}
            x2={node.x}
            y2={node.y}
            className="o-radial-engine__axis"
          />
        ))}

        <circle
          cx={center}
          cy={center}
          r="34"
          className="o-radial-engine__center"
        />

        <text
          x={center}
          y={center - 2}
          textAnchor="middle"
          className="o-radial-engine__center-value"
        >
          {centerValue}
        </text>

        <text
          x={center}
          y={center + 16}
          textAnchor="middle"
          className="o-radial-engine__center-label"
        >
          {centerLabel}
        </text>

        {positionedNodes.map((node) => {
          const isSelected = node.id === selectedNodeId;

          return (
            <g
              key={node.id}
              onClick={() => handleNodeClick(node.id)}
              className="o-radial-engine__node-group"
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={isSelected ? 26 : 24}
                className={
                  isSelected
                    ? "o-radial-engine__node o-radial-engine__node--selected"
                    : "o-radial-engine__node"
                }
              />
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                className="o-radial-engine__node-value"
              >
                {clampDisplayValue(node.value)}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="o-radial-engine__labels">
        {positionedNodes.map((node) => {
          const isSelected = node.id === selectedNodeId;

          return (
            <button
              key={node.id}
              type="button"
              className={
                isSelected
                  ? "o-radial-engine__label-card o-radial-engine__label-card--selected"
                  : "o-radial-engine__label-card"
              }
              onClick={() => handleNodeClick(node.id)}
            >
              <div className="o-radial-engine__label-title">{node.label}</div>
              <div className="o-radial-engine__label-meta">
                Current position {clampDisplayValue(node.value)}%
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}