export function UnderstandingSystem({compact=false}:{compact?:boolean}) {
  return <div className={compact?"system-map system-map--compact":"system-map"} role="img" aria-label="Knowledge and evidence become connected organisational understanding">
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
  return <div className="retained-path" role="img" aria-label="A repeated assessment can lose context between engagements, while CORE retains evidence, reasoning, decisions and results as organisational understanding">
    <div className="retained-path__lane retained-path__lane--episodic">
      <div className="retained-path__label"><span>Point-in-time cycle</span><strong>Understanding is reconstructed</strong></div>
      <div className="retained-path__steps"><PathStep title="Assessment"/><PathArrow/><PathStep title="Report"/><PathArrow/><PathStep title="Project"/><PathBreak/><PathStep title="Reassess"/></div>
      <p>Context and reasoning can disperse as reports are filed, projects end and people change.</p>
    </div>
    <div className="retained-path__lane retained-path__lane--core">
      <div className="retained-path__label"><span>CORE</span><strong>Understanding remains with the organisation</strong></div>
      <div className="retained-path__core-flow"><div className="retained-path__inputs"><small>Knowledge</small><small>Evidence</small><small>Objectives</small><small>Constraints</small></div><div className="retained-path__hub"><span>CORE</span><strong>Retained organisational understanding</strong></div><div className="retained-path__outputs"><small>Decide</small><small>Plan</small><small>Deliver</small><small>Measure</small></div></div>
      <div className="retained-path__return"><span>Measured change updates the maintained capability position</span></div>
      <p>Specialists contribute where needed. Their evidence and reasoning become part of the organisation’s maintained understanding.</p>
    </div>
  </div>;
}

function PathStep({title}:{title:string}) { return <span className="retained-path__step">{title}</span>; }
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
