import { useEffect, useRef, useState, type CSSProperties } from "react";

const facets = [
  { id: "people", label: "People & knowledge", short: "People", x: 23, y: 25, accent: "#a9d8c7", radar: [0.92, 0.76, 0.6, 0.68, 0.8, 0.58], detail: "Experience and judgement explain how the organisation works in practice." },
  { id: "systems", label: "Systems & standards", short: "Systems", x: 77, y: 25, accent: "#73b9d8", radar: [0.62, 0.94, 0.85, 0.72, 0.6, 0.78], detail: "Trusted systems and standards provide records, rules and shared reference points." },
  { id: "evidence", label: "Ideas & evidence", short: "Evidence", x: 23, y: 75, accent: "#e8b557", radar: [0.74, 0.58, 0.96, 0.64, 0.86, 0.7], detail: "Evidence shows what supports an idea, where uncertainty remains and what needs another look." },
  { id: "decisions", label: "Decisions & learning", short: "Decisions", x: 77, y: 75, accent: "#8d9fe8", radar: [0.8, 0.7, 0.66, 0.95, 0.74, 0.88], detail: "Decisions and their results add to what the organisation knows over time." },
] as const;

const question = {
  id: "question",
  label: "A question that matters",
  accent: "#73b9d8",
  radar: [0.72, 0.72, 0.72, 0.72, 0.72, 0.72],
  detail: "A question gives the analysis its purpose. It helps the framework identify relevant context, examine supporting evidence and explain how each finding and next action follows.",
} as const;

type SelectionId = (typeof facets)[number]["id"] | typeof question.id;

const radarVertices = (weights: readonly number[], radius = 164) => weights.map((weight, index) => {
  const angle = -Math.PI / 2 + index * (Math.PI * 2 / weights.length);
  return { x: 400 + Math.cos(angle) * radius * weight, y: 400 + Math.sin(angle) * radius * weight };
});

const radarPoints = (weights: readonly number[], radius = 164) => radarVertices(weights, radius).map(({ x, y }) => `${x},${y}`).join(" ");

const radarFrame = [1, 1, 1, 1, 1, 1] as const;

export function CapabilityRadial() {
  const [active, setActive] = useState<SelectionId>("question");
  const detailRef = useRef<HTMLElement>(null);
  const selected = active === "question" ? question : facets.find((facet) => facet.id === active)!;
  const currentRadar = radarPoints(selected.radar);
  const previousRadar = useRef(currentRadar);
  useEffect(() => { previousRadar.current = currentRadar; }, [currentRadar]);
  const selectAndReveal = (id: SelectionId) => {
    setActive(id);
    window.requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };
  return <figure className="capability-radial">
    <div className="radial-reading-guide"><strong>How to read this</strong><span>Begin at the centre with a question your organisation needs to answer. Then select one of the four lenses. The illustrative domain profile changes with the view, and its explanation appears below in the same colour.</span></div>
    <div className="capability-radial__stage" style={{ "--radial-accent": selected.accent } as CSSProperties}>
      <svg viewBox="0 0 800 800" aria-hidden="true" focusable="false">
        <defs><radialGradient id="radial-core"><stop offset="0" stopColor="#2282b8"/><stop offset="1" stopColor="#123b55"/></radialGradient><filter id="radial-shadow"><feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#123b55" floodOpacity=".2"/></filter></defs>
        <g className="radial-orbit radial-orbit--outer"><circle cx="400" cy="400" r="330"/><circle cx="400" cy="70" r="7"/><circle cx="730" cy="400" r="7"/><circle cx="400" cy="730" r="7"/><circle cx="70" cy="400" r="7"/></g>
        <g className="radial-orbit radial-orbit--middle"><circle cx="400" cy="400" r="250"/><circle cx="223" cy="223" r="8"/><circle cx="577" cy="223" r="8"/><circle cx="577" cy="577" r="8"/><circle cx="223" cy="577" r="8"/></g>
        <g className="radial-radar-grid">
          <polygon points={radarPoints(radarFrame, 56)}/><polygon points={radarPoints(radarFrame, 110)}/><polygon points={radarPoints(radarFrame)}/>
          {radarVertices(radarFrame).map(({ x, y }, index)=><line key={index} x1="400" y1="400" x2={x} y2={y}/>)}
        </g>
        <polygon className="radial-radar-profile" points={currentRadar}>
          <animate key={active} attributeName="points" from={previousRadar.current} to={currentRadar} dur="650ms" calcMode="spline" keySplines="0.22 1 0.36 1" fill="freeze"/>
        </polygon>
        {facets.map((facet)=><path key={facet.id} className={`radial-link ${active===facet.id?"is-active":""}`} d={`M400 400 L${facet.x*8} ${facet.y*8}`}/>)}
        <circle className="radial-core-halo" cx="400" cy="400" r="118"/><circle className="radial-core" cx="400" cy="400" r="92" fill="url(#radial-core)" filter="url(#radial-shadow)"/>
        <text className="radial-ring-label" x="400" y="210" textAnchor="middle">ORGANISATIONAL CONTEXT</text><text className="radial-ring-label" x="400" y="126" textAnchor="middle">CONNECTED VIEW</text>
      </svg>
      <button type="button" className={`radial-core-control ${active==="question"?"is-active":""}`} aria-pressed={active==="question"} onFocus={()=>setActive("question")} onClick={()=>selectAndReveal("question")}><span>A question</span><strong>That<br/>matters</strong></button>
      {facets.map((facet)=><button key={facet.id} type="button" style={{ "--radial-accent": facet.accent } as CSSProperties} className={`radial-facet radial-facet--${facet.id} ${active===facet.id?"is-active":""}`} aria-pressed={active===facet.id} onFocus={()=>setActive(facet.id)} onClick={()=>selectAndReveal(facet.id)}><span>{facet.short}</span><small>{facet.label}</small></button>)}
      <div className="capability-radial__flow" aria-hidden="true"><span>Understand</span><i>→</i><span>Decide</span><i>→</i><span>Act</span><i>→</i><span>Learn</span></div>
    </div>
    <figcaption ref={detailRef} className="capability-radial__caption" style={{ "--radial-accent": selected.accent } as CSSProperties}><div key={selected.id}><span>{active === "question" ? "The starting point" : "The selected field"}</span><strong>{selected.label}</strong><p aria-live="polite">{selected.detail}</p></div></figcaption>
  </figure>;
}
