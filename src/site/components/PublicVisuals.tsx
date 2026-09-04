export function UnderstandingSystem({compact=false}:{compact?:boolean}) {
  return <div className={compact?"system-map system-map--compact":"system-map"} role="img" aria-label="Knowledge and evidence flow through OASIS into organisational decisions and learning">
    <div className="system-map__orbit" aria-hidden="true"/><div className="system-map__sources"><Node label="People" detail="Judgement"/><Node label="Knowledge" detail="Context"/><Node label="Evidence" detail="Support"/></div>
    <div className="system-map__core"><span>OASIS</span><strong>Connected understanding</strong></div>
    <div className="system-map__outcomes"><Node label="Decisions" detail="Transparent"/><Node label="Capability" detail="Governable"/><Node label="Learning" detail="Continuous"/></div>
  </div>;
}
function Node({label,detail}:{label:string;detail:string}) { return <div className="system-node"><i aria-hidden="true"/><strong>{label}</strong><span>{detail}</span></div>; }

export function ArchitectureStack() {
  return <div className="architecture-stack" role="img" aria-label="OASIS architecture from enterprise systems through ECF and Runtime Intelligence to Enterprise Intelligence">
    <div className="architecture-stack__row architecture-stack__row--outcome"><small>Organisational outcome</small><strong>Enterprise Intelligence</strong><span>More transparent, confident and learnable decisions</span></div><div className="architecture-stack__connector"/>
    <div className="architecture-stack__row architecture-stack__row--runtime"><small>Evolving understanding layer</small><strong>Runtime Intelligence</strong><span>Connects context, claims, evidence, confidence and next action</span></div><div className="architecture-stack__connector"/>
    <div className="architecture-stack__row architecture-stack__row--foundation"><small>Shared semantic foundation</small><strong>Enterprise Capability Framework</strong><span>One governed model of capability and its relationships</span></div>
    <div className="architecture-stack__systems"><span>ERP</span><span>EAM</span><span>BIM</span><span>BI</span><span>People</span><span>Standards</span></div><p>OASIS complements the systems organisations already rely on. It does not replace their authority.</p>
  </div>;
}
export function EvidenceLoop() { const items=["Context","Claims","Evidence","Confidence","Action","Outcomes"]; return <div className="evidence-loop" aria-label="OASIS continuous understanding loop">{items.map((item,index)=><div key={item}><span>{String(index+1).padStart(2,"0")}</span><strong>{item}</strong></div>)}</div>; }
