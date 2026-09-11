import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Activity,
  Bell,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  CircleDollarSign,
  Database,
  FileCheck2,
  FileText,
  Globe2,
  LayoutDashboard,
  MapPinned,
  Menu,
  MoreHorizontal,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const navGroups = [
  [
    ["Dashboard", "/", LayoutDashboard],
    ["Projects", "/projects", BriefcaseBusiness],
    ["Acquisition cases", "/cases", FileCheck2],
    ["GIS map", "/map", MapPinned],
  ],
  [
    ["Documents", "/documents", FileText],
    ["Compensation", "/compensation", CircleDollarSign],
    ["R&R", "/rr", Building2],
    ["Reports", "/reports", Activity],
  ],
  [
    ["Users & roles", "/users", Users],
    ["Audit logs", "/audit", ShieldCheck],
    ["Integrations", "/integrations", Database],
  ],
] as const;
export function PortalLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="app-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="main-shell">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark">
          <Globe2 size={20} />
        </div>
        <div>
          <strong>N-LAMS</strong>
          <span>National monitoring layer</span>
        </div>
        <button className="icon-button mobile-close" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="demo-pill">
        <span className="live-dot" /> DEMO ENVIRONMENT
      </div>
      <nav>
        {navGroups.map((group, index) => (
          <div className="nav-group" key={index}>
            {index > 0 && <div className="nav-divider" />}
            {group.map(([label, to, Icon]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
                {label === "Acquisition cases" && <b>20</b>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="integration-note">
          <Activity size={15} />
          <div>
            <strong>Integration layer</strong>
            <span>Systems of record stay connected</span>
          </div>
        </div>
        <div className="profile-mini">
          <div className="avatar avatar-sm">NS</div>
          <div>
            <strong>Nova-X</strong>
            <span>Ministry dashboard</span>
          </div>
          <MoreHorizontal size={17} />
        </div>
      </div>
    </aside>
  );
}
function Topbar({ onMenu }: { onMenu: () => void }) {
  const location = useLocation();
  const title = location.pathname.startsWith("/projects/")
    ? "Project workspace"
    : location.pathname.startsWith("/cases/")
      ? "Acquisition case"
      : location.pathname === "/"
        ? "National overview"
        : location.pathname.slice(1).replace("-", " ");
  return (
    <header className="topbar">
      <button className="icon-button menu-button" onClick={onMenu}>
        <Menu size={21} />
      </button>
      <div className="crumb">
        <span>Portal</span>
        <ChevronRight size={14} />
        <strong>{title}</strong>
      </div>
      <div className="top-actions">
        <div className="global-search">
          <span>⌕</span>
          <input placeholder="Search case, project, parcel…" />
        </div>
        <button className="icon-button notification">
          <Bell size={19} />
          <i />
        </button>
        <div className="top-profile">
          <div className="avatar">NS</div>
          <div>
            <strong>National Admin</strong>
            <span>SUPER_ADMIN</span>
          </div>
          <ChevronRight size={15} />
        </div>
      </div>
    </header>
  );
}
