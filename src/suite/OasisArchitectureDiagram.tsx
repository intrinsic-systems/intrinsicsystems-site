export function OasisArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 520 520"
      role="img"
      aria-label="OASIS suite architecture diagram"
      style={{
        width: "100%",
        height: "auto",
        display: "block",
      }}
    >
      <defs>
        <radialGradient id="oasisGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(43,108,176,0.28)" />
          <stop offset="65%" stopColor="rgba(43,108,176,0.08)" />
          <stop offset="100%" stopColor="rgba(43,108,176,0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="520" height="520" rx="28" fill="transparent" />

      <circle cx="260" cy="260" r="165" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      <circle cx="260" cy="260" r="110" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
      <circle cx="260" cy="260" r="58" fill="url(#oasisGlow)" stroke="#1e90ff" strokeWidth="3" />

      <text
        x="260"
        y="245"
        textAnchor="middle"
        fill="#ffffff"
        style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.08em" }}
      >
        CORE
      </text>

      <text
        x="260"
        y="274"
        textAnchor="middle"
        fill="rgba(255,255,255,0.78)"
        style={{ fontSize: 11, fontWeight: 500 }}
      >
        Governance &amp; Intelligence
      </text>

      <text x="260" y="78" textAnchor="middle" fill="rgba(255,255,255,0.88)" style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.1em" }}>
        PULSE
      </text>
      <text x="146" y="160" textAnchor="middle" fill="rgba(255,255,255,0.88)" style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.1em" }}>
        ATLAS
      </text>
      <text x="116" y="272" textAnchor="middle" fill="rgba(255,255,255,0.88)" style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.1em" }}>
        NEXUS
      </text>
      <text x="374" y="272" textAnchor="middle" fill="rgba(255,255,255,0.88)" style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.1em" }}>
        HORIZON
      </text>
      <text x="260" y="398" textAnchor="middle" fill="rgba(255,255,255,0.88)" style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.1em" }}>
        PATHWAYS
      </text>
    </svg>
  );
}