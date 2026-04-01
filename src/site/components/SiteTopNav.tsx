import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/what-we-do", label: "What we do" },
  { to: "/platform", label: "Platform approach" },
  { to: "/oasis", label: "OASIS Suite" },
  { to: "/mvp-status", label: "MVP status" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteTopNav() {
  return (
    <div className="o-site-topnav">
      <nav className="o-site-topnav__nav" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              "o-site-topnav__link" +
              (isActive ? " o-site-topnav__link--active" : "")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}