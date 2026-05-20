import React from "react";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  summary?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

export function PageIntro({
  eyebrow,
  title,
  summary,
  icon,
  children,
}: PageIntroProps) {
  return (
    <div
      className="o-page-intro"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 18,
      }}
    >
      {icon ? <div style={{ flex: "0 0 auto" }}>{icon}</div> : null}

      <div style={{ minWidth: 0 }}>
        {eyebrow ? (
          <div
            style={{
              fontSize: 12,
              color: "var(--oasis-text-muted)",
              marginBottom: 6,
            }}
          >
            {eyebrow}
          </div>
        ) : null}

        <h2 className="o-section-title">{title}</h2>

        {summary ? (
          <div
            className="o-text-body"
            style={{ marginBottom: children ? 14 : 0 }}
          >
            {summary}
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}