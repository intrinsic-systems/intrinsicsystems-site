export function UnderstandingSystem({compact=false}:{compact?:boolean}) {
  return <div className={compact?"system-map system-map--compact":"system-map"} role="img" aria-label="Knowledge and evidence become connected organisational understanding">
    <div className="system-map__orbit" aria-hidden="true"/><div className="system-map__sources"><Node label="People" detail="Judgement"/><Node label="Knowledge" detail="Context"/><Node label="Evidence" detail="Support"/></div>
    <div className="system-map__core"><span>INTRINSIC</span><strong>Connected understanding</strong></div>
    <div className="system-map__outcomes"><Node label="Decisions" detail="Clearer"/><Node label="Capability" detail="Stronger"/><Node label="Learning" detail="Continuous"/></div>
  </div>;
}
function Node({label,detail}:{label:string;detail:string}) { return <div className="system-node"><i aria-hidden="true"/><strong>{label}</strong><span>{detail}</span></div>; }

export function ArchitectureStack() {
  return <div className="architecture-stack" role="img" aria-label="Intrinsic Systems framework from enterprise systems through a shared capability model and evolving understanding to organisational intelligence">
    <div className="architecture-stack__row architecture-stack__row--outcome"><small>What it supports</small><strong>Enterprise Intelligence</strong><span>Clearer decisions that people can explain and learn from</span></div><div className="architecture-stack__connector"/>
    <div className="architecture-stack__row architecture-stack__row--runtime"><small>How the picture develops</small><strong>Runtime Intelligence</strong><span>Updates understanding as context, evidence and decisions change</span></div><div className="architecture-stack__connector"/>
    <div className="architecture-stack__row architecture-stack__row--foundation"><small>Shared structure</small><strong>Enterprise Capability Framework</strong><span>Organises capability and shows how its parts are connected</span></div>
    <div className="architecture-stack__systems"><span>ERP</span><span>EAM</span><span>BIM</span><span>BI</span><span>People</span><span>Standards</span></div><p>The framework works alongside these trusted sources and helps people understand them together.</p>
  </div>;
}
export function EvidenceLoop() { const items=["Context","Ideas","Evidence","Confidence","Action","Learning"]; return <div className="evidence-loop" aria-label="Continuous organisational understanding loop">{items.map((item,index)=><div key={item}><span>{String(index+1).padStart(2,"0")}</span><strong>{item}</strong></div>)}</div>; }
