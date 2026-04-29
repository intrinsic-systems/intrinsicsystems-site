import type { EChartsOption } from "echarts";
import type {
  DomainNode,
  ElementNode,
  Question,
  RadialNode,
  ScoreMode,
  ScoreSet,
} from "./orgGovTypes";

export function metricValue(score: ScoreSet, mode: ScoreMode): number {
  if (mode === "variance") {
    return Math.max((score.target ?? 0) - (score.current ?? 0), 0);
  }
  return score[mode] ?? 0;
}

export function scoreBandColor(score: number, mode: ScoreMode): string {
  const bounded = Math.max(0, Math.min(score, 5));

  if (mode === "variance") {
    if (bounded < 0.75) return "#cbd5e1";
    if (bounded < 1.5) return "#93c5fd";
    if (bounded < 2.5) return "#facc15";
    if (bounded < 3.5) return "#f97316";
    return "#ef4444";
  }

  if (bounded < 2.5) return "#ef4444";
  if (bounded < 3.25) return "#f97316";
  if (bounded < 4.0) return "#eab308";
  if (bounded < 4.5) return "#22c55e";
  return "#10b981";
}

function formatScore(value?: number): string {
  return typeof value === "number" ? value.toFixed(1) : "-";
}

function getElementGroup(element: ElementNode): string {
  return element.sector || "Other";
}

function groupBandColor(groupName: string): string {
  switch (groupName) {
    case "Direction & Control":
      return "rgba(59, 130, 246, 0.12)";
    case "Governance & Oversight":
      return "rgba(168, 85, 247, 0.12)";
    case "Compliance & Control":
      return "rgba(245, 158, 11, 0.12)";
    case "Information & Intelligence":
      return "rgba(14, 165, 233, 0.12)";
    case "Operating Model":
      return "rgba(99, 102, 241, 0.12)";
    case "Investment & Resourcing":
      return "rgba(16, 185, 129, 0.12)";
    default:
      return "rgba(100, 116, 139, 0.10)";
  }
}

function questionBandColor(value: number, mode: ScoreMode): string {
  const bounded = Math.max(0, Math.min(value, 5));

  if (mode === "variance") {
    if (bounded < 0.75) return "rgba(203, 213, 225, 0.35)";
    if (bounded < 1.5) return "rgba(147, 197, 253, 0.30)";
    if (bounded < 2.5) return "rgba(250, 204, 21, 0.26)";
    if (bounded < 3.5) return "rgba(249, 115, 22, 0.24)";
    return "rgba(239, 68, 68, 0.22)";
  }

  if (bounded < 2.5) return "rgba(239, 68, 68, 0.18)";
  if (bounded < 3.25) return "rgba(249, 115, 22, 0.18)";
  if (bounded < 4.0) return "rgba(234, 179, 8, 0.18)";
  if (bounded < 4.5) return "rgba(34, 197, 94, 0.18)";
  return "rgba(16, 185, 129, 0.18)";
}

function visibleFloor(value: number, floor = 0.05): number {
  return Math.max(value, floor);
}

function nodeDisplayValue(
  score: ScoreSet,
  mode: ScoreMode,
  weight = 1
): number {
  const base = metricValue(score, mode);
  return visibleFloor(base * weight, 0.05);
}

function toQuestionNode(
  question: Question,
  mode: ScoreMode,
  parentId: string
): RadialNode {
  const modeValue = metricValue(question.score, mode);

  return {
    id: question.id,
    name: question.prompt,
    value: nodeDisplayValue(question.score, mode, question.weight ?? 1),
    weight: question.weight ?? 1,
    nodeType: "question",
    parentId,
    score: question.score,
    itemStyle: {
      color: questionBandColor(modeValue, mode),
    },
  };
}

function toElementNode(
  element: ElementNode,
  mode: ScoreMode,
  includeQuestions: boolean,
  parentId: string
): RadialNode {
  const modeValue = metricValue(element.score, mode);

  const questionNodes = includeQuestions
    ? element.questions.map((q) => toQuestionNode(q, mode, element.id))
    : undefined;

  const questionValueTotal =
    questionNodes?.reduce((sum, q) => sum + q.value, 0) ?? 0;

  const elementValue = includeQuestions
    ? visibleFloor(questionValueTotal, 0.08)
    : nodeDisplayValue(element.score, mode, element.weight ?? 1);

  return {
    id: element.id,
    name: element.title,
    value: elementValue,
    weight: element.weight ?? 1,
    nodeType: "element",
    parentId,
    score: element.score,
    itemStyle: {
      color: scoreBandColor(modeValue, mode),
    },
    children: questionNodes,
  };
}

