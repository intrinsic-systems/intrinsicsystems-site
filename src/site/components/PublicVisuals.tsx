export function UnderstandingSystem({compact=false}:{compact?:boolean}) {
  return <div className={compact?"system-map system-map--compact":"system-map"} role="img" aria-label="Knowledge and evidence become connected organisational understanding">
    <svg className="system-map__flow" viewBox="0 0 600 500" aria-hidden="true">
      <path d="M108 150 C194 150 218 206 260 236"/><path d="M108 250 C182 250 214 250 252 250"/><path d="M108 350 C194 350 218 294 260 264"/>
      <path d="M340 236 C382 206 406 150 492 150"/><path d="M348 250 C386 250 418 250 492 250"/><path d="M340 264 C382 294 406 350 492 350"/>
      <g className="system-map__signals">
        <circle r="4"><animateMotion dur="5.8s" repeatCount="indefinite" path="M108 150 C194 150 218 206 260 236"/></circle><circle r="4"><animateMotion begin="-1.9s" dur="5.8s" repeatCount="indefinite" path="M108 250 C182 250 214 250 252 250"/></circle><circle r="4"><animateMotion begin="-3.8s" dur="5.8s" repeatCount="indefinite" path="M108 350 C194 350 218 294 260 264"/></circle>
        <circle r="4"><animateMotion begin="-2.9s" dur="5.8s" repeatCount="indefinite" path="M340 236 C382 206 406 150 492 150"/></circle><circle r="4"><animateMotion begin="-1s" dur="5.8s" repeatCount="indefinite" path="M348 250 C386 250 418 250 492 250"/></circle><circle r="4"><animateMotion begin="-4.8s" dur="5.8s" repeatCount="indefinite" path="M340 264 C382 294 406 350 492 350"/></circle>
      </g>
    </svg>
    <div className="system-map__orbit" aria-hidden="true"/><div className="system-map__sources"><Node label="People" detail="Judgement"/><Node label="Knowledge" detail="Context"/><Node label="Evidence" detail="Support"/></div>
    <div className="system-map__core"><span>INTRINSIC</span><strong>Connected understanding</strong></div>
    <div className="system-map__outcomes"><Node label="Decisions" detail="Clearer"/><Node label="Capability" detail="Stronger"/><Node label="Learning" detail="Continuous"/></div>
  </div>;
}
function Node({label,detail}:{label:string;detail:string}) { return <div className="system-node"><i aria-hidden="true"/><strong>{label}</strong><span>{detail}</span></div>; }

const coreInputs = [
  { label: "People & experience", className: "core-intake__source--people" },
  { label: "Systems & data", className: "core-intake__source--systems" },
  { label: "Operational evidence", className: "core-intake__source--evidence" },
  { label: "Standards & obligations", className: "core-intake__source--standards" },
  { label: "Strategy & priorities", className: "core-intake__source--strategy" },
  { label: "Risk & constraints", className: "core-intake__source--risk" },
] as const;

