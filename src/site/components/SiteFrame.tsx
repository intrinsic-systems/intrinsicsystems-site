import { useEffect, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { SiteTopNav } from "./SiteTopNav";

export function SiteFrame({children,pageTitle}:{children:ReactNode;pageTitle:string}) {
  useEffect(()=>{document.title=`${pageTitle} — Intrinsic Systems`;},[pageTitle]);
  return <div className="site-shell"><a className="skip-link" href="#main-content">Skip to content</a><SiteTopNav/><main id="main-content">{children}</main><footer className="site-footer">
    <div><strong>Intrinsic Systems</strong><span>Better organisational understanding. Stronger capability. More confident improvement.</span></div>
    <nav aria-label="Footer"><NavLink to="/oasis">OASIS</NavLink><NavLink to="/about">About</NavLink><NavLink to="/contact">Contact</NavLink></nav>
    <small>© 2026 Intrinsic Systems. Brisbane, Australia.</small>
  </footer></div>;
}
