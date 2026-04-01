import { useMemo, useState } from "react";

type HierarchyQuestion = {
  id: string;
  label: string;
  scorePct: number;
  answered?: number;
  total?: number;
};

type HierarchyActivity = {
  id: string;
  label: string;
  scorePct: number;
  answered?: number;
  total?: number;
  questions: HierarchyQuestion[];
};

type HierarchyArea = {
  id: string;
  label: string;
  scorePct: number;
  answered?: number;
  total?: number;
  activities: HierarchyActivity[];
};

type HierarchySector = {
  id: string;
  label: string;
  scorePct: number;
  answered?: number;
  total?: number;
  areas: HierarchyArea[];
};

type Props = {
  sectors: HierarchySector[];
  title?: string;
  subtitle?: string;
};

function fmtCoverage(answered?: number, total?: number) {
  if (answered == null || total == null || total === 0) return null;
  return `${answered}/${total}`;
}

export function CapabilityHierarchyPanel({
  sectors,
  title = "Capability hierarchy view",
  subtitle = "Trace current position from sector through area, activity, and question level.",
}: Props) {
  const [openSectors, setOpenSectors] = useState<Record<string, boolean>>({});
  const [openAreas, setOpenAreas] = useState<Record<string, boolean>>({});
  const [openActivities, setOpenActivities] = useState<Record<string, boolean>>(
    {}
  );

  const sortedSectors = useMemo(
    () => [...sectors].sort((a, b) => a.scorePct - b.scorePct),
    [sectors]
  );

  const toggle = (
    id: string,
    setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ) => {
    setter((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="o-card o-card-pad">
      <div className="o-results-section-header">
        <h2 className="o-section-heading">{title}</h2>
        <div className="o-text-small">{subtitle}</div>
      </div>

      <div className="o-hierarchy">
        {sortedSectors.map((sector) => {
          const sectorOpen = !!openSectors[sector.id];

          return (
            <div key={sector.id} className="o-hierarchy__sector">
              <button
                type="button"
                className="o-hierarchy__row o-hierarchy__row--sector"
                onClick={() => toggle(sector.id, setOpenSectors)}
              >
                <div className="o-hierarchy__left">
                  <span className="o-hierarchy__toggle">
                    {sectorOpen ? "−" : "+"}
                  </span>
                  <span className="o-hierarchy__label">{sector.label}</span>
                </div>

                <div className="o-hierarchy__meta">
                  {fmtCoverage(sector.answered, sector.total) && (
                    <span className="o-hierarchy__coverage">
                      {fmtCoverage(sector.answered, sector.total)}
                    </span>
                  )}
                  <span className="o-hierarchy__score">{sector.scorePct}%</span>
                </div>
              </button>

              {sectorOpen && (
                <div className="o-hierarchy__children">
                  {sector.areas.map((area) => {
                    const areaOpen = !!openAreas[area.id];

                    return (
                      <div key={area.id} className="o-hierarchy__area">
                        <button
                          type="button"
                          className="o-hierarchy__row o-hierarchy__row--area"
                          onClick={() => toggle(area.id, setOpenAreas)}
                        >
                          <div className="o-hierarchy__left">
                            <span className="o-hierarchy__toggle">
                              {areaOpen ? "−" : "+"}
                            </span>
                            <span className="o-hierarchy__label">
                              {area.label}
                            </span>
                          </div>

                          <div className="o-hierarchy__meta">
                            {fmtCoverage(area.answered, area.total) && (
                              <span className="o-hierarchy__coverage">
                                {fmtCoverage(area.answered, area.total)}
                              </span>
                            )}
                            <span className="o-hierarchy__score">
                              {area.scorePct}%
                            </span>
                          </div>
                        </button>

                        {areaOpen && (
                          <div className="o-hierarchy__children">
                            {area.activities.map((activity) => {
                              const activityOpen = !!openActivities[activity.id];

                              return (
                                <div
                                  key={activity.id}
                                  className="o-hierarchy__activity"
                                >
                                  <button
                                    type="button"
                                    className="o-hierarchy__row o-hierarchy__row--activity"
                                    onClick={() =>
                                      toggle(activity.id, setOpenActivities)
                                    }
                                  >
                                    <div className="o-hierarchy__left">
                                      <span className="o-hierarchy__toggle">
                                        {activityOpen ? "−" : "+"}
                                      </span>
                                      <span className="o-hierarchy__label">
                                        {activity.label}
                                      </span>
                                    </div>

                                    <div className="o-hierarchy__meta">
                                      {fmtCoverage(
                                        activity.answered,
                                        activity.total
                                      ) && (
                                        <span className="o-hierarchy__coverage">
                                          {fmtCoverage(
                                            activity.answered,
                                            activity.total
                                          )}
                                        </span>
                                      )}
                                      <span className="o-hierarchy__score">
                                        {activity.scorePct}%
                                      </span>
                                    </div>
                                  </button>

                                  {activityOpen && (
                                    <div className="o-hierarchy__children">
                                      {activity.questions.map((question) => (
                                        <div
                                          key={question.id}
                                          className="o-hierarchy__row o-hierarchy__row--question"
                                        >
                                          <div className="o-hierarchy__left">
                                            <span className="o-hierarchy__dot" />
                                            <span className="o-hierarchy__label">
                                              {question.label}
                                            </span>
                                          </div>

                                          <div className="o-hierarchy__meta">
                                            {fmtCoverage(
                                              question.answered,
                                              question.total
                                            ) && (
                                              <span className="o-hierarchy__coverage">
                                                {fmtCoverage(
                                                  question.answered,
                                                  question.total
                                                )}
                                              </span>
                                            )}
                                            <span className="o-hierarchy__score">
                                              {question.scorePct}%
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}