function buildGroupNode(
  groupName: string,
  elements: ElementNode[],
  mode: ScoreMode,
  includeQuestions: boolean,
  parentId: string
): RadialNode {
  const groupId = `GROUP_${groupName.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}`;

  const elementNodes = elements.map((el) =>
    toElementNode(el, mode, includeQuestions, groupId)
  );

  const groupValue = elementNodes.reduce((sum, el) => sum + el.value, 0);

  const avgCurrent =
    elements.reduce((sum, el) => sum + (el.score.current ?? 0), 0) /
    Math.max(elements.length, 1);

  const avgBenchmark =
    elements.reduce((sum, el) => sum + (el.score.benchmark ?? 0), 0) /
    Math.max(elements.length, 1);

  const avgTarget =
    elements.reduce((sum, el) => sum + (el.score.target ?? 0), 0) /
    Math.max(elements.length, 1);

  const avgVariance =
    elements.reduce((sum, el) => sum + (el.score.variance ?? 0), 0) /
    Math.max(elements.length, 1);

  const avgConfidence =
    elements.reduce((sum, el) => sum + (el.score.confidence ?? 0), 0) /
    Math.max(elements.length, 1);

  return {
    id: groupId,
    name: groupName,
    value: Math.max(groupValue, 0.25),
    weight: elements.reduce((sum, el) => sum + (el.weight ?? 1), 0),
    nodeType: "domain",
    parentId,
    score: {
      current: Number(avgCurrent.toFixed(1)),
      benchmark: Number(avgBenchmark.toFixed(1)),
      target: Number(avgTarget.toFixed(1)),
      variance: Number(avgVariance.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(2)),
    },
    itemStyle: {
      color: groupBandColor(groupName),
    },
    children: elementNodes,
  };
}

export function toSunburstData(
  domain: DomainNode,
  mode: ScoreMode,
  includeQuestions = false
): RadialNode[] {
  const grouped = new Map<string, ElementNode[]>();

  for (const element of domain.elements) {
    const groupName = getElementGroup(element);
    const existing = grouped.get(groupName) ?? [];
    existing.push(element);
    grouped.set(groupName, existing);
  }

  const children: RadialNode[] = Array.from(grouped.entries()).map(
    ([groupName, elements]) =>
      buildGroupNode(groupName, elements, mode, includeQuestions, domain.id)
  );

  const domainValue = children.reduce((sum, group) => sum + group.value, 0);

  return [
    {
      id: domain.id,
      name: domain.title,
      value: Math.max(domainValue, 0.4),
      weight: domain.weight ?? 1,
      nodeType: "enterprise",
      score: domain.score,
      itemStyle: {
        color: "#162033",
      },
      children,
    },
  ];
}

function isSelectedOrAncestor(
  node: RadialNode,
  selectedElementId?: string
): boolean {
  if (!selectedElementId) return false;
  if (node.id === selectedElementId) return true;

  if (Array.isArray(node.children)) {
    return node.children.some((child) =>
      isSelectedOrAncestor(child, selectedElementId)
    );
  }

  return false;
}

function applySelectionState(
  nodes: RadialNode[],
  selectedElementId?: string
): RadialNode[] {
  return nodes.map((node) => {
    const selectedPath = isSelectedOrAncestor(node, selectedElementId);
    const isDirectSelection = node.id === selectedElementId;

    return {
      ...node,
      itemStyle: {
        ...node.itemStyle,
        opacity: !selectedElementId
          ? 1
          : selectedPath
          ? isDirectSelection
            ? 1
            : 0.94
          : 0.16,
        shadowBlur: isDirectSelection ? 18 : selectedPath ? 8 : 0,
        shadowColor: isDirectSelection
          ? "rgba(43, 108, 176, 0.28)"
          : selectedPath
          ? "rgba(43, 108, 176, 0.14)"
          : "transparent",
      },
      children: node.children
        ? applySelectionState(node.children, selectedElementId)
        : undefined,
    };
  });
}

function findNodeById(
  nodes: RadialNode[],
  id: string
): RadialNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

function wrapCenterTitle(
  title: string,
  maxLineLength = 18,
  maxLines = 2
): string {
  const words = title.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxLineLength) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      lines.push(word);
      currentLine = "";
    }

    if (lines.length === maxLines) break;
  }

  if (lines.length < maxLines && currentLine) {
    lines.push(currentLine);
  }

  if (
    lines.length === maxLines &&
    words.join(" ").length > lines.join(" ").length
  ) {
    const last = lines[maxLines - 1];
    lines[maxLines - 1] =
      last.length >= maxLineLength
        ? `${last.slice(0, maxLineLength - 1)}…`
        : `${last}…`;
  }

  return lines.slice(0, maxLines).join("\n");
}

function centreMetricLabel(mode: ScoreMode): string {
  switch (mode) {
    case "current":
      return "Current";
    case "benchmark":
      return "Benchmark";
    case "target":
      return "Target";
    case "variance":
      return "Gap";
    default:
      return "Current";
  }
}

function centreMetricValue(mode: ScoreMode, score: ScoreSet): string {
  switch (mode) {
    case "current":
      return formatScore(score.current);
    case "benchmark":
      return formatScore(score.benchmark);
    case "target":
      return formatScore(score.target);
    case "variance":
      return formatScore(
        Math.max((score.target ?? 0) - (score.current ?? 0), 0)
      );
    default:
      return formatScore(score.current);
  }
}

