import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  FileCheck2,
  LockKeyhole,
} from "lucide-react";
import { cases, projects } from "../data/demo";
import { StatusBadge } from "../components/common";

const monthly = [
  { m: "Apr", v: 18 },
  { m: "May", v: 23 },
  { m: "Jun", v: 20 },
  { m: "Jul", v: 31 },
  { m: "Aug", v: 38 },
  { m: "Sep", v: 47 },
];
export function DashboardPage() {
  const stats = [
    {
      label: "Total projects",
      value: "05",
      delta: "+2 this quarter",
      icon: BriefcaseBusiness,
    },
    {
      label: "Acquisition cases",
      value: "20",
      delta: "+12.4% vs last month",
      icon: FileCheck2,
    },
    {
      label: "Cases at risk",
      value: "03",
      delta: "2 need attention",
      icon: AlertTriangle,
    },
    {
      label: "Pending approvals",
      value: "07",
      delta: "Across 4 departments",
      icon: Clock3,
    },
  ];
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span className="live-dot" /> LIVE MONITORING · 10 SEP 2026
          </div>
          <h1>Good afternoon, Jury members</h1>
          <p>
            One connected view across departments, states, and systems of
            record.
          </p>
        </div>
        <div className="heading-actions">
          <button className="button button-secondary">Export report</button>
          <button className="button button-primary">＋ New project</button>
        </div>
      </div>
      <div className="trust-banner">
        <div className="trust-icon">
          <LockKeyhole size={18} />
        </div>
        <div>
          <strong>
            N-LAMS is an orchestration layer, not a replacement system.
          </strong>
          <span>
            External references remain authoritative while this portal unifies
            progress, documents, workflows, and decisions.
          </span>
        </div>
        <Link to="/integrations">
          View integration status <ArrowUpRight size={15} />
        </Link>
      </div>
      <div className="stat-grid">
        {stats.map(({ label, value, delta, icon: Icon }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon blue">
              <Icon size={19} />
            </div>
            <div className="stat-label">{label}</div>
            <strong className="stat-value">{value}</strong>
            <span className="stat-delta">
              <ArrowUpRight size={13} /> {delta}
            </span>
          </div>
        ))}
      </div>
      <div className="content-grid dashboard-grid">
        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Acquisition progress</h2>
              <p>Cases moved through workflow stages</p>
            </div>
            <select defaultValue="Last 90 days">
              <option>Last 90 days</option>
              <option>Last 6 months</option>
            </select>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2541b2" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#2541b2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e8edf3" />
                <XAxis dataKey="m" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#2541b2"
                  fill="url(#progressFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Portfolio pulse</h2>
              <p>Current attention required</p>
            </div>
          </div>
          <div className="attention-list">
            {cases
              .filter((c) => c.risk !== "Low")
              .map((c) => (
                <Link
                  to={`/cases/${c.id}`}
                  className="attention-item"
                  key={c.id}
                >
                  <div className={`risk-marker ${c.risk.toLowerCase()}`} />
                  <div className="attention-main">
                    <strong>{c.caseId}</strong>
                    <span>{c.projectName}</span>
                  </div>
                  <div className="attention-meta">
                    <StatusBadge status={c.status} />
                    <span>{c.stage}</span>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
      <div className="content-grid dashboard-grid second-row">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Project portfolio</h2>
              <p>Live demo data from the canonical project model</p>
            </div>
            <Link to="/projects" className="text-link">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          {projects.slice(0, 3).map((p) => (
            <Link
              className="attention-item"
              to={`/projects/${p.id}`}
              key={p.id}
            >
              <div className="attention-main">
                <strong>{p.name}</strong>
                <span>
                  {p.department} · {p.state}
                </span>
              </div>
              <div className="attention-meta">
                <StatusBadge status={p.status} />
                <span>{p.progress}% progress</span>
              </div>
              <ArrowUpRight size={15} />
            </Link>
          ))}
        </section>
        <section className="panel quick-panel">
          <div className="panel-heading">
            <div>
              <h2>System pulse</h2>
              <p>Connected sources and freshness</p>
            </div>
          </div>
          <div className="pulse-list">
            <div className="pulse-row">
              <div className="pulse-icon">●</div>
              <div>
                <strong>Bhoomi Rashi</strong>
                <span>Synced 12 min ago</span>
              </div>
              <span className="connection">
                <i />
                Connected
              </span>
            </div>
            <div className="pulse-row">
              <div className="pulse-icon mock">●</div>
              <div>
                <strong>PFMS (demo adapter)</strong>
                <span>Synced 18 min ago</span>
              </div>
              <span className="connection mock">
                <i />
                Mock
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
