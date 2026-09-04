import { useState } from "react";
import { NavLink } from "react-router-dom";
import { OasisLogo } from "../../components/OasisLogo";

const NAV_ITEMS = [{to:"/",label:"Home"},{to:"/oasis",label:"OASIS"},{to:"/about",label:"About"},{to:"/contact",label:"Contact"}] as const;

export function SiteTopNav() {
  const [open,setOpen]=useState(false);
  return <header className="site-header">
    <NavLink to="/" aria-label="Intrinsic Systems home" className="site-brand"><OasisLogo variant="horizontal" height={42}/></NavLink>
    <button className="site-menu" aria-expanded={open} aria-controls="site-nav" onClick={()=>setOpen(!open)}><span/><span/><span/><b className="sr-only">Menu</b></button>
    <nav id="site-nav" className={open?"site-nav is-open":"site-nav"} aria-label="Primary">
      {NAV_ITEMS.map(item=><NavLink key={item.to} to={item.to} end={item.to==="/"} onClick={()=>setOpen(false)} className={({isActive})=>isActive?"site-nav__link is-active":"site-nav__link"}>{item.label}</NavLink>)}
      <NavLink to="/contact" className="button button--small">Start a conversation</NavLink>
    </nav>
  </header>;
}
