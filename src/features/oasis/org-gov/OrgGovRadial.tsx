import { useEffect, useMemo, useRef } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsType } from "echarts/core";

import { buildOrgGovSunburstOption, toSunburstData } from "./orgGovSunburst";
import type { DomainNode, ScoreMode } from "./orgGovTypes";

type OrgGovRadialProps = {
  domain: DomainNode;
  mode: ScoreMode;
  includeQuestions?: boolean;
  selectedElementId?: string;
  onSelectElement?: (elementId?: string) => void;
};

export function OrgGovRadial({
  domain,
  mode,
  includeQuestions = false,
  selectedElementId,
  onSelectElement,
}: OrgGovRadialProps) {
  const chartRef = useRef<ReactECharts | null>(null);

  const data = useMemo(
    () => toSunburstData(domain, mode, includeQuestions),
    [domain, mode, includeQuestions]
  );

  const option = useMemo(
    () =>
      buildOrgGovSunburstOption(
        data,
        mode,
        includeQuestions,
        selectedElementId
      ),
    [data, mode, includeQuestions, selectedElementId]
  );

  const selectableIds = useMemo(
    () => new Set(domain.elements.map((element) => element.id)),
    [domain]
  );

  useEffect(() => {
    const chart = chartRef.current?.getEchartsInstance?.();
    if (!chart) return;

    const zr = chart.getZr();

    const handleBlankClick = (event: unknown) => {
      const target = (event as { target?: unknown } | undefined)?.target;

      if (!target) {
        onSelectElement?.(undefined);
      }
    };

    zr.on("click", handleBlankClick);

    return () => {
      zr.off("click", handleBlankClick);
    };
  }, [onSelectElement]);

  return (
    <div className="h-full w-full rounded-[1rem] bg-slate-800/70 p-2 shadow-inner">
      <div className="h-full w-full overflow-hidden rounded-[0.9rem] border border-slate-700/60 bg-slate-700/40">
        <ReactECharts
          ref={chartRef}
          option={option}
          style={{
            height: "100%",
            width: "100%",
          }}
          opts={{ renderer: "canvas" }}
          notMerge
          lazyUpdate
          onChartReady={(chart: EChartsType) => {
            chart.resize();
          }}
          onEvents={{
            click: (params: any) => {
              const nodeId = params?.data?.id;

              if (!nodeId || nodeId === domain.id) {
                return;
              }

              if (selectableIds.has(nodeId)) {
                onSelectElement?.(
                  nodeId === selectedElementId ? undefined : nodeId
                );
              }
            },
            globalout: () => {
              // intentionally do nothing
            },
          }}
        />
      </div>
    </div>
  );
}