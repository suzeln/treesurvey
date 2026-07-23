import {
  Activity,
  BookOpen,
  Boxes,
  ChevronDown,
  Database,
  GitBranch,
  LayoutDashboard,
  Orbit,
  Radio,
  Search,
  Trees,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/live-data", label: "Live Data", icon: Orbit },
  { to: "/explorer", label: "Forest Explorer", icon: Trees },
  { to: "/trees", label: "Tree Catalog", icon: Database },
  { to: "/surveys", label: "Survey Sessions", icon: Radio },
  { to: "/digital-twin", label: "Digital Twin", icon: Boxes },
  { to: "/analysis", label: "Analysis", icon: Activity },
  { to: "/methods", label: "Methods", icon: BookOpen },
];

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">
            <Trees size={22} strokeWidth={1.8} />
          </span>
          <span>
            <strong>TreeTwin</strong>
            <small>HKUST Research Platform</small>
          </span>
        </NavLink>

        <nav className="main-nav" aria-label="Primary navigation">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <button className="icon-button" aria-label="Search platform">
            <Search size={18} />
          </button>
          <div className="system-state">
            <span className="state-pulse" />
            <span>
              <b>Research mode</b>
              <small>Static data provider</small>
            </span>
            <ChevronDown size={14} />
          </div>
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>

      <footer className="app-statusbar">
        <span><span className="status-dot" /> Platform ready</span>
        <span className="statusbar-spacer" />
        <span><GitBranch size={13} /> frontend/0.1.0</span>
        <span>Local survey metres</span>
        <span>HKUST · Clear Water Bay</span>
      </footer>
    </div>
  );
}
