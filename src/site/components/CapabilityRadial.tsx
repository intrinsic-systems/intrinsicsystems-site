import { useRef, useState, type CSSProperties } from "react";

const facets = [
  { id: "people", label: "People & knowledge", short: "People", x: 23, y: 25, accent: "#a9d8c7", detail: "Experience and judgement explain how the organisation works in practice." },
  { id: "systems", label: "Systems & standards", short: "Systems", x: 77, y: 25, accent: "#73b9d8", detail: "Trusted systems and standards provide records, rules and shared reference points." },
  { id: "evidence", label: "Ideas & evidence", short: "Evidence", x: 23, y: 75, accent: "#e8b557", detail: "Evidence shows what supports an idea, where uncertainty remains and what needs another look." },
  { id: "decisions", label: "Decisions & learning", short: "Decisions", x: 77, y: 75, accent: "#8d9fe8", detail: "Decisions and their results add to what the organisation knows over time." },
] as const;

export function CapabilityRadial() {
  const [active, setActive] = useState<(typeof facets)[number]["id"]>("people");
  const detailRef = useRef<HTMLElement>(null);
  const selected = facets.find((facet) => facet.id === active)!;
  const selectAndReveal = (id: (typeof facets)[number]["id"]) => {
    setActive(id);
    window.requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };
  return <figure className="capability-radial">
    <div className="radial-reading-guide"><strong>How to read this</strong><span>Begin at the centre with a question your organisation needs to answer. Then select one of the four fields. Its explanation will appear below in the same colour.</span></div>
    <div className="capability-radial__stage" style={{ "--radial-accent": selected.accent } as CSSProperties}>
      <svg viewBox="0 0 800 800" aria-hidden="true" focusable="false">
        <defs><radialGradient id="radial-core"><stop offset="0" stopColor="#2282b8"/><stop offset="1" stopColor="#123b55"/></radialGradient><filter id="radial-shadow"><feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#123b55" floodOpacity=".2"/></filter></defs>
        <g className="radial-orbit radial-orbit--outer"><circle cx="400" cy="400" r="330"/><circle cx="400" cy="70" r="7"/><circle cx="730" cy="400" r="7"/><circle cx="400" cy="730" r="7"/><circle cx="70" cy="400" r="7"/></g>
        <g className="radial-orbit radial-orbit--middle"><circle cx="400" cy="400" r="250"/><circle cx="223" cy="223" r="8"/><circle cx="577" cy="223" r="8"/><circle cx="577" cy="577" r="8"/><circle cx="223" cy="577" r="8"/></g>
        <g className="radial-orbit radial-orbit--inner"><circle cx="400" cy="400" r="164"/></g>
        {facets.map((facet)=><path key={facet.id} className={`radial-link ${active===facet.id?"is-active":""}`} d={`M400 400 L${facet.x*8} ${facet.y*8}`}/>)}
        <circle className="radial-core-halo" cx="400" cy="400" r="118"/><circle className="radial-core" cx="400" cy="400" r="92" fill="url(#radial-core)" filter="url(#radial-shadow)"/>
        <text className="radial-core__small" x="400" y="376" textAnchor="middle">A QUESTION</text><text className="radial-core__title" x="400" y="406" textAnchor="middle">THAT</text><text className="radial-core__title" x="400" y="433" textAnchor="middle">MATTERS</text>
        <text className="radial-ring-label" x="400" y="210" textAnchor="middle">ORGANISATIONAL CONTEXT</text><text className="radial-ring-label" x="400" y="126" textAnchor="middle">CONNECTED VIEW</text>
      </svg>
      {facets.map((facet)=><button key={facet.id} type="button" style={{ "--radial-accent": facet.accent } as CSSProperties} className={`radial-facet radial-facet--${facet.id} ${active===facet.id?"is-active":""}`} aria-pressed={active===facet.id} onMouseEnter={()=>setActive(facet.id)} onFocus={()=>setActive(facet.id)} onClick={()=>selectAndReveal(facet.id)}><span>{facet.short}</span><small>{facet.label}</small></button>)}
      <div className="capability-radial__flow" aria-hidden="true"><span>Understand</span><i>→</i><span>Decide</span><i>→</i><span>Act</span><i>→</i><span>Learn</span></div>
    </div>
    <figcaption ref={detailRef} className="capability-radial__caption" style={{ "--radial-accent": selected.accent } as CSSProperties}><div key={selected.id}><span>The selected field</span><strong>{selected.label}</strong><p aria-live="polite">{selected.detail}</p></div></figcaption>
  </figure>;
}