export function CoreInformationIntake() {
  return <figure className="core-intake" role="img" aria-label="CORE brings together people and experience, systems and data, operational evidence, standards and obligations, strategy and priorities, and risk and constraints into one maintained capability position">
    <div className="core-intake__stage">
      <svg viewBox="0 0 600 520" aria-hidden="true">
        <circle className="core-intake__orbit core-intake__orbit--outer" cx="300" cy="260" r="186" />
        <circle className="core-intake__orbit core-intake__orbit--inner" cx="300" cy="260" r="130" />
        <path className="core-intake__flow core-intake__flow--one" d="M110 118 C185 120 206 176 256 222" />
        <path className="core-intake__flow core-intake__flow--two" d="M490 118 C415 120 394 176 344 222" />
        <path className="core-intake__flow core-intake__flow--three" d="M82 260 C164 260 202 260 242 260" />
        <path className="core-intake__flow core-intake__flow--four" d="M518 260 C436 260 398 260 358 260" />
        <path className="core-intake__flow core-intake__flow--five" d="M110 402 C185 400 206 344 256 298" />
        <path className="core-intake__flow core-intake__flow--six" d="M490 402 C415 400 394 344 344 298" />
        <g className="core-intake__signals">
          <circle r="4"><animateMotion dur="5.4s" repeatCount="indefinite" path="M110 118 C185 120 206 176 256 222" /></circle>
          <circle r="4"><animateMotion begin="-1.8s" dur="5.4s" repeatCount="indefinite" path="M490 118 C415 120 394 176 344 222" /></circle>
          <circle r="4"><animateMotion begin="-3.6s" dur="5.4s" repeatCount="indefinite" path="M82 260 C164 260 202 260 242 260" /></circle>
          <circle r="4"><animateMotion begin="-2.7s" dur="5.4s" repeatCount="indefinite" path="M518 260 C436 260 398 260 358 260" /></circle>
          <circle r="4"><animateMotion begin="-.9s" dur="5.4s" repeatCount="indefinite" path="M110 402 C185 400 206 344 256 298" /></circle>
          <circle r="4"><animateMotion begin="-4.5s" dur="5.4s" repeatCount="indefinite" path="M490 402 C415 400 394 344 344 298" /></circle>
        </g>
      </svg>
      {coreInputs.map(item=><span className={`core-intake__source ${item.className}`} key={item.label}>{item.label}</span>)}
      <div className="core-intake__core"><span>CORE</span><strong>Maintained capability position</strong></div>
    </div>
    <figcaption>Relevant organisational knowledge is brought together, tested and retained—not left scattered across reports and systems.</figcaption>
  </figure>;
}

export function ArchitectureStack() {
  return <><div className="architecture-stack" role="img" aria-label="Intrinsic Systems framework from enterprise systems through a shared capability model and evolving understanding to organisational intelligence">
    <div className="architecture-stack__row architecture-stack__row--outcome"><small>What it supports</small><strong>Organisation-owned improvement</strong><span>Decisions and plans that people can explain, govern and learn from</span></div><div className="architecture-stack__connector"/>
    <div className="architecture-stack__row architecture-stack__row--runtime"><small>How the picture develops</small><strong>Runtime guidance</strong><span>Examines what matters next and updates the picture as evidence and conditions change</span></div><div className="architecture-stack__connector"/>
    <div className="architecture-stack__row architecture-stack__row--foundation"><small>Shared structure</small><strong>Asset-management capability model</strong><span>Organises capability, standards alignment and the relationships between them</span></div>
    <div className="architecture-stack__systems"><span>ERP</span><span>EAM</span><span>BIM</span><span>BI</span><span>People</span><span>Standards</span></div><p>The framework works alongside these trusted sources and helps people understand them together.</p>
  </div><div className="journey-intro"><span>From input to action</span><strong>CORE starts the picture. Runtime helps it develop.</strong><p>CORE provides the initial input experience and capability baseline. The Runtime works behind and alongside it: choosing what needs another look, connecting relevant evidence and showing why a finding or next action follows.</p></div><ExperienceJourney /></>;
}
export function EvidenceLoop() { const items=["Context","Ideas","Evidence","Confidence","Action","Learning"]; return <div className="evidence-loop" aria-label="Continuous organisational understanding loop">{items.map((item,index)=><div key={item}><span>{String(index+1).padStart(2,"0")}</span><strong>{item}</strong></div>)}</div>; }