export function buildOrgGovSunburstOption(
  data: RadialNode[],
  mode: ScoreMode,
  includeQuestions = false,
  selectedElementId?: string
): EChartsOption {
  const displayData = applySelectionState(data, selectedElementId);

  const selectedNode = selectedElementId
    ? findNodeById(displayData, selectedElementId)
    : undefined;

  const root = data[0];
  const activeNode = selectedNode ?? root;

  const centerTitle = wrapCenterTitle(activeNode?.name ?? "Domain Overview");
  const activeScore = activeNode?.score ?? { current: 0 };
  const current = activeScore.current ?? 0;
  const target = activeScore.target ?? 0;
  const gapValue =
    typeof current === "number" && typeof target === "number"
      ? Math.max(target - current, 0)
      : undefined;

  const centreMetric = centreMetricValue(mode, activeScore);
  const centreLabel = centreMetricLabel(mode);
  const gap = typeof gapValue === "number" ? gapValue.toFixed(1) : "-";

  const innerRadius = includeQuestions ? 13 : 15;
  const outerRadius = includeQuestions ? 86 : 82;

  return {
    backgroundColor: "transparent",
    animation: true,
    tooltip: {
      show: false,
    },
    graphic: [
      {
        type: "circle",
        left: "center",
        top: "center",
        silent: true,
        shape: {
          cx: 0,
          cy: 0,
          r: includeQuestions ? 48 : 54,
        },
        style: {
          fill: "#162033",
          stroke: "rgba(184, 201, 227, 0.42)",
          lineWidth: 1.1,
          shadowBlur: 10,
          shadowColor: "rgba(15, 23, 42, 0.08)",
        },
      },
      {
        type: "group",
        left: "center",
        top: "center",
        silent: true,
        bounding: "raw",
        children: [
          {
            type: "text",
            x: 0,
            y: -18,
            style: {
              text: centerTitle,
              fill: "#dbe7f3",
              font: "600 11px Inter, system-ui, sans-serif",
              align: "center",
              textAlign: "center",
              textVerticalAlign: "middle",
              lineHeight: 14,
            },
          },
          {
            type: "text",
            x: 0,
            y: 6,
            style: {
              text: centreMetric,
              fill: "#ffffff",
              font: "700 18px Inter, system-ui, sans-serif",
              align: "center",
              textAlign: "center",
              textVerticalAlign: "middle",
            },
          },
          {
            type: "text",
            x: 0,
            y: 24,
            style: {
              text: centreLabel,
              fill: "#a8bfd7",
              font: "10px Inter, system-ui, sans-serif",
              align: "center",
              textAlign: "center",
              textVerticalAlign: "middle",
            },
          },
          {
            type: "text",
            x: 0,
            y: 38,
            style: {
              text: `Gap ${gap}`,
              fill: "#8da6bf",
              font: "9px Inter, system-ui, sans-serif",
              align: "center",
              textAlign: "center",
              textVerticalAlign: "middle",
            },
          },
        ],
      },
    ],
    series: [
      {
        type: "sunburst",
        data: displayData,
        radius: [`${innerRadius}%`, `${outerRadius}%`],
        center: ["50%", "52%"],
        minAngle: 8,
        sort: undefined,
        nodeClick: false,
        selectedMode: "single",
        emphasis: {
          focus: "ancestor",
          itemStyle: {
            opacity: 0.98,
            shadowBlur: 10,
            shadowColor: "rgba(43, 108, 176, 0.18)",
          },
        },
        blur: {
          itemStyle: {
            opacity: 0.45,
          },
        },
        label: {
          show: false,
        },
        itemStyle: {
          borderColor: "rgba(255, 255, 255, 0.78)",
          borderWidth: 1.2,
          opacity: 0.98,
        },
        levels: [
          {},
          {
            r0: "0%",
            r: includeQuestions ? "12%" : "14%",
            itemStyle: {
              color: "#162033",
              borderWidth: 1.3,
              borderColor: "#ffffff",
            },
          },
          {
            r0: includeQuestions ? "16%" : "18%",
            r: includeQuestions ? "31%" : "33%",
            itemStyle: {
              borderWidth: 1.8,
              borderColor: "rgba(255,255,255,0.92)",
            },
          },
          {
            r0: includeQuestions ? "36%" : "38%",
            r: includeQuestions ? "52%" : "54%",
            itemStyle: {
              borderWidth: 1.8,
              borderColor: "rgba(255,255,255,0.92)",
            },
          },
          ...(includeQuestions
            ? [
                {
                  r0: "57%",
                  r: "71%",
                  itemStyle: {
                    borderWidth: 1.7,
                    borderColor: "rgba(255,255,255,0.90)",
                  },
                },
                {
                  r0: "76%",
                  r: "86%",
                  itemStyle: {
                    borderWidth: 1.4,
                    borderColor: "rgba(255,255,255,0.86)",
                  },
                },
              ]
            : [
                {
                  r0: "60%",
                  r: "82%",
                  itemStyle: {
                    borderWidth: 1.8,
                    borderColor: "rgba(255,255,255,0.92)",
                  },
                },
              ]),
        ],
      },
    ],
  };
}