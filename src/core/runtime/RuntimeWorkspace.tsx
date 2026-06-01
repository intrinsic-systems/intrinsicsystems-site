import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function RuntimeWorkspace({ children }: Props) {
  return (
    <main
      style={{
        height: "100vh",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top, #0f172a 0%, #020617 60%)",
        padding: 32,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 420px",
          gap: 28,
          alignItems: "stretch",
          maxWidth: 1500,
          height: "100%",
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </main>
  );
}