import { useEffect, useMemo, useRef } from "react";
import ReactECharts from "echarts-for-react";

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
  const shellRef = useRef<HTMLDivElement | null>(null);
  const resizeFrameRef = useRef<number | null>(null);

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

  useEffect(() => {
    const chart = chartRef.current?.getEchartsInstance?.();
    const shell = shellRef.current;
    if (!chart || !shell) return;

    const resizeChart = () => {
      if (resizeFrameRef.current) {
        cancelAnimationFrame(resizeFrameRef.current);
      }

      resizeFrameRef.current = requestAnimationFrame(() => {
        chart.resize();
      });
    };

    const observer = new ResizeObserver(() => {
      resizeChart();
    });

    observer.observe(shell);
    window.addEventListener("resize", resizeChart);

    const timeoutA = window.setTimeout(resizeChart, 60);
    const timeoutB = window.setTimeout(resizeChart, 180);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeChart);
      window.clearTimeout(timeoutA);
      window.clearTimeout(timeoutB);

      if (resizeFrameRef.current) {
        cancelAnimationFrame(resizeFrameRef.current);
      }
    };
  }, []);

  const minHeight = includeQuestions ? 500 : 440;

  return (
    <div
      ref={shellRef}
      className="h-full w-full bg-transparent"
      style={{
        minHeight,
        height: "100%",
      }}
    >
      <div
        className="h-full w-full overflow-hidden rounded-[1rem]"
        style={{
          minHeight,
        }}
      >
        <ReactECharts
          ref={chartRef}
          option={option}
          style={{
            height: "100%",
            width: "100%",
            minHeight,
          }}
          opts={{ renderer: "canvas", devicePixelRatio: 2 }}
          notMerge
          lazyUpdate
          onChartReady={(chart: any) => {
            requestAnimationFrame(() => chart.resize());
            window.setTimeout(() => chart.resize(), 120);
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