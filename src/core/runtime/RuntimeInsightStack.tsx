import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function RuntimeInsightStack({ children }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {children}
    </div>
  );
}