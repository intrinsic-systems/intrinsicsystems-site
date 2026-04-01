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
  if (mode === "variance") return Math.abs(score.variance ?? 0);
  return score[mode] ?? 0;
}

export function scoreBandColor(score: number): string {
  const bounded = Math.max(0, Math.min(score, 5));
  const t = bounded / 5;

  if (bounded < 2.5) {
    const opacity = 0.68 + t * 0.22;
    return `rgba(180, 35, 24, ${opacity})`;
  }

  if (bounded < 3.25) return "#d97706";
  if (bounded < 4.0) return "#7c8b2a";
  if (bounded < 4.5) return "#2f6f57";
  return "#1f8a70";
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
      return "rgba(59, 130, 246, 0.18)";
    case "Governance & Oversight":
      return "rgba(168, 85, 247, 0.18)";
    case "Compliance & Control":
      return "rgba(245, 158, 11, 0.18)";
    case "Information & Intelligence":
      return "rgba(14, 165, 233, 0.18)";
    case "Operating Model":
      return "rgba(99, 102, 241, 0.18)";
    case "Investment & Resourcing":
      return "rgba(16, 185, 129, 0.18)";
    default:
      return "rgba(71, 85, 105, 0.18)";
  }
}

function questionBandColor(modeValue: number): string {
  const bounded = Math.max(0, Math.min(modeValue, 5));

  if (bounded < 2.5) return "rgba(180, 35, 24, 0.20)";
  if (bounded < 3.25) return "rgba(217, 119, 6, 0.20)";
  if (bounded < 4.0) return "rgba(124, 139, 42, 0.20)";
  if (bounded < 4.5) return "rgba(47, 111, 87, 0.20)";
  return "rgba(31, 138, 112, 0.20)";
}

function upliftGap(score: ScoreSet): number {
  const target = score.target ?? 0;
  const current = score.current ?? 0;
  return Math.max(target - current, 0);
}

function visibleFloor(value: number, floor = 0.05): number {
  return Math.max(value, floor);
}

function weightedGap(score: ScoreSet, weight = 1): number {
  return upliftGap(score) * weight;
}

function toQuestionNode(
  question: Question,
  mode: ScoreMode,
  parentId: string
): RadialNode {
  const modeValue = metricValue(question.score, mode);
  const gap = weightedGap(question.score, question.weight ?? 1);

  return {
    id: question.id,
    name: question.prompt,
    value: visibleFloor(gap, 0.03),
    weight: question.weight ?? 1,
    nodeType: "question",
    parentId,
    score: question.score,
    itemStyle: {
      color: questionBandColor(modeValue),
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

  const elementGap = weightedGap(element.score, element.weight ?? 1);

  const elementValue = includeQuestions
    ? visibleFloor(questionValueTotal, 0.05)
    : visibleFloor(elementGap, 0.05);

  return {
    id: element.id,
    name: element.title,
    value: elementValue,
    weight: element.weight ?? 1,
    nodeType: "element",
    parentId,
    score: element.score,
    itemStyle: {
      color: scoreBandColor(modeValue),
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
        color: "rgba(51, 65, 85, 0.96)",
      },
      children,
    },
  ];
}

function isSelectedOrAncestor(node: RadialNode, selectedElementId?: string): boolean {
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
            : 0.9
          : 0.24,
        shadowBlur: isDirectSelection ? 18 : 0,
        shadowColor: isDirectSelection
          ? "rgba(2, 6, 23, 0.35)"
          : "transparent",
      },
      children: node.children
        ? applySelectionState(node.children, selectedElementId)
        : undefined,
    };
  });
}