export function RetainedUnderstandingPath() {
  const [selected,setSelected] = useState<string | null>(null);
  const detail = selected ? retainedPathDetails[selected] : null;
  const choose = (key:string) => setSelected(current=>current===key?null:key);
  return <div className="retained-path" aria-label="A repeated assessment can lose context between engagements, while CORE retains evidence, reasoning, decisions and results as organisational understanding">
    <div className="retained-path__lane retained-path__lane--episodic">
      <div className="retained-path__label"><span>Point-in-time cycle</span><strong>Understanding is reconstructed</strong></div>
      <div className="retained-path__steps"><PathStep title="Assessment" itemKey="assessment" selected={selected} onChoose={choose}/><PathArrow/><PathStep title="Report" itemKey="report" selected={selected} onChoose={choose}/><PathArrow/><PathStep title="Project" itemKey="project" selected={selected} onChoose={choose}/><PathBreak/><PathStep title="Reassess" itemKey="reassess" selected={selected} onChoose={choose}/></div>
      <p>Context and reasoning can disperse as reports are filed, projects end and people change.</p>
    </div>
    <div className="retained-path__lane retained-path__lane--core">
      <div className="retained-path__label"><span>CORE</span><strong>Understanding remains with the organisation</strong></div>
      <div className="retained-path__core-flow"><div className="retained-path__inputs">{["Knowledge","Evidence","Objectives","Constraints"].map(label=><PathToken key={label} label={label} selected={selected} onChoose={choose}/>)}</div><button type="button" className={selected==="core"?"retained-path__hub is-active":"retained-path__hub"} aria-pressed={selected==="core"} onClick={()=>choose("core")}><span>CORE</span><strong>Retained organisational understanding</strong></button><div className="retained-path__outputs">{["Decide","Plan","Deliver","Measure"].map(label=><PathToken key={label} label={label} selected={selected} onChoose={choose}/>)}</div></div>
      <div className="retained-path__return"><span>Measured change updates the maintained capability position</span></div>
      <p>Specialists contribute where needed. Their evidence and reasoning become part of the organisation’s maintained understanding.</p>
    </div>
    {detail?<div className="retained-path__detail" id="retained-path-detail" aria-live="polite"><span>{detail.group}</span><strong>{detail.title}</strong><p>{detail.body}</p><button type="button" onClick={()=>setSelected(null)} aria-label="Close explanation">×</button></div>:null}
  </div>;
}

const retainedPathDetails:Record<string,{group:string;title:string;body:string}> = {
  assessment:{group:"Point-in-time cycle",title:"Assessment",body:"A defined set of questions establishes a view at one moment. The answers may be valuable, but the reasoning and operational context are often held outside the assessment itself."},
  report:{group:"Point-in-time cycle",title:"Report",body:"Findings are summarised for decision-makers. Once separated from the people, evidence and assumptions behind them, those findings become harder to revisit or update."},
  project:{group:"Point-in-time cycle",title:"Project",body:"Improvement activity begins from selected findings. Delivery knowledge can develop separately from the original assessment, weakening the connection between diagnosis, action and measured result."},
  reassess:{group:"Point-in-time cycle",title:"Reassess",body:"A later review may repeat questions and reconstruct context because the prior evidence, reasoning and delivery learning were not maintained as one organisational record."},
  knowledge:{group:"What CORE brings together",title:"Knowledge",body:"The practical experience and informed judgement held by the people who understand how the organisation and its assets actually operate."},
  evidence:{group:"What CORE brings together",title:"Evidence",body:"Documents, records, observations and system information that support, qualify or challenge the organisation’s current understanding."},
  objectives:{group:"What CORE brings together",title:"Objectives",body:"The operational, service, financial and organisational outcomes that determine what improvement should achieve in this organisation."},
  constraints:{group:"What CORE brings together",title:"Constraints",body:"Risk, capacity, dependencies, obligations and practical limits that shape which actions are viable, valuable and appropriately timed."},
  core:{group:"Maintained understanding",title:"CORE",body:"CORE keeps capability findings connected to their evidence, context, confidence, decisions and subsequent results so the organisation can extend its understanding instead of rebuilding it."},
  decide:{group:"What CORE supports",title:"Decide",body:"Accountable people can see what is supported, what remains uncertain and which capability constraints matter before choosing a course of action."},
  plan:{group:"What CORE supports",title:"Plan",body:"Priorities become a governed improvement path with intended outcomes, responsibilities, dependencies and a clear basis for specialist support."},
  deliver:{group:"What CORE supports",title:"Deliver",body:"Internal teams or external specialists act against a better-defined scope while the organisation retains the reasoning behind the work."},
  measure:{group:"What CORE supports",title:"Measure",body:"Delivery evidence and changing conditions update the maintained capability position, making the next review a continuation rather than a restart."},
};

