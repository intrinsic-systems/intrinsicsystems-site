export function UnderstandingSystem({compact=false}:{compact?:boolean}) {
  return <div className={compact?"system-map system-map--compact":"system-map"} role="img" aria-label="Knowledge and evidence become connected organisational understanding">
    <div className="system-map__orbit" aria-hidden="true"/><div className="system-map__sources"><Node label="People" detail="Judgement"/><Node label="Knowledge" detail="Context"/><Node label="Evidence" detail="Support"/></div>
    <div className="system-map__core"><span>INTRINSIC</span><strong>Connected understanding</strong></div>
    <div className="system-map__outcomes"><Node label="Decisions" detail="Clearer"/><Node label="Capability" detail="Stronger"/><Node label="Learning" detail="Continuous"/></div>
  </div>;
}
function Node({label,detail}:{label:string;detail:string}) { return <div className="system-node"><i aria-hidden="true"/><strong>{label}</strong><span>{detail}</span></div>; }

export function ArchitectureStack() {
  return <><div className="architecture-stack" role="img" aria-label="Intrinsic Systems framework from enterprise systems through a shared capability model and evolving understanding to organisational intelligence">
    <div className="architecture-stack__row architecture-stack__row--outcome"><small>What it supports</small><strong>Enterprise Intelligence</strong><span>Clearer decisions that people can explain and learn from</span></div><div className="architecture-stack__connector"/>
    <div className="architecture-stack__row architecture-stack__row--runtime"><small>How the picture develops</small><strong>Runtime</strong><span>Chooses what to examine next and updates the picture as evidence and conditions change</span></div><div className="architecture-stack__connector"/>
    <div className="architecture-stack__row architecture-stack__row--foundation"><small>Shared structure</small><strong>Enterprise Capability Framework</strong><span>Organises capability and shows how its parts are connected</span></div>
    <div className="architecture-stack__systems"><span>ERP</span><span>EAM</span><span>BIM</span><span>BI</span><span>People</span><span>Standards</span></div><p>The framework works alongside these trusted sources and helps people understand them together.</p>
  </div><div className="journey-intro"><span>From input to action</span><strong>CORE starts the picture. Runtime helps it develop.</strong><p>CORE provides the initial input experience and capability baseline. The Runtime works behind and alongside it: choosing what needs another look, connecting relevant evidence and showing why a finding or next action follows.</p></div><ExperienceJourney /></>;
}
export function EvidenceLoop() { const items=["Context","Ideas","Evidence","Confidence","Action","Learning"]; return <div className="evidence-loop" aria-label="Continuous organisational understanding loop">{items.map((item,index)=><div key={item}><span>{String(index+1).padStart(2,"0")}</span><strong>{item}</strong></div>)}</div>; }

const understandingJourney = [
  { number: "01", label: "Baseline", title: "See where things stand", body: "Create a useful point-in-time picture of organisational capability." },
  { number: "02", label: "Focus", title: "Ask what matters next", body: "Direct attention towards the questions most likely to improve understanding." },
  { number: "03", label: "Evidence", title: "Test the picture", body: "Connect claims with relevant evidence, context and informed judgement." },
  { number: "04", label: "Understanding", title: "Make the reasoning visible", body: "Show what is supported, what remains uncertain and why it matters." },
  { number: "05", label: "Action", title: "Choose the next step", body: "Help accountable people decide what to clarify, monitor or improve." },
  { number: "06", label: "Learning", title: "Keep the picture current", body: "Use outcomes and changing conditions to shape the next question." },
] as const;

export function UnderstandingJourney() {
  return <div className="understanding-journey" role="img" aria-label="A capability baseline develops through focus, evidence, supported understanding, action and learning">
    <div className="understanding-journey__track" aria-hidden="true"><span/><i>Understanding develops</i></div>
    <div className="understanding-journey__steps">{understandingJourney.map((item,index)=><article className={index===0?"is-baseline":index===understandingJourney.length-1?"is-learning":""} key={item.number}>
      <div><span>{item.number}</span><small>{item.label}</small></div><strong>{item.title}</strong><p>{item.body}</p>
    </article>)}</div>
    <div className="understanding-journey__return"><span aria-hidden="true">↶</span><strong>Learning shapes the next question.</strong></div>
  </div>;
}

const journey = [
  { number: "01", title: "CORE input", body: "Your organisation establishes an initial capability baseline." },
  { number: "02", title: "Runtime enquiry and evidence", body: "The Runtime identifies what to examine next and what evidence may strengthen the picture." },
  { number: "03", title: "Supported understanding", body: "Findings show what is supported, what remains uncertain and what may affect other areas." },
  { number: "04", title: "Your next action", body: "Accountable people decide what to clarify, monitor or improve." },
] as const;

export function ExperienceJourney() {
  return <div className="experience-journey" aria-label="From CORE input through Runtime enquiry and evidence to supported understanding and your next action">
    {journey.map((item,index)=><div className="experience-journey__step" key={item.number}>
      <span>{item.number}</span><strong>{item.title}</strong><p>{item.body}</p>{index<journey.length-1?<i aria-hidden="true">→</i>:null}
    </div>)}
  </div>;
}
