import React from "react";

type ContextAsideItem = {
  title: string;
  body: string;
};

type ContextAsideProps = {
  eyebrow?: string;
  title: string;
  items: ContextAsideItem[];
  footer?: React.ReactNode;
};

export function ContextAside({
  eyebrow,
  title,
  items,
  footer,
}: ContextAsideProps) {
  return (
    <aside
      className="o-card o-page-aside o-side-context-card o-card-pad"
      style={{
        background: "rgba(56,132,255,0.06)",
        border: "1px solid rgba(56,132,255,0.18)",
      }}
    >
      {eyebrow ? <div className="o-text-label">{eyebrow}</div> : null}

      <h3
        style={{
          fontSize: 15,
          margin: eyebrow ? "6px 0 12px" : "0 0 12px",
        }}
      >
        {title}
      </h3>

      <div
        className="o-stack-sm o-text-small"
        style={{ color: "var(--oasis-text-secondary)" }}
      >
        {items.map((item) => (
          <div key={item.title}>
            <strong className="o-context-aside__item-title">
              {item.title}
            </strong>
            <div>{item.body}</div>
          </div>
        ))}
      </div>

      {footer ? (
        <div className="o-divider-subtle o-text-small">{footer}</div>
      ) : null}
    </aside>
  );
}