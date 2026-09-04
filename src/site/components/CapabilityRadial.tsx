import { useState } from "react";

const facets = [
  { id: "people", label: "People & knowledge", short: "People", x: 23, y: 25, detail: "Experience, judgement and organisational knowledge give evidence its operating context." },
  { id: "systems", label: "Systems & standards", short: "Systems", x: 77, y: 25, detail: "Authoritative systems and governed standards remain connected without being replaced." },
  { id: "evidence", label: "Claims & evidence", short: "Evidence", x: 23, y: 75, detail: "Traceable claims make support, uncertainty and limitations visible around the question." },
  { id: "decisions", label: "Decisions & outcomes", short: "Decisions", x: 77, y: 75, detail: "Accountable decisions and observed outcomes feed learning back into the shared view." },
] as const;

export function CapabilityRadial() {
  const [active, setActive] = useState<(typeof facets)[number]["id"]>("people");
  const selected = facets.find((facet) => facet.id === active)!;
  return <figure className="capability-radial">
    <div className="capability-radial__stage">
      <svg viewBox="0 0 800 800" aria-hidden="true" focusable="false">
        <defs><radialGradient id="radial-core"><stop offset="0" stopColor="#2282b8"/><stop offset="1" stopColor="#123b55"/></radialGradient><filter id="radial-shadow"><feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#123b55" floodOpacity=".2"/></filter></defs>
        <g className="radial-orbit radial-orbit--outer"><circle cx="400" cy="400" r="330"/><circle cx="400" cy="70" r="7"/><circle cx="730" cy="400" r="7"/><circle cx="400" cy="730" r="7"/><circle cx="70" cy="400" r="7"/></g>
        <g className="radial-orbit radial-orbit--middle"><circle cx="400" cy="400" r="250"/><circle cx="223" cy="223" r="8"/><circle cx="577" cy="223" r="8"/><circle cx="577" cy="577" r="8"/><circle cx="223" cy="577" r="8"/></g>
        <g className="radial-orbit radial-orbit--inner"><circle cx="400" cy="400" r="164"/></g>
        {facets.map((facet)=><path key={facet.id} className={`radial-link ${active===facet.id?"is-active":""}`} d={`M400 400 L${facet.x*8} ${facet.y*8}`}/>)}
        <circle className="radial-core-halo" cx="400" cy="400" r="118"/><circle className="radial-core" cx="400" cy="400" r="92" fill="url(#radial-core)" filter="url(#radial-shadow)"/>
        <text className="radial-core__small" x="400" y="376" textAnchor="middle">BOUNDED</text><text className="radial-core__title" x="400" y="406" textAnchor="middle">CAPABILITY</text><text className="radial-core__title" x="400" y="433" textAnchor="middle">QUESTION</text>
        <text className="radial-ring-label" x="400" y="210" textAnchor="middle">CAPABILITY CONTEXT</text><text className="radial-ring-label" x="400" y="126" textAnchor="middle">CONNECTED RELATIONSHIPS</text>
      </svg>
      {facets.map((facet)=><button key={facet.id} type="button" className={`radial-facet radial-facet--${facet.id} ${active===facet.id?"is-active":""}`} aria-pressed={active===facet.id} onMouseEnter={()=>setActive(facet.id)} onFocus={()=>setActive(facet.id)} onClick={()=>setActive(facet.id)}><span>{facet.short}</span><small>{facet.label}</small></button>)}
      <div className="capability-radial__flow" aria-hidden="true"><span>Understand</span><i>→</i><span>Decide</span><i>→</i><span>Act</span><i>→</i><span>Learn</span></div>
    </div>
    <figcaption className="capability-radial__caption"><div><span>Conceptual model</span><strong>{selected.label}</strong><p aria-live="polite">{selected.detail}</p></div><p>OASIS develops a connected view around the purpose at hand. The diagram explains the intended information relationships; it is not a representation of a live automated decision.</p></figcaption>
  </figure>;
}
