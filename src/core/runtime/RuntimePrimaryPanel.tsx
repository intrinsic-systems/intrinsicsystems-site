import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function RuntimePrimaryPanel({ children }: Props) {
  return (
    <section
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        borderRadius: 28,
        border: "1px solid rgba(96,165,250,0.14)",
        background:
          "radial-gradient(circle at center, rgba(15,23,42,0.52), rgba(2,6,23,0.12))",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {children}
      </div>
    </section>
  );
}