function PathStep({title,itemKey,selected,onChoose}:{title:string;itemKey:string;selected:string|null;onChoose:(key:string)=>void}) { return <button type="button" className={selected===itemKey?"retained-path__step is-active":"retained-path__step"} aria-pressed={selected===itemKey} aria-controls="retained-path-detail" onClick={()=>onChoose(itemKey)}>{title}<i aria-hidden="true">+</i></button>; }
function PathToken({label,selected,onChoose}:{label:string;selected:string|null;onChoose:(key:string)=>void}) { const key=label.toLowerCase(); return <button type="button" className={selected===key?"retained-path__token is-active":"retained-path__token"} aria-pressed={selected===key} aria-controls="retained-path-detail" onClick={()=>onChoose(key)}>{label}<i aria-hidden="true">+</i></button>; }
function PathArrow() { return <i className="retained-path__arrow" aria-hidden="true">→</i>; }
function PathBreak() { return <i className="retained-path__break" aria-hidden="true"><b>knowledge fades</b></i>; }

const understandingJourney = [
  { number: "01", label: "Scope", title: "Define the outcome", body: "Agree what the organisation needs to understand and the decisions the work must support." },
  { number: "02", label: "Baseline", title: "Establish the position", body: "Bring relevant people, operational context and existing information into the starting view." },
  { number: "03", label: "Evidence", title: "Test what is understood", body: "Connect material findings with evidence, informed judgement and uncertainty." },
  { number: "04", label: "Decision", title: "Determine what matters", body: "Consider capability constraints alongside risk, value, capacity and organisational goals." },
  { number: "05", label: "Plan", title: "Govern the way forward", body: "Define actions, responsibilities, dependencies, intended benefits and the support required." },
  { number: "06", label: "Measure", title: "Retain what is learned", body: "Use delivery results and changing conditions to update the maintained capability position." },
] as const;

export function UnderstandingJourney() {
  return <div className="understanding-journey" role="img" aria-label="A CORE engagement moves from defining the outcome through baseline, evidence, decisions and planning to measured organisational learning">
    <div className="understanding-journey__track" aria-hidden="true"><span/><i>Understanding develops</i></div>
    <div className="understanding-journey__steps">{understandingJourney.map((item,index)=><article className={index===0?"is-baseline":index===understandingJourney.length-1?"is-learning":""} key={item.number}>
      <div><span>{item.number}</span><small>{item.label}</small></div><strong>{item.title}</strong><p>{item.body}</p>
    </article>)}</div>
    <div className="understanding-journey__return"><span aria-hidden="true">↶</span><strong>Measured change becomes part of the organisation’s retained understanding.</strong></div>
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

export function ExecutiveViewTeaser() {
  const views = [
    {label:"Capability position",title:"Where do we stand?",body:"A connected view across the capabilities in scope."},
    {label:"Priority constraint",title:"What is limiting the outcome?",body:"Material constraints considered against risk, value and organisational purpose."},
    {label:"Evidence confidence",title:"What can we rely on?",body:"Visible support, uncertainty and matters requiring attention."},
    {label:"Governed action",title:"What happens next?",body:"A clear enquiry, decision or improvement action with accountable ownership."},
  ] as const;
  return <figure className="executive-teaser" role="img" aria-label="Illustrative executive capability view showing capability position, priority constraints, evidence confidence and governed next action">
    <div className="executive-teaser__bar"><div><span>Illustrative executive capability view</span><strong>Experience under development</strong></div><i aria-hidden="true"/><i aria-hidden="true"/><i aria-hidden="true"/></div>
    <div className="executive-teaser__body"><div className="executive-teaser__profile"><span>Maintained capability position</span><svg viewBox="0 0 300 300" aria-hidden="true"><g className="executive-teaser__grid"><polygon points="150,32 252,91 252,209 150,268 48,209 48,91"/><polygon points="150,72 217,111 217,189 150,228 83,189 83,111"/><line x1="150" y1="32" x2="150" y2="268"/><line x1="48" y1="91" x2="252" y2="209"/><line x1="252" y1="91" x2="48" y2="209"/></g><polygon className="executive-teaser__profile-shape" points="150,62 221,109 204,183 150,232 91,184 73,105"/></svg><strong>See the whole position—and what shapes it.</strong></div><div className="executive-teaser__views">{views.map((view,index)=><article key={view.label}><b>{String(index+1).padStart(2,"0")}</b><div><span>{view.label}</span><strong>{view.title}</strong><p>{view.body}</p></div></article>)}</div></div>
    <figcaption>The executive view is intended to expose the evidence and reasoning behind the picture, not simply report a score.</figcaption>
  </figure>;
}
import { useState } from "react";
