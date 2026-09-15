import { SiteFrame } from "../components/SiteFrame";

export function ContactPage() {
  return <SiteFrame pageTitle="Contact">
    <header className="page-hero"><p className="eyebrow">Start a conversation</p><h1>Bring us an asset-management question that matters.</h1><p className="lede">A useful first conversation establishes what your organisation needs to understand, the decision or improvement it must support and whether a CORE pilot is an appropriate next step.</p></header>
    <section className="contact-panel"><div><p className="eyebrow">What to share</p><h2>Tell us where the current picture falls short.</h2><p>Describe the organisation or asset environment, the capability or decision that concerns you, the evidence already available and what a useful outcome would look like. We can then define a focused discovery or pilot scope.</p><a className="button" href="mailto:hello@intrinsicsystems.com.au?subject=CORE%20pilot%20conversation">hello@intrinsicsystems.com.au <span>↗</span></a></div><aside><p className="eyebrow">Reasons to begin</p><ul><li><span>01</span>Discuss a focused CORE pilot</li><li><span>02</span>Review an existing assessment or improvement programme</li><li><span>03</span>Explore ISO or GFMAM-aligned capability analysis</li><li><span>04</span>Clarify an asset-management improvement decision</li></ul></aside></section>
  </SiteFrame>;
}
