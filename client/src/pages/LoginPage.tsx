import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  CheckCircle2,
  Globe2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { login } from "../api";
export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("project@nlams.demo"); const [password, setPassword] = useState("Project@123"); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); setError(""); try { await login(email, password); navigate("/"); } catch (err) { setError(err instanceof Error ? err.message : "Unable to sign in"); } finally { setBusy(false); } }
  return (
    <div className="login-page">
      <div className="login-left">
        <div className="brand login-brand">
          <div className="brand-mark">
            <Globe2 size={21} />
          </div>
          <div>
            <strong>N-LAMS</strong>
            <span>National monitoring layer</span>
          </div>
        </div>
        <div className="login-copy">
          <div className="eyebrow">
            <span className="live-dot" /> GOVERNMENT DIGITAL INFRASTRUCTURE
          </div>
          <h1>One connected view for land acquisition.</h1>
          <p>
            Monitor cases, workflows, documents, compensation, and R&R while
            existing systems remain authoritative.
          </p>
          <div className="login-proof">
            <div>
              <CheckCircle2 size={17} />
              <span>Common national data model</span>
            </div>
            <div>
              <CheckCircle2 size={17} />
              <span>Configurable workflow orchestration</span>
            </div>
            <div>
              <CheckCircle2 size={17} />
              <span>Audit-ready by default</span>
            </div>
          </div>
        </div>
        <span className="login-footer">
          SIH 2026 demonstration · Demo data only
        </span>
      </div>
      <div className="login-form-wrap">
        <div className="login-form">
          <div className="eyebrow">SECURE ACCESS</div>
          <h2>Sign in to N-LAMS</h2>
          <p>Demo environment only. Select a role account to explore role-based access.</p>
          <label className="input-label">
            Email address
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="input-label">
            Password
            <div className="password-input">
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              <LockKeyhole size={16} />
            </div>
          </label>
          <div className="form-row">
            <label>
              <input type="checkbox" defaultChecked /> Remember this device
            </label>
            <a href="#reset">Forgot password?</a>
          </div>
          {error && <div className="login-note">{error}</div>}
          <button
            className="button button-primary full"
            onClick={submit} disabled={busy}
          >
            {busy ? "Signing in…" : "Sign in to demo"} <ArrowUpRight size={16} />
          </button>
          <div className="login-note">
            <ShieldCheck size={15} /> Demo credentials are local-only. Production mode validates Supabase JWTs.
          </div>
        </div>
      </div>
    </div>
  );
}
