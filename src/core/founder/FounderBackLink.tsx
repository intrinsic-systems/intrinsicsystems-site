import { Link } from "react-router-dom";

export function FounderBackLink() {
  return (
    <Link
      to="/founder"
      style={{
        display: "inline-flex",
        alignItems: "center",
        marginBottom: 16,
        padding: "8px 12px",
        borderRadius: 999,
        border: "1px solid rgba(14,118,168,0.28)",
        background: "#eaf6fd",
        color: "#0b6fa4",
        fontSize: 13,
        fontWeight: 700,
        textDecoration: "none",
      }}
    >
      ← Back to Founder Sandbox
    </Link>
  );
}