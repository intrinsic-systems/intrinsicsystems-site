import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function RuntimeSidebar({ children }: Props) {
  return (
    <aside
      style={{
        height: "100%",
        overflow: "hidden",
        borderRadius: 24,
        border: "1px solid rgba(96,165,250,0.10)",
        background: "rgba(2,6,23,0.28)",
      }}
    >
      <div
        style={{
          height: "100%",
          overflowY: "auto",
          paddingRight: 10,
          paddingBottom: 32,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </aside>
  );
}