function findNodeById(nodes: RadialNode[], id: string): RadialNode | undefined {
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
  const current = activeNode?.score?.current ?? 0;
  const target = activeNode?.score?.target ?? 0;
  const gapValue =
    typeof current === "number" && typeof target === "number"
      ? Math.max(target - current, 0)
      : undefined;
  const gap = typeof gapValue === "number" ? gapValue.toFixed(1) : "-";

  const activeScore: ScoreSet = activeNode?.score ?? { current: 0 };

  return {
    backgroundColor: "#dbe4ea",
    animation: true,

    tooltip: {
      trigger: "item",
      backgroundColor: "#10131a",
      borderColor: "#2a3342",
      borderWidth: 1,
      padding: 10,
      textStyle: {
        color: "#e7edf5",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 12,
      },
      formatter: (params: any) => {
        const d = params?.data;
        const score = d?.score ?? {};

        return [
          `<strong>${d?.name ?? ""}</strong>`,
          `Mode: ${mode}`,
          `Current: ${formatScore(score.current)}`,
          `Benchmark: ${formatScore(score.benchmark)}`,
          `Target: ${formatScore(score.target)}`,
          `Variance: ${formatScore(score.variance)}`,
          `Confidence: ${formatScore(score.confidence)}`,
        ].join("<br/>");
      },
      confine: true,
    },

    graphic: [
      {
        type: "group",
        left: "center",
        top: "center",
        silent: true,
        children: [
          {
            type: "text",
            style: {
              text: centerTitle,
              fill: "#f8fafc",
              font: "600 11px Inter, system-ui, sans-serif",
            },
            x: -46,
            y: -16,
          },
          {
            type: "text",
            style: {
              text: `${centreMetricLabel(mode)} ${centreMetricValue(
                mode,
                activeScore
              )}`,
              fill: "#dbeafe",
              font: "600 9px Inter, system-ui, sans-serif",
            },
            x: -34,
            y: 12,
          },
          {
            type: "text",
            style: {
              text: `Gap ${gap}`,
              fill: "#cbd5e1",
              font: "9px Inter, system-ui, sans-serif",
            },
            x: -15,
            y: 24,
          },
        ],
      },
    ],

    series: [
      {
        type: "sunburst",
        data: displayData,
        radius: includeQuestions ? ["22%", "88%"] : ["26%", "86%"],
        center: ["50%", "52%"],
        minAngle: 10,
        sort: undefined,
        nodeClick: false,
        selectedMode: "single",

        emphasis: {
          focus: "ancestor",
          itemStyle: {
            opacity: 0.95,
            shadowBlur: 12,
            shadowColor: "rgba(79, 140, 255, 0.28)",
          },
        },

        blur: {
          itemStyle: {
            opacity: 0.48,
          },
        },

        label: {
          show: false,
        },

        itemStyle: {
          borderColor: "rgba(15, 23, 42, 0.45)",
          borderWidth: 1.1,
          opacity: 0.96,
        },

        levels: [
          {},
          {
            r0: "0%",
            r: includeQuestions ? "22%" : "26%",
            itemStyle: {
              color: "#334155",
              borderWidth: 1.2,
              borderColor: "#0f172a",
            },
          },
          {
            r0: includeQuestions ? "22%" : "26%",
            r: includeQuestions ? "44%" : "48%",
            itemStyle: {
              borderWidth: 1,
              borderColor: "rgba(15, 23, 42, 0.20)",
            },
          },
          {
            r0: includeQuestions ? "44%" : "48%",
            r: includeQuestions ? "66%" : "68%",
            itemStyle: {
              borderWidth: 1,
              borderColor: "rgba(15, 23, 42, 0.28)",
            },
          },
          ...(includeQuestions
            ? [
                {
                  r0: "66%",
                  r: "88%",
                  itemStyle: {
                    borderWidth: 0.9,
                    borderColor: "rgba(15, 23, 42, 0.14)",
                  },
                },
              ]
            : [
                {
                  r0: "48%",
                  r: "86%",
                  itemStyle: {
                    borderWidth: 1,
                    borderColor: "rgba(15, 23, 42, 0.30)",
                  },
                },
              ]),
        ],
      },
    ],
  };
}